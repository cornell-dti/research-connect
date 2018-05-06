let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, verify, mongoose} = require('../common.js');

//finds lab where lab admin = {adminNetId}, undefined if the id can't be fine in any lab
function findLabWithAdmin(labs, adminNetId) {
    return labs.filter(function (lab) {
        return lab.labAdmins.includes(adminNetId);
    })[0];
}

app.get('/check/:opportunityId', function(req, res){
    var idToCheck = req.query.netId;
    console.log("THIS IS WHERE WE START");

    opportunityModel.findById(req.params.opportunityId, function (err, opportunity) {
        //console.log(err);
        console.log("callback function is being run");
        //console.log(opportunity);
        if(opportunity==null){
            console.log("could not find matching opportunity");
            res.send(false);
            return;
        }else{
            var toSearch = opportunity.applications;
            for (var i = 0; i<toSearch.length; i++){
                if (toSearch[i].undergradNetId === idToCheck) {
                    console.log("You have already applied to this lab");
                    res.send(true);
                    return;
                }
            }
            console.log("You have not yet applied to this lab");
            res.send(false);
        }
    });
});

/*
app.get('/check/:opportunityId', function(req, res){
    var idToCheck = req.query.netId;
    console.log(idToCheck);
    opportunityModel.findById(req.params.opportunityId, function (err, opportunity) {
        if (err) {
            return err;
        }
        var toSearch = opportunity.applications;
        console.log(toSearch);
        for (var i = 0; i<toSearch.length; i++){
            if (toSearch[i].undergradNetId === idToCheck) {
                console.log("You have already applied to this lab");
                res.send(true);
                return;
            }
        }
        console.log("We are here");
        res.send(false);
        console.log("You did not apply previously");
        return;
    });
});
*/

//previous POST /getOpportunity
//gets the opportunity given its object id
app.get('/:id', function (req, res) {
    console.log("token: " + req.query.netId);
    verify(req.query.netId, function (tokenNetId) {
        console.log("toke net id: " + tokenNetId);
        opportunityModel.findById(req.params.id).lean().exec(function (err, opportunity) {
            if (err) {
                debug(err);
                res.send(err);
            }
            labModel.find({}, function (err2, labs) {
                if (err2) {
                    debug(err);
                    res.send(err);
                    return;
                }
                let labAdmins = [];
                for (let i = 0; i < labs.length; i++) {
                    let currentLab = labs[i];
                    for (let j = 0; j < currentLab.opportunities.length; j++) {
                        if (currentLab.opportunities[j].toString() === req.params.id) {
                            opportunity.labPage = currentLab.labPage;
                            opportunity.labDescription = currentLab.labDescription;
                            opportunity.labName = currentLab.name;
                            console.log("found it");
                            console.log(currentLab);
                            labAdmins = currentLab.labAdmins;
                        }
                    }
                }
                console.log("here");
                console.log(labAdmins);
                labAdministratorModel.findOne(
                    {
                        $and: [
                            {netId: {$in: labAdmins}},
                            {role: {$in: ["pi", "postdoc", "grad", "staffscientist", "labtech"]}}
                        ]
                    },
                    function (err, labAdmin) {
                        debug(labAdmin);
                        opportunity.pi = labAdmin.firstName + " " + labAdmin.lastName;
                        undergradModel.findOne({netId: tokenNetId}, function (error3, student) {
                            if (student === undefined) {
                                opportunity.student = {
                                    "firstName": "rachel",
                                    "lastName": "nash",
                                    "gradYear": 2020,
                                    "major": "Computer Science",
                                    "gpa": 4.3,
                                    "netId": "rsn55",
                                    "courses": [
                                        "CS 1110",
                                        "INFO 4998",
                                        "CS 3110"
                                    ],
                                    "skills": [
                                        "HTML"
                                    ]
                                }
                            }
                            else {
                                opportunity.student = student;
                            }
                            res.send(opportunity);
                        });
                    });
            });
        });
    });
});

