//server.js
'use strict'

//import dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./S3Config.json');
AWS.config.update({region: 'us-east-2'});
const s3 = new AWS.S3();


//create instances
const app = express();
const router = express.Router();

//set our port to either a predetermined port number if you have set
//it up, or 3001
const port = 3001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// var favicon = require('serve-favicon');
app.use(bodyParser.urlencoded({ extended: true }));
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


router.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
});

//app.use('/users', users);

app.use('/api', router);

/*******************************/
//BEGIN NON-DEFAULT CODE
/*******************************/
//WRITE YOUR APP CODE HERE!!!

/** Begin MONGODB AND MONGOOSE SETUP*/
//Good learning resource: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
//Require Mongoose
const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = 'mongodb://research-connect:connectresearchers4cornell@ds251245.mlab.com:51245/research-connect';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**Begin SCHEMAS*/
let Schema = mongoose.Schema;

const undergradSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradYear: {type: Number, required: true, min: new Date().getFullYear()},
    major: {type: String},
    gpa: {type: Number, min: 0, max: 4.3},
    netId: {type: String, required: true}
});
let undergradModel = mongoose.model('Undergrads', undergradSchema, 'Undergrads'); //a mongoose model = a Collection on mlab/mongodb

const labSchema = new Schema({
    name: {type: String, required: true},
    labPage: {type: String, default: ""},
    labDescription: {type: String, default: ""},
    labAdmins: {type: [String], default: []},
    opportunities: [Schema.Types.ObjectId]
});
let labModel = mongoose.model('Labs', labSchema, 'Labs'); //a mongoose model = a Collection on mlab/mongodb


const labAdministratorSchema = new Schema({
    role: {type: String, enum: ["pi", "postdoc", "grad", "undergrad"], required: true},
    labId: {type: Schema.Types.ObjectId, required: true},
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
    startYear: {type: Number, min: new Date().getFullYear()},
    yearsAllowed: {
        type: [String],
        enum: ["freshman", "sophomore", "junior", "senior"],
        default: ["freshman", "sophomore", "junior", "senior"]
    },  //do they accept freshman, sophomores, juniors, and/or seniors
    applications: {type: [Schema.Types.Mixed], default: []},
    questions: Schema.Types.Mixed,    //can be empty
    requiredClasses: {type: [String], default: []}, //can be empty
    minGPA: {type: Number, min: 0, max: 4.3, default: 0}, //0 if no minimum gpa required
    minHours: {type: Number, min: 0, max: 500, default: 6}, //can be null, indicating no minimum
    maxHours: {type: Number, min: 0, max: 500, default: 9}, //can be null, indicating no max
    opens: {type: Date, default: new Date()},   //if no date is sent use new Date()
    closes: {type: Date, default: null},  //null if rolling
    areas: {type: [String], default: []} //required, area(s) of research (molecular bio, bioengineering, electrical engineering, computer science, etc.)
    // howToStoreObjects: Schema.Types.Mixed
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


/** End ADD TO DATABASE */

/** Begin SEARCHING THE DATABASE */



/**End SEARCHING THE DATABASE */

/** End MONGODB AND MONGOOSE SETUP */


/**Begin ENDPOINTS */

//Example code for receiving a request from the front end that doesn't send any data,
/*app.get('/something', function (req, res) {
    //res is used to send the result
    res.send("hello");
});*/

app.post('/getOpportunity', function (req, res) {
    const id = req.body.id;
    opportunityModel.findById(id, function (err, opportunities) {
        if (err) {
            res.send(err);
            return; // instead of putting an else
            //handle the error appropriately
        }
        res.send(opportunities);
    });
});

app.post('/getApplications', function (req, res) {
    const labAdminId = req.body.id;
    opportunityModel.findById("5a07b18e541d103834836eeb", function (err, opportunities) {
        if (err) {
            res.send(err);
            return; // instead of putting an else
            //handle the error appropriately
        }
        res.send(opportunities.applications);
    });
});

app.get('/getOpportunitiesListing', function (req, res) {
    opportunityModel.find({
            // opens: {
            //     $lte: new Date()
            // },
            // closes: {
            //     $gte: new Date()
            // }
        },
        function (err, opportunities) {
            if (err) {
                res.send(err);
                return;
                //handle the error appropriately
            }
            res.send(opportunities);

        });
});

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

/**
 * Example of code for receiving a request from the front end that sends data with its requests,
 * url in here (sendFormData) and in the front-end ajax request have to both be sendFormData in order for them to communicate
 */
app.post('/sendFormData', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data);
    //res is used to send the result, which the front end can parse
    res.send("hello");
});

app.post('/createOpportunity', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data);

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
            console.log(err);
        } else //Handle this error however you see fit
            res.send("Success!");

        // Now the opportunity is saved in the Opportunities collection on mlab!
    });
});

app.post('/createUndergrad', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data);
    console.log(data.title);

    var undergrad = new undergradModel({

        firstName: data.firstName,
        lastName: data.lastName,
        gradYear: data.year,    //number
        major: data.major,
        gpa: data.gpa,
        netID: data.netID
    });
    undergrad.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            console.log(err);
        } //Handle this error however you see fit
        else {
            res.send("success!");
        }
        // Now the opportunity is saved in the commonApp collection on mlab!
    });

});

///Endpoint for researchsignup

