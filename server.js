//import series from 'async/series'; //specification: https://caolan.github.io/async/docs.html#series

//server.js
'use strict';

//import dependencies
require('dotenv').config({path: 'info.env'});
const async = require('async');
const express = require('express');
const supportsColor = require('supports-color');
const debug = require('debug')('http');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
let s3;
if (fs.existsSync('./S3Config2.json')) {
    // Do something
    AWS.config.loadFromPath('./S3Config2.json');
    AWS.config.update({region: 'us-east-2'});
    s3 = new AWS.S3();
}

let corsKey = null;
if (fs.existsSync('./CorsKey.json')) {
    corsKey = JSON.parse(fs.readFileSync('CorsKey.json', 'utf8'));
    corsKey = corsKey.key;
}

//create instances
const app = express();
const router = express.Router();

//set our port to either a predetermined port number if you have set
//it up, or 3001
const port = process.env.PORT || 3001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// var favicon = require('serve-favicon');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//TODO only allow cors for specific endpoints, not all: https://github.com/expressjs/cors#enable-cors-for-a-single-route
app.use(cors());
app.use(fileUpload());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//EMAIL SENDGRID
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//TODO new api keyh
//More powerful example
/**
 {
 personalizations: [
     {
         to: [
             {
                 "email": ugradNetId + "@cornell.edu",
                 "name": ugradInfo.firstName
             }
         ],
         subject: "Research Connect Application Update for " + opportunity.title
     }
 ],
     content: [{
     type: "text/plain",
     content: message
 }],
     from: {
     email: "CornellDTITest@gmail.com",
         name: "Research Connect"
 },
 }
 */
// sgMail.send(msg);

router.get('/', function (req, res) {
    res.json({message: 'API Initialized!'});
});

app.use('/api', router);

/*******************************/
//BEGIN NON-DEFAULT CODE
/*******************************/
//WRITE YOUR APP CODE HERE!!!

/** Begin MONGODB AND MONGOOSE SETUP*/
//Good learning resource: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
//Require Mongoose
const mongoose = require('mongoose');

const mongoDB = process.env.MONGODB;
//Set up default mongoose connection
mongoose.connect(mongoDB, {
    useMongoClient: true
});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    debug("connected to mongo");
});
/**Begin SCHEMAS*/
let Schema = mongoose.Schema;

const undergradSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradYear: {type: Number, required: true, min: new Date().getFullYear()},
    major: {type: String},
    secondMajor: {type: String},
    minor: {type: String},
    gpa: {type: Number, min: 0, max: 4.3},
    netId: {type: String, required: true},
    courses: {type: [String],required:true}
});

let undergradModel = mongoose.model('Undergrads', undergradSchema, 'Undergrads'); //a mongoose model = a Collection on mlab/mongodb

const labSchema = new Schema({
    name: {type: String, required: true},
    labPage: {type: String, default: ""},
    labDescription: {type: String, default: ""},
    labAdmins: {type: [String], default: []},
    opportunities: [{type: Schema.Types.ObjectId, ref: "Opportunities"}]
});
let labModel = mongoose.model('Labs', labSchema, 'Labs'); //a mongoose model = a Collection on mlab/mongodb


const labAdministratorSchema = new Schema({
    role: {type: String, enum: ["pi", "postdoc", "grad", "undergrad"], required: true},
    labId: {type: Schema.Types.ObjectId, required: true, ref: "Labs"},
    netId: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    verified: {type: Boolean, default: false}
});
let labAdministratorModel = mongoose.model('LabAdministrators', labAdministratorSchema, 'LabAdministrators');

