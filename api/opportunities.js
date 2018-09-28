let express = require('express');
let app = express.Router();
let {
    undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, verify, mongoose,
    handleVerifyError
} = require('../common.js');
let common = require('../common.js');


//finds lab where lab admin = {adminNetId}, undefined if the id can't be fine in any lab
function findLabWithAdmin(labs, adminNetId) {
    return labs.filter(function (lab) {
        return lab.labAdmins.includes(adminNetId);
    })[0];
}

app.get('/check/:opportunityId', function (req, res) {
    let idToCheck = req.query.netId;
    debug("THIS IS WHERE WE START");

    opportunityModel.findById(req.params.opportunityId, function (err, opportunity) {
        //debug(err);
        debug("callback function is being run");
        //debug(opportunity);
        if (!opportunity) {
            debug("could not find matching opportunity");
            res.send(false);
            return;
        } else {
            let toSearch = opportunity.applications;
            for (let i = 0; i < toSearch.length; i++) {
                if (toSearch[i].undergradNetId === idToCheck) {
                    debug("You have already applied to this lab");
                    res.send(true);
                    return;
                }
            }
            debug("You have not yet applied to this lab");
            res.send(false);
        }
    });
});

/*
 app.get('/check/:opportunityId', function(req, res){
 let idToCheck = req.query.netId;
 debug(idToCheck);
 opportunityModel.findById(req.params.opportunityId, function (err, opportunity) {
 if (err) {
 return err;
 }
 let toSearch = opportunity.applications;
 debug(toSearch);
 for (let i = 0; i<toSearch.length; i++){
 if (toSearch[i].undergradNetId === idToCheck) {
 debug("You have already applied to this lab");
 res.send(true);
 return;
 }
 }
 debug("We are here");
 res.send(false);
 debug("You did not apply previously");
 return;
 });
 });
 */

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
    let urlLabId = req.query.labId;
    if (token != undefined) {
        verify(token, function (undergradNetId) {
            debug("here! " + undergradNetId);
            //find the undergrad so we can get their info to determine the "preqreqs match" field
            undergradModel.findOne({netId: undergradNetId}, function (err, undergrad) {
                let undergrad1 = undergrad;
                //if they're a lab admin, show all the opportunites and set all prereqsMatch to true
                if (undergrad1 === undefined || undergrad1 === null) {
                    let timeRange;
                    //if there's a lab id in the url, then it's a lab administrator trying to view their own opportunities
                    if (urlLabId) {
                        timeRange = {};
                    }
                    else {
                        timeRange = {
                            opens: {
                                $lte: new Date()
                            },
                            closes: {
                                $gte: new Date()
                            }
                        }
                    }
                    opportunityModel.find(timeRange, function (err, opportunities) {
                        for (let i = 0; i < opportunities.length; i++) {
                            opportunities[i]["prereqsMatch"] = true;
                        }
                        //make sure it's not null/undefined/falsy, but express also makes it a string "null" if the value isn't there so we have to check for that
                        if (urlLabId && urlLabId !== "null") {
                            debug("2");
                            labModel.findById(urlLabId, function (err, lab) {
                                debug(lab);
                                let oppIdsToOnlyInclude = lab.opportunities;
                                //right now the ids are Object Ids (some mongoose thing) so we have to convert them to strings; it's tricky because if you console.log them when they're objects it'll look just like they're strings!
                                oppIdsToOnlyInclude = oppIdsToOnlyInclude.map(opp => opp.toString());
                                //remove all opportunities that don't belong to the lab (i.e. if their id isn't in the lab.opportunities ids list
                                opportunities = opportunities.filter(opp =>
                                    oppIdsToOnlyInclude.includes(opp._id.toString())
                                );
                                return res.send(opportunities);
                            });
                        }
                        else {
                            return res.send(opportunities);
                        }
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
                                    opportunities[i].yearsAllowed.includes(common.gradYearToString(undergrad1.gradYear))) {
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
        }).catch(function (error) {
            handleVerifyError(error, res);
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
    let data = req.body;
    debug(data);
    if (!data ||
        !data.creatorNetId ||
        !data.title ||
        !data.undergradTasks ||
        !data.startSeason ||
        !data.compensation ||
        !data.startYear) {
        return res.status(400).send();
    }
    debug("netid: " + data.creatorNetId);
    debug("labpage: " + data.labPage);
    debug("title: " + data.title);
    debug("projDesc: " + data.projectDescription);
    debug("undergradTasks: " + data.undergradTasks);
    debug("qualifs: " + data.qualifications);
    debug("supervisor: " + data.supervisor);
    debug("startSeason: " + data.startSeason);
    debug("startYear: " + data.startYear);
    debug("apps: " + data.applications);
    debug("yearsAllowed: " + data.yearsAllowed);
    debug("majorsAllowed: " + data.majorsAllowed);
    debug("question 1: " + JSON.parse(JSON.stringify(data.questions))["q0"]);
    debug("question 2: " + JSON.parse(JSON.stringify(data.questions))["q1"]);
    debug("requiredClasses: " + data.requiredClasses);
    debug("minGPA: " + data.minGPA);
    debug("minHours: " + data.minHours);
    debug("maxHours: " + data.maxHours);
    debug("opens: " + data.opens);
    debug("closes: " + data.closes);
    debug("areas: " + data.areas);
    let maxHours = 168;
    if (data.maxHours !== undefined && data.maxHours !== null) {
        maxHours = data.maxHours;
    }
    debug("1");
    // decryptGoogleToken(data.creatorNetId, function (tokenBody) {
    //     let netId = email.replace("@cornell.edu", "");
    for (let key in data.questions) {
        if (data.questions.hasOwnProperty(key)) {
            //if they added a question but then clicked the x then there would be q1 : null/undefined
            if (!data.questions[key]) {
                delete data.questions.key;
            }
        }
    }
    debug("2");
    //if the compensation array is empty, then that means they don't have any compensation
    if (data.compensation === undefined || data.compensation.length === 0) {
        debug("2.5");
        data.compensation = ["none"];
    }
    debug("3");
    data.questions["coverLetter"] = "Cover Letter: Describe why you're interested in this lab/position in particular, " +
        "as well as how any qualifications you have will help you excel in this lab. Please be concise.";
    if (data.areas) {
        data.areas = data.areas.map(function (element) {
            let trimmed = element.trim();
            if (trimmed) {
                return trimmed;
            }
        });
    }
    if (data.requiredClasses) {
        data.requiredClasses = data.requiredClasses.map(function (element) {
            let trimmed = element.trim();
            if (trimmed) {
                return trimmed;
            }
        })
    }


    let token = data.creatorNetId;
    verify(token, function (netIdActual) {
        //if they somehow reach this page without being logged in...
        if (netIdActual === null) {
            handleVerifyError(null, res);
            return;
        }
        let opportunity = new opportunityModel({
            creatorNetId: netIdActual,
            labPage: data.labPage,
            title: data.title,
            projectDescription: data.projectDescription,
            undergradTasks: data.undergradTasks,
            qualifications: data.qualifications,
            compensation: data.compensation,
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
                debug(err);
                return;
            }
            let oppId = response.id;
            labModel.findOne(
                {labAdmins: netIdActual}
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
                        from: {
                            name: "Research Connect",
                            email: 'hello@research-connect.com'
                        },
                        replyTo: "acb352@cornell.edu",
                        subject: 'New Research Opportunity Available!',
                        html: 'Hi,<br />' +
                        'A new opportunity was just posted in an area you expressed interest in. You can apply to it here: http://research-connect.com/opportunity/' + opportunity._id + '<br />' +
                        '<br />' +
                        'Thanks,<br />' +
                        'The Research Connect Team<br />'
                    };

                    sgMail.send(msg);
                }
                debug("finished emailling students");
            });
        debug("done with function");
        res.send("Success!");
        // });
    }).catch(function (error) {
        handleVerifyError(error, res);
    });
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
app.get('/search', function (req, res) {
    debug(req.query.search);
    opportunityModel.find({$text: {$search: req.query.search}}, '_id', function (err, search) {
        if (err) {
            debug(err);
            res.send(err);
        }
        else {
            if (search === null) {
                res.send("Search not found :(");
            }
            debug(search);
            res.send(search);
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


//previous POST /getOpportunity
//gets the opportunity given its object id
app.get('/:id', function (req, res) {
    debug("token: " + req.query.netId);
    debug("id: " + req.params.id);
    verify(req.query.netId, function (tokenNetId) {
        debug("toke net id: " + tokenNetId);
        opportunityModel.findById(req.params.id).lean().exec(function (err, opportunity) {
            if (err) {
                debug(err);
                res.send(err);
            }
            debug("opportunity below:");
            debug(opportunity);
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
                            debug("found it");
                            debug(currentLab);
                            labAdmins = currentLab.labAdmins;
                        }
                    }
                }
                debug("here");
                debug(labAdmins);
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
    }).catch(function (error) {
        handleVerifyError(error, res);
    });
});


module.exports = app;
