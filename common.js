require('dotenv').config();
const async = require('async');
const express = require('express');
const supportsColor = require('supports-color');
const debug = require('debug')('server:app');
module.exports.debug = debug;
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com");
const fileUpload = require('express-fileupload');
const request = require("request");
const AWS = require('aws-sdk');
let s3;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
});
s3 = new AWS.S3();
module.exports.s3 = s3;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports.sgMail = sgMail;

function replaceAll(str, find, replace) {
    if (!str){
        return "";
    }
    return str.replace(new RegExp(find, 'g'), replace);
}
module.exports.replaceAll = replaceAll;

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
module.exports.dateIsBetween = dateIsBetween;

function gradYearToString(gradYear) {
    let presentDate = new Date();
    if (dateIsBetween(presentDate, new Date(gradYear - 4, 7, 10), new Date(gradYear - 3, 4, 23))) return "freshman";
    if (dateIsBetween(presentDate, new Date(gradYear - 3, 4, 24), new Date(gradYear - 2, 4, 23))) return "sophomore";
    if (dateIsBetween(presentDate, new Date(gradYear - 2, 4, 24), new Date(gradYear - 1, 4, 23))) return "junior";
    if (dateIsBetween(presentDate, new Date(gradYear - 1, 4, 24), new Date(gradYear, 4, 23))) return "senior";
    return "freshman";
}
module.exports.gradYearToString = gradYearToString;

/** DATABASE **/
const mongoose = require('mongoose');
mongoose.plugin(schema => {
    schema.options.usePushEach = true
});
module.exports.mongoose = mongoose;

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
    email: {type: String},
    courses: {type: [String], required: false},
    resumeId: {type: String, required: false},
    transcriptId: {type: String, required: false},
    skills: {type: [String], required: false}
    // resumeId: {type: Schema.Types.ObjectId, ref: "Documents"},
    // transcriptId: {type: Schema.Types.ObjectId, ref: "Documents"}
});
let undergradModel = mongoose.model('Undergrads', undergradSchema, 'Undergrads'); //a mongoose model = a Collection on mlab/mongodb;
module.exports.undergradModel = undergradModel;

const docSchema = new Schema({
    doc: {type: String}
});

let docModel = mongoose.model('Documents', docSchema, 'Documents');
module.exports.docModel = docModel;

const labSchema = new Schema({
    name: {type: String, required: true},
    labPage: {type: String, default: ""},
    labDescription: {type: String, default: ""},
    labAdmins: {type: [String], default: []},
    opportunities: {type: [Schema.Types.ObjectId], ref: "Opportunities"}
});
let labModel = mongoose.model('Labs', labSchema, 'Labs'); //a mongoose model = a Collection on mlab/mongodb
module.exports.labModel = labModel;


const labAdministratorSchema = new Schema({
    role: {type: String, enum: ["pi", "postdoc", "grad", "staffscientist", "labtech", "undergrad"], required: true},
    labId: {type: Schema.Types.ObjectId, required: true, ref: "Labs"},
    netId: {type: String, required: true},
    pi: {type: String, required: false},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    notifications: {type: Number, required: true},
    lastSent: {type: Number, default: Date.now()},
    verified: {type: Boolean, default: false},
    email: {type: String, default: "", required: true}
});
let labAdministratorModel = mongoose.model('LabAdministrators', labAdministratorSchema, 'LabAdministrators');
module.exports.labAdministratorModel = labAdministratorModel;

/** FACULTY SCHEMA */
const facultySchema = new Schema({
    name: {type: String, required: true},
    office: {type: String},
    photoId: {type: String},
    researchInterests: {type:[String]},
    researchDescription: {type: String},
    phone: {type: String},
    labName: {type: String},
    labPage: {type: String},
    department: {type: String},
    email: {type: String},
    accepting: {type: String, enum: ["yes", "no", "unknown", "maybe", ""]},
    bio: {type: String},
    teaching: {type: String}
});
//create text indices so we can use the mongo search functionality: https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
facultySchema.index({'$**': 'text'});
let facultyModel = mongoose.model('Faculty', facultySchema, 'Faculty');
module.exports.facultyModel = facultyModel;

//The code below can be used to update information in all the faculty documents.

facultyModel.find({}, function(err, facultyArray){
    for (let i = 0; i < facultyArray.length; i++){
        let currentFaculty = facultyArray[i];
        currentFaculty.name = (currentFaculty.name ? currentFaculty.name.replace(/[^\x00-\x7F]/g, "") : currentFaculty.name);
        currentFaculty.bio = (currentFaculty.bio ? currentFaculty.bio.replace(/[^\x00-\x7F]/g, "") : currentFaculty.bio);
        currentFaculty.researchDescription = (currentFaculty.researchDescription ? currentFaculty.researchDescription.replace(/[^\x00-\x7F]/g, "") : currentFaculty.researchDescription);
        currentFaculty.teaching = (currentFaculty.teaching ? currentFaculty.teaching.replace(/[^\x00-\x7F]/g, "") : currentFaculty.teaching);
        currentFaculty.save(function(err, doc){
           if (err){
               debug("error!");
               debug(err);
               debug(doc);
           }
        });
    }
});



