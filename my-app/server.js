//server.js
'use strict'

//import dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//create instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = 3001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// var favicon = require('serve-favicon');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
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
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://research-connect:connectresearchers4cornell@ds251245.mlab.com:51245/research-connect';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**Begin SCHEMAS*/
var Schema = mongoose.Schema;

var undergradSchema = new Schema({
    firstName: String,
    lastName: String,
    year: String,  //TODO: add enum for frosh, soph, junior, senior, in form specify this is what they will be next term if it's summer
    skills: []
});

var postDocsGradSchema = new Schema(
    {
        firstName: String,
        lastName: String
    });
var labSchema = new Schema(
    {
        labName: String,
        labDescription: String
    }
);

var professorSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        postDocGrad: [String]
    }
);

var areasOfResearch = ["Computer Science", "Electrical Engineering", "Computational Biology", "Molecular Biology", "Biology"];

var opportunitySchema = new Schema(
    {
        title: {type: String, default: "No title", required: [true, 'Must have title']}, //required
        area: {type: [String], default: []}, //required, area(s) of research (molecular bio, bioengineering, electrical engineering, computer science, etc.)
        labName: {type: String, required: [true, 'Must have lab name']},    //required
        labId: {type: String, required: [true, 'Must have lab ID']},  //required
        pi: {type: String, required: [true, 'Must have PI']}, //required
        supervisor: String, //can be null
        projectDescription: {type: String, minlength: 250, maxlength: 1500}, //required, add min length that you see fit
        undergradTasks: String,  //what the undergrad would be doing, can be null
        opens: {type: Date, default: new Date()},   //if no date is sent use new Date()
        closes: {type: Date, default: null},  //null if rolling
        startDate: String, //null if start asap, string b/c it will prob be something like Fall 2018
        minSemesters: Number,   //can be null, indicating no min. minimum number of semesters they're expected to work in the lab
        minHours: {type: Number, min: 0, max: 500, default: 6}, //can be null, indicating no minimum
        maxHours: {type: Number, min: 0, max: 500, default: 9}, //can be null, indicating no max
        qualifications: String, //can be null/empty
        minGPA: {type: Number, min: 0, max: 4.3, default: 0}, //0 if no minimum gpa required
        requiredClasses: {type: [String], default: []}, //can be empty
        questions: [String],    //can be empty
        yearsAllowed: {type: [String], required: [true, 'Must select student year range']},  //required, do they accept freshman, sophomores, juniors, and/or seniors
        // applications: {type: Number, default: 0},    //use applications.length from now on
        spots: {type: Number, required: [true, 'Must indicate number of spots (enter -1 if no limit)'], min: -1},   //required, number of people they're willing to take, -1 indicates no cap to # of spots
        // howToStoreObjects: Schema.Types.Mixed
        applications: {type: [Schema.Types.Mixed]}
    }
);

var researchSignUpSchema = new Schema({
    labName: String,
    position: String,
    year: String,
    netID: Number

});

var commonAppSchema = new Schema(
    {
        firstName: {type: String, required: [true, 'first name required']},
        lastName: {type: String, required: [true, 'last name required']},
        year: String,
        major: String,
        GPA: {type: Number, min: [0, 'GPA cannot go below 0'], max: [4.3, 'GPA cannot exceed 4.3']}

    }
);

//TODO: add schemas for Postdocs/Grad students, Professors, Opportunities, Labs, etc.
/** End SCHEMAS*/

var undergradModel = mongoose.model('Undergrads', undergradSchema); //a mongoose model = a Collection on mlab/mongodb
var opportunityModel = mongoose.model('Opportunities', opportunitySchema); //a mongoose model = a Collection on mlab/mongodb
var commonAppModel = mongoose.model('Common Application', commonAppSchema);
var researcherSignupModel = mongoose.model('Research Signup', researchSignUpSchema);

/** Begin ADD TO DATABASE */

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

/** End ADD TO DATABASE */

/** Begin SEARCHING THE DATABASE */

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

/**End SEARCHING THE DATABASE */

/** End MONGODB AND MONGOOSE SETUP */


/**Begin ENDPOINTS */

//Example code for receiving a request from the front end that doesn't send any data,
app.get('/something', function (req, res) {
    //res is used to send the result
    res.send("hello");
});

app.get('/getOpportunitiesListing', function (req, res) {
    opportunityModel.find({
        opens: {
            $lte: new Date()
        },
        closes: {
            $gte: new Date()
        }
    }, function (err, opportunities) {
        res.send(opportunities);
        if (err) {  //TODO put this before the above line and add an else so you don't risk both of these running
            res.send(err);
            //handle the error appropriately
        }
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

    opportunity = new opportunityModel({
        title: data.title,
        area: data.area,
        labName: data.labName,
        labId: data.labID,
        pi: data.pi,
        supervisor: data.supervisor,
        projectDescription: data.projectDescription,
        undergradTasks: data.undergradTasks,
        opens: data.opens,
        closes: data.closes,
        startDate: data.startDate,
        minHours: data.minHours,
        maxHours: data.maxHours,
        qualifications: data.qualifications,
        minGPA: data.minGPA,
        spots: data.spots,
        requiredClasses: data.requiredClasses,
        questions: data.question,
        yearsAllowed: data.yearsAllowed,
        applications: 50,   //TODO change
        undergradID: mongoose.Types.ObjectId()
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


app.post('/createCommonApp', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data);
    console.log(data.title);

    var commonApp = new commonAppModel({

        firstName: data.firstName,
        lastName: data.lastName,
        year: data.year,
        major: data.major,
        GPA: data.GPA
    });
    commonApp.save(function (err) {
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

app.post('/createResearcherSignup', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data);

    var researcherSignup = new researcherSignupModel({
        labName: data.labName,
        position: data.position,
        year: data.year,
        netID: 4722392

    });

    researcherSignup.save(function (err) {
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


/**End ENDPOINTS */


 /*******************************/
//END NON-DEFAULT CODE
/*******************************/


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;

//starts the server and listens for requests
app.listen(port, function() {
 console.log(`api running on port ${port}`);
});