//previously POST /getOpportunitiesListing
app.get('/', function (req, res) {

    //list courses that are prereqs that can be skipped or are the same
    //make sure no spaces inbetween course letters and numbers
    let coursePrereqs = {
        "CS1110": ["CS2110", "CS2112", "CS3110"],
        "CS1112": ["CS2110", "CS2112", "CS3110"],
        "CS2110": ["CS2112"],
        "CHEM2090": ["CHEM2080"]
    };

    let token = req.query.netId;
    if (token != undefined) {
        verify(token, function (undergradNetId) {
            console.log("here! " + undergradNetId);
            //find the undergrad so we can get their info to determine the "preqreqs match" field
            undergradModel.findOne({netId: undergradNetId}, function (err, undergrad) {
                let undergrad1 = undergrad;
                //if they're a lab admin, show them all
                if (undergrad1 === undefined || undergrad1 === null) {
                    opportunityModel.find({
                        opens: {
                            $lte: new Date()
                        },
                        closes: {
                            $gte: new Date()
                        }
                    }, function (err, opportunities) {
                        for (let i = 0; i < opportunities.length; i++) {
                            opportunities[i]["prereqsMatch"] = true;
                        }
                        return res.send(opportunities);
                    })
                } else {
                    undergrad1.courses = undergrad1.courses.map(course => replaceAll(course, " ", ""));
                    debug(undergrad1);
                    debug("test");
                    //only get the ones that are currenlty open
                    opportunityModel.find({
                        opens: {
                            $lte: new Date()
                        },
                        closes: {
                            $gte: new Date()
                        }
                    }).lean().exec(function (err, opportunities) {
                        let labs = [];
                        //get all the labs so you have the info to update
                        labModel.find({}, function (labErr, labs2) {
                            labs = labs2;
                            for (let i = 0; i < opportunities.length; i++) {
                                let prereqsMatch = false;
                                opportunities[i].requiredClasses = opportunities[i].requiredClasses.map(course => replaceAll(course, " ", ""));
                                // checks for gpa, major, and gradYear
                                if (opportunities[i].minGPA <= undergrad1.gpa &&
                                    opportunities[i].requiredClasses.every(function (val) {
                                        //Check for synonymous courses, or courses where you can skip the prereqs

                                        if (!undergrad1.courses.includes(val)) {
                                            let courseSubs = coursePrereqs[val];
                                            if (courseSubs !== undefined) {
                                                return undergrad1.courses.some(function (course) {
                                                    return courseSubs.includes(course);
                                                });
                                            }
                                            return false;
                                        }
                                        return true;    //if it's contained in the undergrad1 courses straight off the bat
                                    }) &&
                                    opportunities[i].yearsAllowed.includes(gradYearToString(undergrad1.gradYear))) {
                                    prereqsMatch = true;
                                }
                                debug("h");
                                let thisLab = findLabWithAdmin(labs, opportunities[i].creatorNetId);
                                //prevent "undefined" values if there's some error
                                if (thisLab === undefined) thisLab = {name: "", labPage: "", labDescription: ""};
                                opportunities[i]["prereqsMatch"] = prereqsMatch;
                                opportunities[i]["labName"] = thisLab.name;
                                opportunities[i]["labPage"] = thisLab.labPage;
                                opportunities[i]["labDescription"] = thisLab.labDescription;
                                debug(opportunities[i]);
                                debug(Object.getOwnPropertyNames(opportunities[i]));

                            }
                            res.send(opportunities);
                        });
                        for (let i = 0; i < opportunities.length; i++) {
                            debug(opportunities[i].prereqsMatch);
                        }
                        if (err) {
                            //handle the error appropriately
                            res.send(err);
                        }
                    });
                }
            });
        });
    }
    else {
        opportunityModel.find({
            opens: {
                $lte: new Date()
            },
            closes: {
                $gte: new Date()
            }
        }, function (err, opportunities) {
            for (let i = 0; i < opportunities.length; i++) {
                opportunities[i]["prereqsMatch"] = true;
            }
            res.send(opportunities);
        })
    }
});

