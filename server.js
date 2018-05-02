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
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com");
const fileUpload = require('express-fileupload');
const request = require("request");
const AWS = require('aws-sdk');
let s3;
if (fs.existsSync('./S3Config2.json')) {
    // Do something
    AWS.config.loadFromPath('./S3Config2.json');
    AWS.config.update({region: 'us-east-2'});
    s3 = new AWS.S3();
}

// let corsKey = null;
// if (fs.existsSync('./CorsKey.json')) {
//     corsKey = JSON.parse(fs.readFileSync('CorsKey.json', 'utf8'));
//     corsKey = corsKey.key;
// }

//create instances
const app = express();
const router = express.Router();

//set our port to either a predetermined port number if you have set
//it up, or 3001
const port = process.env.PORT || 3001;

// uncomment after placing your favicon in /public
// var favicon = require('serve-favicon');
// app.use(bodyParser.urlencoded({parameterLimit: 100000, limit: '50mb', extended: true}));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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

const index = require('./api/index');
const labAdminsRoute = require('./api/labAdmins');
const messagesRoute = require('./api/messages');
const opportunityRoute = require('./api/opportunities');
const undergradRoute = require('./api/undergrads');
const applicationRoute = require('./api/applications');
const labRoute = require('./api/labs');
const docsRoute = require('./api/docs');

app.use(express.static("./src/docs"));
app.use("/app*", express.static("./src/docs"));

app.use('/api/', index);
app.use('/api/labAdmins', labAdminsRoute);
app.use('/api/opportunities', opportunityRoute);
app.use('/api/applications', applicationRoute);
app.use('/api/undergrads', undergradRoute);
app.use('/api/labs', labRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/docs', docsRoute);

// router.get('/', function (req, res) {
//     res.json({message: 'API Initialized!'});
// });

app.use('/api', router);

/**Begin ENDPOINTS */

/**End ENDPOINTS */


/*******************************/
//END NON-DEFAULT CODE
/*******************************/


// catch 404 and fgorward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

module.exports = app;

//starts the server and listens for requests
app.listen(port, function () {
    console.log(`api running on port ${port}`);
});