const opportunitySchema = new Schema({

    creatorNetId: {type: String, required: [true, "Must have NetId for the user creating the opportunity"]},
    labPage: {type: String, default: "This lab does not have a website", required: false},
    title: {type: String, default: "TBD", required: [true, 'Must have title']}, //required
    projectDescription: {type: String, default: "TBD"}, //required, add min length that you see fit
    undergradTasks: {type: String, default: "TBD"},  //what the undergrad would be doing, can be null
    qualifications: {type: String, default: "TBD"}, //can be null/empty
    supervisor: {type: String, default: "TBD"}, //can be null
    spots: {type: Number, required: false, min: 0, default: -1},   //-1 if no limit, number of people they're willing to take, -1 indicates no cap to # of spots
    startSeason: {type: String, enum: ["Summer", "Fall", "Winter", "Spring"]}, //null if start asap, string b/c it will prob be something like Fall 2018
    startYear: {type: Number},
    yearsAllowed: {
        type: [String],
        enum: ["freshman", "sophomore", "junior", "senior"],
        default: ["freshman", "sophomore", "junior", "senior"]
    },  //do they accept freshman, sophomores, juniors, and/or seniors
    majorsAllowed: {
        type: [String],
        default: []
    },
    messages: {
        type: Schema.Types.Mixed, default: {
            "accept": 'Hi {studentFirstName}, \nI am pleased to inform you that our lab will accept you for the opportunity "{opportunityTitle}". Please email me at {yourEmail} to find out more about when you will start. \n\nSincerely, \n{yourFirstName} {yourLastName}',
            "reject": 'Hi {studentFirstName}, \nI regret to inform you that our lab will not be able to accept you for the ' +
            ' "{opportunityTitle}" position this time. Please consider applying in the future. \n\nRespectfully, ' +
            '\n{yourFirstName} {yourLastName}”.',
            "interview": 'Hi {studentFirstName}, \nWe reviewed your application and would love to learn more about you. Please email {yourEmail} with times in the next seven days that work for you for an interview regarding the opportunity "{opportunityTitle}". \n\nSincerely, \n{yourFirstName} {yourLastName}'
        }
    },
    applications: {type: [Schema.Types.Mixed], default: []},
    questions: Schema.Types.Mixed,    //can be empty
    requiredClasses: {type: [String], default: []}, //can be empty
    minGPA: {type: Number, min: 0, max: 4.3, default: 0}, //0 if no minimum gpa required
    minHours: {type: Number, min: 0, max: 500, default: 6}, //can be null, indicating no minimum
    maxHours: {type: Number, min: 0, max: 500, default: 9}, //can be null, indicating no max
    opens: {type: Date, default: new Date()},   //if no date is sent use new Date()
    closes: {type: Date, default: null},  //null if rolling
    areas: {type: [String], default: []}, //required, area(s) of research (molecular bio, bioengineering, electrical engineering, computer science, etc.)
    prereqsMatch: {type: Boolean, default: false},
    labDescription: {type: String, required: false},
    labName: {type: String, required: false}
});
opportunitySchema.pre('validate', function (next) {
    if (this.maxHours < this.minHours) {
        next(new Error('Min hours must be greater than or equal to max hours.'));
    } else {
        next();
    }
});
let opportunityModel = mongoose.model('Opportunities', opportunitySchema, 'Opportunities'); //a mongoose model = a Collection on mlab/mongodb

//EXAMPLE CODE AT BOTTOM OF server.js

/** Begin ADD TO DATABASE */


/** End TO DATABASE */

/** Begin SEARCHING THE DATABASE */



/**End SEARCHING THE DATABASE */

/** End MONGODB AND MONGOOSE SETUP */


/**Begin ENDPOINTS */

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * A method to populate fields. Feel free to change it as need be.
 */
app.get('/populate', function (req, res) {
    opportunityModel.find({}, function (err, opps) {
        for (let i = 0; i < opps.length; i++) {
            opps[i]["messages"] = {
                "accept": 'Hi {studentFirstName}, \nI am pleased to inform you that our lab will accept you for the opportunity "{opportunityTitle}". Please email me at {yourEmail} to find out more about when you will start. \n\nSincerely, \n{yourFirstName} {yourLastName}',
                "reject": 'Hi {studentFirstName}, \nI regret to inform you that our lab will not be able to accept you for the ' +
                ' "{opportunityTitle}" position this time. Please consider applying in the future. \n\nRespectfully, ' +
                '\n{yourFirstName} {yourLastName}”.',
                "interview": 'Hi {studentFirstName}, \nWe reviewed your application and would love to learn more about you. Please email {yourEmail} with times in the next seven days that work for you for an interview regarding the opportunity "{opportunityTitle}". \n\nSincerely, \n{yourFirstName} {yourLastName}'
            };
            opps[i].save(function (err) {
                debug(err);
            });
        }
    });
    res.end();
});