//previously POST /createOpportunity
app.post('/', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    debug(data);

    console.log("netid: " + data.creatorNetId);
    console.log("labpage: " + data.labPage);
    console.log("title: " + data.title);
    console.log("projDesc: " + data.projectDescription);
    console.log("undergradTasks: " + data.undergradTasks);
    console.log("qualifs: " + data.qualifications);
    console.log("supervisor: " + data.supervisor);
    // console.log("spots" + data.spots);
    console.log("startSeason: " + data.startSeason);
    console.log("startYear: " + data.startYear);
    console.log("apps: " + data.applications);
    console.log("yearsAllowed: " + data.yearsAllowed);
    console.log("majorsAllowed: " + data.majorsAllowed);
    console.log("question 1: " + JSON.parse(JSON.stringify(data.questions))["q0"]);
    console.log("question 2: " + JSON.parse(JSON.stringify(data.questions))["q1"]);
    console.log("requiredClasses: " + data.requiredClasses);
    console.log("minGPA: " + data.minGPA);
    console.log("minHours: " + data.minHours);
    console.log("maxHours: " + data.maxHours);
    console.log("opens: " + data.opens);
    console.log("closes: " + data.closes);
    console.log("areas: " + data.areas);
    let maxHours = 168;
    if (data.maxHours !== undefined && data.maxHours !== null) {
        maxHours = data.maxHours;
    }

    // decryptGoogleToken(data.creatorNetId, function (tokenBody) {
    //     let netId = email.replace("@cornell.edu", "");
    let netId = data.netId;
    let opportunity = new opportunityModel({
        creatorNetId: netId,
        labPage: data.labPage,
        title: data.title,
        projectDescription: data.projectDescription,
        undergradTasks: data.undergradTasks,
        qualifications: data.qualifications,
        supervisor: data.supervisor,
        // spots: data.spots,
        startSeason: data.startSeason,
        startYear: data.startYear,
        applications: data.applications, //missing
        yearsAllowed: data.yearsAllowed,
        majorsAllowed: data.majorsAllowed, //missing
        questions: data.questions,
        requiredClasses: data.requiredClasses,
        minGPA: data.minGPA,
        minHours: data.minHours,
        maxHours: maxHours,
        opens: data.opens,
        closes: data.closes,
        areas: data.areas
    });

    opportunity.save(function (err, response) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            console.log(err);
        }
        let oppId = response.id;
        labModel.findOne(
            {labAdmins: netId}
            , function (error, lab) {
                let opps = lab.opportunities;
                opps.push(mongoose.Types.ObjectId(oppId));
                lab.opportunities = opps;
                lab.markModified("opportunities");
                lab.save(function (saveError, response) {
                });
            });
    });

    let opportunityMajor = req.body.majorsAllowed;

    undergradModel.find({
            $or: [
                {major: opportunityMajor},
                {secondMajor: opportunityMajor},
                {minor: opportunityMajor}
            ]
        },
        function (err, studentsWhoMatch) {
            for (let undergrad1 in studentsWhoMatch) {
                const msg = {
                    to: studentsWhoMatch[undergrad1].netId + '@cornell.edu',
                    from: 'dhruvbaijal@gmail.com',
                    subject: 'New Research Opportunity Available!',
                    html: 'Hi,\n' +
                    'A new opportunity was just posted in an area you expressed interest in - ' +
                    opportunityMajor + '. You can apply to it here: http://research-connect.com/opportunity/' + opportunity._id + '\n' +
                    '\n' + //TODO  change localhost:3000 to our domain!!! and fix line spacing
                    'Thanks,\n' +
                    'The Research Connect Team\n'
                };

                // sgMail.send(msg); //TODO uncommetn
            }
            res.send("Success!");
        });
    // });
});

app.put('/:id', function (req, res) {
    let id = req.params.id;
    opportunityModel.findById(id, function (err, opportunity) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            opportunity.creatorNetId = req.body.creatorNetId || opportunity.creatorNetId;
            opportunity.labPage = req.body.labPage || opportunity.labPage;
            opportunity.title = req.body.title || opportunity.title;
            opportunity.projectDescription = req.body.projectDescription || opportunity.projectDescription;
            opportunity.qualifications = req.body.qualifications || opportunity.qualifications;
            opportunity.supervisor = req.body.supervisor || opportunity.supervisor;
            // opportunity.spots = req.body.spots || opportunity.spots;
            opportunity.startSeason = req.body.startSeason || opportunity.startSeason;
            opportunity.startYear = req.body.startYear || opportunity.startYear;
            opportunity.applications = req.body.applications || opportunity.applications;
            opportunity.yearsAllowed = req.body.yearsAllowed || opportunity.yearsAllowed;
            opportunity.majorsAllowed = req.body.majorsAllowed || opportunity.majorsAllowed;
            opportunity.questions = req.body.questions || opportunity.questions;
            opportunity.requiredClasses = req.body.requiredClasses || opportunity.requiredClasses;
            opportunity.minGPA = req.body.minGPA || opportunity.minGPA;
            opportunity.minHours = req.body.minHours || opportunity.minHours;
            opportunity.maxHours = req.body.maxHours || opportunity.maxHours;
            opportunity.opens = req.body.opens || opportunity.opens;
            opportunity.closes = req.body.closes || opportunity.closes;
            opportunity.areas = req.body.areas || opportunity.areas;

            opportunity.markModified("messages");
            opportunity.markModified("applications");
            opportunity.markModified("questions");


            // Save the updated document back to the database
            opportunity.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});
app.get('/search', function(req, res){



    opportunityModel.find({$text:{$search:req.query.search}}, function(err,search){
        if(err){
            console.log(err);
        }
        else{
            if(search==null){
                res.send("Search not found :(");
            }
            console.log(search);

        }
    });


});
app.delete('/:id', function (req, res) {
    let id = req.params.id;

    opportunityModel.findByIdAndRemove(id, function (err, opportunity) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Opportunity successfully deleted",
            id: id
        };
        res.status(200).send(response);


    });
});

module.exports = app;