app.post('/createLabAdmin', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data);

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
            opportunity.questions = req.body.questions || opportunity.questions;
            opportunity.requiredClasses= req.body.requiredClasses || opportunity.requiredClasses;
            opportunity.minGPA = req.body.minGPA || opportunity.minGPA;
            opportunity.minHours = req.body.minHours || opportunity.minHours;
            opportunity.maxHours = req.body.maxHours|| opportunity.maxHours;
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
    let id = req.query.id;
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
            labAdmin.netId  = req.body.netId || labAdmin.netId;
            labAdmin.firstName = req.body.firstName || labAdmin.firstName;
            labAdmin.lastName = req.body.lastName|| labAdmin.lastName;
            labAdmin.verified = req.body.verified|| labAdmin.verified;

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
    console.log("delete opportuinty");
    console.log(id);

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
/**End ENDPOINTS */


app.post('/deleteUndergrad', function (req, res) {
    var id = req.body.id;
    console.log("delete undergrad");
    console.log(id);

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
    console.log("delete lab admin");
    console.log(id);

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

function base64ArrayBuffer(arrayBuffer) {
    var base64    = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes         = new Uint8Array(arrayBuffer)
    var byteLength    = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength    = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}

app.post('/storeResume', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    let params = {
        Bucket: "research-connect-student-files",
        Key: "1517452061886"
    };
    s3.getObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            let baseString = base64ArrayBuffer(data.Body);
            res.send('<embed width="100%" height="100%" src=data:application/pdf;base64,'+ baseString +' />');
        }
        // successful response
    });
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let resume = req.files.resume;
    //TODO change Key param to name of student plus date.now
    // let uploadParams = {Bucket: "research-connect-student-files", Key: Date.now().toString(), Body: req.files.resume.data};
    // console.log("yay!");
    // s3.upload (uploadParams, function (err, data) {
    //     if (err) {
    //         console.log("Error", err);
    //     } if (data) {
    //         console.log("Upload Success", data.Location);
    //     }
    // });
});

//EMAIL SENDGRID
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
//create buttons email:
//site url and endpoint

let siteUrl = "localhost:3001"
var messsgeContent = "";
messageContent += createButton(siteUrl, );




const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'ag946@cornell.edu',
    from: 'ayeshagrocks@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js </strong> ',
};

sgMail.send(msg);



    function createButton(siteUrl, endpoint){

            //button with atag
            //when button clicked url/endpoint?rate=good --> rate our site endpoint, get query --> update with that value.

        var s = '<a href="siteUrl/endpoint" target="_blank" input type="button" value="Link-button"></a>'

        app.get("/"+endpoint,function(req,res){
            var id = req.query.id;
        });

        return s;

    }

/*******************************/


    /**End ENDPOINTS */



    /*******************************/


// sgMail.send(msg);

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
    console.log(`api running on port ${port}`);
});








//Example code to create an instance of a model (in this case we're creating an opportunity)
/**
 var opportunity = new opportunityModel({
    title: "CellMate: A Responsive and Accurate Vision-based Appliance Identification System",
    area: ["Electrical Engineering"],
    labName: "Katz Lab",
    labId: "1tq252r3ratrey4wt",
    pi: "Randy Katz",
    supervisor: "Kaifei Chen",
    projectDescription: "Identifying and interacting with smart appliances has been challenging in the burgeoning smart building era. Existing identification methods require either cumbersome query statements or the deployment of additional infrastructure. There is no platform that abstracts sophisticated computer vision technologies to provide an easy visual identification interface, which is the most intuitive way for a human. CellMate is a new kind of visual appliance identification system that leverages advantages of different computer vision technologies and organizes them to optimize single image queries for fast response, high accuracy, and scalability.",
    undergradTasks: "Undergraduate students will learn the state-of-art of vision-based localization algorithms and implementations, design and implement our research prototypes, collect data, discuss with graduate students to tackle problems and invent algorithms, and contribute to research papers. Students will be given specific engineering tasks, and are expected to meet with the research supervisor once or twice a week.",  //what the undergrad would be doing
    opens: new Date(2017, 8, 5, 0, 0, 0, 0),
    closes: new Date(2018, 3, 9, 0, 0, 0, 0),  //null if rolling
    startDate: "Summer 2018", //null if start asap, string b/c it will prob be something like Fall 2018
    minHours: 3,
    maxHours: 9,
    // skills: [String],
    qualifications: "C++ (required), Android programing (required), Algorithms (required), Operating System (required), Networking (required), Computer Vision (desirable), Machine Learning (desirable)",
    minGPA: 0,
    requiredClasses: ["ECE 2300"],
    questions: ["What experience do you have in this field?", "Why do you want to work in my lab?"],
    yearsAllowed: ["sophomore", "junior"],
    applications: 50,   //number of people who've submitted
    spots: 1   //number of people they're willing to take
});
 */

// Example code for saving a model instance. Save the new model instance, passing a callback. THIS IS ASYNCHRONOUS!!!
/**
 opportunity.save(function (err) {
    if (err) {
        console.log(err);
    } //Handle this error however you see fit

    // Now the opportunity is saved in the Opportunities collection on mlab!
});
 */

//Example code for searching the database:
/**
 opportunityModel.find({}, function (err, opportunities) {
   console.log(opportunities);
   //has to be double quotes for the search criteria ("andrew" in this case)!
   // 'students' contains the list of students that match the criteria.
   //since we only specify firstName and year, that's all the info about the students we'll get back
   if (err) {
       console.log(err);
       //handle the error appropriately
   }
   // console.log(students);
});
 */