/**
 * Takes the id of an opportunity as a parameter in the url
 * Returns the messages object of the opportunity Messages object looks like so:
 * {
 *  "accept": "Hi {firstName}, ....",
 *  "reject": "...",
 *  "interview": "..."
 * }
 *  When sent to the back-end, any fields in {} will be replaced with that field
 *  Values we can replace:
 *  {studentFirstName}, {studentLastName} --> the first or last name of the student they just clicked accept/reject/interview for
 *  {opportunityTitle} --> the title/name of the opportunity that students see when browsing and examining opportunities.
 *  {yourFirstName}, {yourLastName}, {yourEmail} --> first or last name or email of current lab administrator viewing applications
 *
 * }
 */
app.get('/messages/:opportunityId', function (req, res) {
    let opportunityId = req.params.opportunityId;
    opportunityModel.findById(opportunityId, function (err, opportunity) {
        res.send(opportunity.messages);
    })
});

/**
 * Send an email to notify the student of their status change
 */
app.post('/messages/send', function (req, res) {
    let oppId = req.body.opportunityId;
    let profId = req.body.labAdminNetId;
    let ugradNetId = req.body.undergradNetId;
    let message = req.body.message;
    let status = req.body.status;
    /**
     *  *  Values we can replace:
     *  {studentFirstName}, {studentLastName} --> the first or last name of the student they just clicked accept/reject/interview for
     *  {opportunity title} --> the title/name of the opportunity that students see when browsing and examining opportunities.
     *  {yourFirstName}, {yourLastName}, {yourEmail} --> first or last name or email of current lab administrator viewing applications
     *
     */

    undergradModel.findOne({netId: ugradNetId}, function (err, ugradInfo) {
        message = replaceAll(message, "{studentFirstName}", ugradInfo.firstName);
        message = replaceAll(message, "{studentLastName}", ugradInfo.lastName);
        labAdministratorModel.findOne({netId: profId}, function (err, prof) {
            message = replaceAll(message, "{yourFirstName}", prof.firstName);
            message = replaceAll(message, "{yourLastName}", prof.lastName);
            message = replaceAll(message, "{yourEmail}", prof.netId + "@cornell.edu");
            opportunityModel.findById(oppId, function (err, opportunity) {
                message = replaceAll(message, "{opportunityTitle}", opportunity.title);
                for (let i = 0; i < opportunity.applications.length; i++) {
                    if (opportunity.applications[i].undergradNetId === ugradNetId) {
                        opportunity.applications[i].status = status;
                        break;
                    }
                }
                let temp = opportunity.messages;
                temp[status] = message;
                opportunity.messages = temp;
                opportunity.markModified("messages");
                opportunity.markModified("applications");
                opportunity.save(function (err, todo) {
                    if (err) {
                        debug(err);
                    }
                });
                let msg = {
                    to: ugradNetId + "@cornell.edu",
                    from: 'CornellDTITest@gmail.com',
                    subject: "Research Connect Application Update for \"" + opportunity.title + "\"",
                    text: message,
                    html: replaceAll(message, "\n", "<br />")
                };
                //TODO Change the "from" email to our domain name using zoho mail
                sgMail.send(msg);
                res.status(200).end();
            })
        })
    });
});

//Example code for receiving a request from the front end that doesn't send any data,
/*app.get('/something', function (req, res) {
 //res is used to send the result
 res.send("hello");
 });*/


//gets the opportunity given its id
app.post('/getOpportunity', function (req, res) {
    opportunityModel.findById(req.body.id).lean().exec(function (err, opportunity) {
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
                    if (currentLab.opportunities[j].toString() === req.body.id) {
                        opportunity.labPage = currentLab.labPage;
                        opportunity.labDescription = currentLab.labDescription;
                        opportunity.labName = currentLab.name;
                        labAdmins = currentLab.labAdmins;
                    }
                }
            }
            labAdministratorModel.findOne(
                {$and: [
                    {netId: {$in: labAdmins}},
                    {role: "pi"}
                    ]
                },
                function (err, labAdmin) {
                    debug("hi");
                    debug(labAdmin);
                    opportunity.pi = labAdmin.firstName + " " + labAdmin.lastName;
                    res.send(opportunity);
                });
        });
    });
});

function getOpportunity(id, res) {

}

app.post('/getLabAdmin', function (req, res) {
    var response = getLabAdmin(req.body.id);
    res.send(response);
});