/** OPPORTUNITY SCHEMA */
const opportunitySchema = new Schema({

    creatorNetId: {type: String, required: [true, "Must have NetId for the user creating the opportunity"]},
    labPage: {type: String, default: "This lab does not have a website", required: false},
    title: {type: String, default: "TBD", required: [true, 'Must have title']}, //required
    projectDescription: {type: String, default: "TBD"}, //required, add min length that you see fit
    undergradTasks: {type: String, default: "TBD"},  //what the undergrad would be doing, can be null
    qualifications: {type: String, default: "TBD"}, //can be null/empty
    compensation: {
        type: [String],
        enum: ["pay", "credit", "undetermined", "none"],
        default: ["none"]
    },
    supervisor: {type: String, default: "TBD"}, //can be null
    // spots: {type: Number, required: false, min: 0, default: -1},   //-1 if no limit, number of people they're willing to take, -1 indicates no cap to # of spots
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
            "accept": 'Hi, \nI am pleased to inform you that our lab will accept you for the opportunity you applied for. Please email me to find out more about when you will start.',
            "reject": 'Hi, \nI regret to inform you that our lab will not be able to accept you for the position ' +
            ' you applied for at our lab. Please consider applying again in the future.',
            "interview": 'Hi, \nWe reviewed your application and would love to learn more about you. Please email me with times in the next seven days that work for you for an interview regarding this opportunity.'
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
    fundOption: {type: Number, min: 0, default: 0},
    labName: {type: String, required: false},
    ghostPost: {type: Boolean, default: false, required: false},
    ghostEmail: {type: String, default: "hello@research-connect.com", required: false}
    // ghostLab: {type: String, default: "", required: false}
});
opportunitySchema.index({'$**': 'text'});
opportunitySchema.pre('validate', function (next) {
    if (this.maxHours < this.minHours) {
        next(new Error('Min hours must be greater than or equal to max hours.'));
    } else {
        next();
    }
});
let opportunityModel = mongoose.model('Opportunities', opportunitySchema, 'Opportunities'); //a mongoose model = a Collection on mlab/mongodb
module.exports.opportunityModel = opportunityModel;


let tokenRequest = {
    url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=',
    method: 'GET',
    headers: {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

/**
 * takes token (cryptic hash) and callback function, calls callback function with net id
 * @param token google auth token
 * @param callback function to run with net id (or email if @param justEmail is true)
 * @param justEmail if set to true, function returns callback with justEmail not netid, if false or undefined (no input) then uses net id.
 * @return {Promise.<void>} nothing useful, since everything is done in the callback
 * @requires that you have a handleVerifyError, like as follows:
 * verify(token, function(){//do whatever}).catch(function(error){
 *        handleVerifyError(error, res);
 * }
 */
async function verify(token, callback, justEmail) {
    if (token === null) {
        callback(null);
        return;
    }
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    let email = payload["email"];
    if (justEmail) {
        callback(email);
        return;
    }
    let emailBeforeAt = email.replace(("@" + payload["hd"]), "");
    //for undergrads, they're required to sign up with their cornell email so emailBeforeAt is their net id.
    undergradModel.findOne({netId: emailBeforeAt}, function (err, undergrad) {
        if (undergrad !== null) {
            callback(emailBeforeAt); //should be same as netid since they're forced to sign up with cornell emails
            return;
        }
        labAdministratorModel.findOne({email: email}, function (err, labAdmin) {
            //if the person googlge auth'ed but didn't make it past instructor/student register then they'll have an email but won't be in the database so just return null
            if (labAdmin === null) {
                callback(null);
                return;
            }
            else {
                callback(labAdmin.netId);
                return;
            }
        })
    });
}

module.exports.verify = verify;

/**
 * Used in the .catch when verify is used, handles whatever should be done
 * @param errorObj (required) the error that is returned from the .catch
 * @param res the response object
 * @return {boolean} true if their token is too old, false if some other error
 * @requires that you have the verify function, like as follows:
 * verify(token, function(){//do whatever}).catch(function(error){
 *        handleVerifyError(error, res);
 * }
 */
function handleVerifyError(errorObj, res) {
    if (errorObj != null && errorObj.toString() != undefined) {
        if (errorObj.toString().indexOf("used too late") !== -1) {
            res.status(409).send("Token used too late");
            return true;
        }
        else {
            res.status(409).send("Invalid token");
            return true;
        }
    }
    return false;
}

module.exports.handleVerifyError = handleVerifyError;

function getNetIdFromEmail(email) {
    if (!email) {
        return "";
    }
    let emailParts = email.split("@");
    if (emailParts.length < 2) {
        return "";
    }
    return emailParts[0];
}

module.exports.getNetIdFromEmail = getNetIdFromEmail;

/**
 * Decrypts google token to get the email, name, and other info from it. Runs callback with token.
 * @param token the google token hash
 * @param callback the function to run after the token is decrypted, takes one parameter: the body object with name, email, etc.
 */
function decryptGoogleToken(token, callback) {
    let options = tokenRequest;
    options.url = options.url + token;
    request(options, function (error, response, body) {
        body = JSON.parse(body);
        callback(body);
    })
}

module.exports.decryptGoogleToken = decryptGoogleToken;