function getLabAdmin(id, res) {
    labAdministratorModel.findById(id, function (err, labAdmin) {
        if (err) {
            return err;
        }
        debug(labAdmin.labId);

        return labAdmin;
    });
}

app.post('/getUndergrad', function (req, res) {
    var response = getUndergrad(req.body.id);
    res.send(response);
});

function getUndergrad(id, res) {
    undergradModel.findById(id, function (err, undergrad) {
        if (err) {
            return err;
        }
        debug(undergrad.netId);

        return undergrad;
    });
}

/**
 * Send a request to /application/:id, where "id" is the id of the application
 * Returns the application object with that id
 */
app.get('/application/:id', function (req, res) {
    let appId = req.params.id;
    opportunityModel.find({}, function (err, docs) {
        for (let i = 0; i < docs.length; i++) {
            let opportunityObject = docs[i];
            for (let j = 0; j < opportunityObject.applications.length; j++) {
                if (opportunityObject.applications[j].id === appId) {
                    res.send(opportunityObject.applications[j]);
                    return;
                }
            }
        }
    });
});

app.post('/getApplications', function (req, res) {

    // function callbackHandler(err, results) {
    //     debug('It came back with this ' + results);
    // }
    //
    // const labAdminId = req.body.id;
    // function labAdmin (callbackHandler) {
    //     var labAdmin = getLabAdmin(labAdminId, res);
    // }
    //
    // function lab (callbackHandler) {
    //     var lab = getLab(labAdmin.labId, res);
    // }

    //function

    const labAdminId = req.body.id;
    let opportunitiesArray = [];
    let reformatted = {};
    labAdministratorModel.findById(labAdminId, function (err, labAdmin) {
        if (err) {
            res.send(err);
            return;
        }
        labModel.findById(labAdmin.labId, function (err, lab) {
            if (err) {
                res.send(err);
                return;
            }
            let mongooseLabIds = [];
            for (let i = 0; i < lab.opportunities.length; i++) {
                mongooseLabIds.push(mongoose.Types.ObjectId(lab.opportunities[i]));
            }
            opportunityModel.find({
                '_id': {
                    $in: mongooseLabIds
                }
            }, function (err, docs) {
                let applicationsArray = [];
                let allApplications = {};
                let netIds = [];
                for (let i = 0; i < docs.length; i++) {
                    let opportunityObject = docs[i];
                    for (let j = 0; j < opportunityObject.applications.length; j++) {
                        applicationsArray.push(opportunityObject.applications[j]);
                        netIds.push(opportunityObject.applications[j].undergradNetId);
                    }
                    allApplications[opportunityObject.title] = applicationsArray;
                    opportunitiesArray.push(opportunityObject);
                    applicationsArray = [];
                }
                undergradModel.find({
                    'netId': {
                        $in: netIds
                    }
                }, function (err, studentInfoArray) {
                    let count = 0;
                    for (let key in allApplications) {
                        if (allApplications.hasOwnProperty(key)) {
                            let currentApplication = allApplications[key];
                            for (let i = 0; i < currentApplication.length; i++) {
                                let currentStudent = currentApplication[i];
                                let undergradId = currentStudent.undergradNetId;
                                let undergradInfo = studentInfoArray.filter(function (student) {
                                    return student.netId === undergradId;
                                })[0];
                                currentStudent.firstName = undergradInfo.firstName;
                                currentStudent.lastName = undergradInfo.lastName;
                                currentStudent.gradYear = undergradInfo.gradYear;
                                currentStudent.major = undergradInfo.major;
                                currentStudent.gpa = undergradInfo.gpa;
                                currentStudent.courses = undergradInfo.courses;
                            }
                            //reformat it to match:
                            /**
                             * {
                                "titleOpp": {
                                    "opportunity": {},
                                    "applications": []
                                },
                                ....
                            }

                             from

                             {
                                "titleOpp": [].
                                ...
                             }
                             */
                            reformatted[key] = {
                                "opportunity": opportunitiesArray[count],
                                "applications": allApplications[key]
                            };
                            count++;
                        }
                    }
                    res.send(reformatted);
                });
            });
        })
    });
    /*
     var labAdmin = getLabAdmin(labAdminId, res);
     var lab = getLab(labAdmin.labId, res);
     var labOpportunities = lab.opportunities;

     var applicationsInOpportunities = {};

     for(var opportunityID in labOpportunities) {

     var opportunity = getOpportunity(opportunityID, res);
     applicationsInOpportunities[opportunity.title] = opportunity.applications;
     }

     debug(applicationsInOpportunities);

     */

});

/** Graduation Year: 2021. Given graduation year and current date, determine whether they're freshman soph junior senior
 *  Senior: If current date is less than May 23, {Graduation Year} and greater than
 *  Senior: Between May 24, 2020 and May 23, 2021
 *  Junior: Between May 24, 2019 and May 23, 2020
 *  Sophomore: Between May 24, 2018 and May 23, 2019
 *  Freshman: Present Date is Between August 10, 2017 and May 23, 2018
 *  new Date(year, month [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
 */

function dateIsBetween(date, lowerBound, upperBound) {
    return (lowerBound <= date && date <= upperBound);
}

function gradYearToString(gradYear) {
    let presentDate = new Date();
    if (dateIsBetween(presentDate, new Date(gradYear - 4, 7, 10), new Date(gradYear - 3, 4, 23))) return "freshman";
    if (dateIsBetween(presentDate, new Date(gradYear - 3, 4, 24), new Date(gradYear - 2, 4, 23))) return "sophomore";
    if (dateIsBetween(presentDate, new Date(gradYear - 2, 4, 24), new Date(gradYear - 1, 4, 23))) return "junior";
    if (dateIsBetween(presentDate, new Date(gradYear - 1, 4, 24), new Date(gradYear, 4, 23))) return "senior";
    return "freshman";
}

//finds lab where lab admin = {adminNetId}, undefined if the id can't be fine in any lab
function findLabWithAdmin(labs, adminNetId) {
    return labs.filter(function (lab) {
        return lab.labAdmins.includes(adminNetId);
    })[0];
}

app.post('/getOpportunitiesListing', function (req, res) {

    // if (req.body.corsKey != corsKey) {
    //     res.status(403).send("Access forbidden");
    //     return;
    // }

    //list courses that are prereqs that can be skipped or are the same
    //make sure no spaces inbetween course letters and numbers
    let coursePrereqs = {
        "CS1110": ["CS2110", "CS2112", "CS3110"],
        "CS1112": ["CS2110", "CS2112", "CS3110"],
        "CS2110": ["CS2112"],
        "CHEM2090": ["CHEM2080"]
    };
    let undergradNetId = req.body.netId;
    if (undergradNetId != undefined) {
        //find the undergrad so we can get their info to determine the "preqreqs match" field
        undergradModel.find({netId: undergradNetId}, function (err, undergrad) {
            let undergrad1 = undergrad[0];
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


//get all the labs
app.get('/getLabs', function (req, res) {
    labModel.find({}, function (err, labs) {
        if (err) {
            res.send(err);
            //handle the error appropriately
            return; //instead of putting an else
        }
        res.send(labs);

    });
});

//get one lab by id
app.get('/getLab', function (req, res) {
    var response = getLab(req.body.id, res);
    res.send(response);
});

function getLab(id, res) {
    labModel.findById(id, function (err, lab) {
        if (err) {
            return err;
        }
        debug(lab.name);
        return lab;
    });
}


/**
 * Example of code for receiving a request from the front end that sends data with its requests,
 * url in here (sendFormData) and in the front-end ajax request have to both be sendFormData in order for them to communicate
 */
app.post('/sendFormData', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    debug(data);
    //res is used to send the result, which the front end can parse
    res.send("hello");
});

app.post('/createOpportunity', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    debug(data);

    let opportunity = new opportunityModel({
        creatorNetId: data.creatorNetId,
        labPage: data.labPage,
        title: data.title,
        projectDescription: data.projectDescription,
        undergradTasks: data.undergradTasks,
        qualifications: data.qualifications,
        supervisor: data.supervisor,
        spots: data.spots,
        startSeason: data.startSeason,
        startYear: data.startYear,
        applications: data.applications,
        yearsAllowed: data.yearsAllowed,
        majorsAllowed: data.majorsAllowed,
        questions: data.questions,
        requiredClasses: data.requiredClasses,
        minGPA: data.minGPA,
        minHours: data.minHours,
        maxHours: data.maxHours,
        opens: data.opens,
        closes: data.closes,
        areas: data.areas
    });
    opportunity.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            debug(err);
        } else //Handle this error however you see fit
            res.send("Success!");

        // Now the opportunity is saved in the Opportunities collection on mlab!
    });
});

app.post('/createUndergrad', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data.firstName);
    console.log(data.lastName);
    console.log(data.gradYear);
    console.log(data.major);
    console.log(data.GPA);
    console.log(data.netid);
    console.log(data.courses);
    //var dataView = new DataView(data.files);
    //console.log(dataView.getInt32(0).toString(16));
    console.log(typeof data.files[0][0]);
    var buffer = new ArrayBuffer();
    console.log(typeof buffer);
    console.log(buffer.byteLength);
    var undergrad = new undergradModel({

        firstName: data.firstName,
        lastName: data.lastName,
        gradYear: data.gradYear,    //number
        major: data.major,
        gpa: data.GPA,
        netId: data.netid,
        courses: data.courses
    });
    debug(undergrad);
    undergrad.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            debug(err);
        } //Handle this error however you see fit
        else {
            res.send("success!");
        }
        // Now the opportunity is saved in the commonApp collection on mlab!
    });

});

// during lab admin signup creating new lab as well

/* In the addLabAdmin endpoint, check to see if the req.body.labId field is null.
 If it is null, then create a lab with labName, labDescription, and labUrl and save it to the database.
 All three should be in req.body. If labId is not null, then just continue with the method as usual.
 */
function createLabAndAdmin(req, res) {
    console.log("This means we had to go somewhere else");

    var data = req.body;

    var lab = new labModel({
        name: data.name,
        labPage: data.labPage,
        labDescription: data.labDescription,

        // labAdmins and opportunities not needed during lab admin signup. so commented out.
        // labAdmins: data.labAdmins,
        // opportunities: data.opportunities
    });

    lab.save(function (err, labObject) {

        if (err) {
            res.status(500).send({"errors": err.errors});
            console.log(err);
        }

        var labAdmin = new labAdministratorModel({
            role: data.role,
            labId: labObject._id,
            netId: data.netId,
            firstName: data.firstName,
            lastName: data.lastName,
            verified: data.verified
        });

        labAdmin.save(function (err) {
            if (err) {
                res.status(500).send({"errors": err.errors});
                console.log(err);
            }
        });
    });
}

///Endpoint for lab admin signup
app.post('/createLabAdmin', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    debug(data);

    console.log(data.role);
    console.log(data.labId);
    console.log(data.netId);
    console.log(data.firstName);
    console.log(data.lastName);
    console.log(data.verified);
    console.log(data.labDescription);


    // if labId is null then there is no existing lab and creating new lab
    if (data.labId == null) {
        createLabAndAdmin(req, res);
        res.send("success!");
    }

    // while labAdmin is signing up he finds existing lab
    else {
        var labAdmin = new labAdministratorModel({
            role: data.role,
            labId: data.labId,
            netId: data.netId,
            firstName: data.firstName,
            lastName: data.lastName,
            verified: data.verified
        });

        labAdmin.save(function (err) {
            if (err) {
                res.status(500).send({"errors": err.errors});
                console.log(err);
            } //Handle this error however you see fit
            else {
                res.send("success!");
            }
            // Now the opportunity is saved in the commonApp collection on mlab!
        });
    }
});

app.post('/createLab', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    debug(data);


    var lab = new labModel({
        name: data.name,
        labPage: data.labPage,
        labDescription: data.labDescription,
        labAdmins: data.labAdmins,
        opportunities: data.opportunities
    });

    lab.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            debug(err);
        } //Handle this error however you see fit
        else {
            res.send("success!");
        }
    });
});


app.post('/updateOpportunity', function (req, res) {
    let id = req.body.id;
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
            opportunity.spots = req.body.spots || opportunity.spots;
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


app.post('/updateUndergrad', function (req, res) {
    let id = req.body.id;
    debug(id);
    undergradModel.findById(id, function (err, undergrad) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            undergrad.firstName = req.body.firstName || undergrad.firstName;
            undergrad.lastName = req.body.lastName || undergrad.lastName;
            undergrad.gradYear = req.body.gradYear || undergrad.gradYear;
            undergrad.major = req.body.major || undergrad.major;
            undergrad.gpa = req.body.gpa || undergrad.gpa;
            undergrad.netID = req.body.netID || undergrad.netID;
            undergrad.courses = req.body.courses || undergrad.courses;

            // Save the updated document back to the database
            undergrad.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});

app.post('/updateLab', function (req, res) {
    let id = req.body.id;
    labModel.findById(id, function (err, lab) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            lab.name = req.body.name || lab.name;
            lab.labPage = req.body.labPage || lab.labPage;
            lab.labDescription = req.body.labDescription || lab.labDescription;
            lab.labAdmins = req.body.labAdmins || lab.labAdmins;
            lab.opportunities = req.body.opportunities || lab.opportunities;

            // Save the updated document back to the database
            lab.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});

app.post('/updateLabAdmin', function (req, res) {
    let id = req.body.id;
    labAdministratorModel.findById(id, function (err, labAdmin) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            labAdmin.role = req.body.role || labAdmin.role;
            labAdmin.labId = req.body.labId || labAdmin.labId;
            labAdmin.netId = req.body.netId || labAdmin.netId;
            labAdmin.firstName = req.body.firstName || labAdmin.firstName;
            labAdmin.lastName = req.body.lastName || labAdmin.lastName;
            labAdmin.verified = req.body.verified || labAdmin.verified;

            // Save the updated document back to the database
            labAdmin.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});

app.post('/deleteOpportunity', function (req, res) {
    var id = req.body.id;
    debug("delete opportuinty");
    debug(id);

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

app.post('/deleteUndergrad', function (req, res) {
    var id = req.body.id;
    debug("delete undergrad");
    debug(id);

    undergradModel.findByIdAndRemove(id, function (err, undergrad) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Undergrad successfully deleted",
            id: id
        };
        res.status(200).send(response);


    });
});

app.post('/deleteLabAdmin', function (req, res) {
    var id = req.body.id;
    debug("delete lab admin");
    debug(id);

    labAdministratorModel.findByIdAndRemove(id, function (err, labAdmin) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Lab admin successfully deleted",
            id: id
        };
        res.status(200).send(response);

    });
});

app.post('/deleteLab', function (req, res) {
    var id = req.body.id;
    debug("delete lab");
    debug(id);

    labModel.findByIdAndRemove(id, function (err, lab) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Lab successfully deleted",
            id: id
        };
        res.status(200).send(response);

    });
});


function base64ArrayBuffer(arrayBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}

app.get('/resume/:id', function (req, res) {
    let params = {
        Bucket: "research-connect-student-files",
        Key: req.params.id
    };
    s3.getObject(params, function (err, data) {
        if (err) debug(err, err.stack); // an error occurred
        else {
            let baseString = base64ArrayBuffer(data.Body);
            // return res.send('<embed width="100%" height="100%" src=data:application/pdf;base64,' + baseString + ' />');
            return res.send(baseString);
        }
    });
});

app.post('/storeResume', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    let params = {
        Bucket: "research-connect-student-files",
        Key: "1517452061886"
    };
    s3.getObject(params, function (err, data) {
        if (err) debug(err, err.stack); // an error occurred
        else {
            let baseString = base64ArrayBuffer(data.Body);
            // res.send('<embed width="100%" height="100%" src=data:application/pdf;base64,' + baseString + ' />');
        }
        // successful response
    });
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let resume = req.files.resume;
    //TODO change Key param to name of student plus date.now
    let uploadParams = {
        Bucket: "research-connect-student-files",
        Key: Date.now().toString(),
        Body: req.files.resume.data
    };
    debug("yay!");
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            debug("Error", err);
        }
        if (data) {
            debug("Upload Success", data.Location);
            res.send("Success!");
        }
    });
});

app.post('/testResume', function (req, res) {
    console.log("If the below is null, it's not working");
    console.log(req.body.files);
});

app.post('/storeApplication', function (req, res) {
    opportunityModel.findById(req.body.opportunityId, function (err, opportunity) {
        if (err) {
            return err;
        }

        var application = {
            "undergradNetId": req.body.netId,
            "status": "received",
            "responses": req.body.responses,
            "timeSubmitted": Date.now(),
            "id": Date.now() + req.body.netId
        };
        opportunity.applications.push(application);
        opportunity.save(function (err) {
        });
        res.send("success!");
    });
});


/**End ENDPOINTS */


/*******************************/
//END NON-DEFAULT CODE
/*******************************/


// catch 404 and fgorward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;

//starts the server and listens for requests
app.listen(port, function () {
    debug(`api running on port ${port}`);
});