/* eslint-disable no-unused-vars */
// import series from 'async/series'; //specification: https://caolan.github.io/async/docs.html#series

// server.js


// import dependencies
// require('dotenv').config();
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
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com');
const fileUpload = require('express-fileupload');
const request = require('request');

// let corsKey = null;
// if (fs.existsSync('./CorsKey.json')) {
//     corsKey = JSON.parse(fs.readFileSync('CorsKey.json', 'utf8'));
//     corsKey = corsKey.key;
// }

// create instances
const app = express();
const router = express.Router();

// set our port to either a predetermined port number if you have set
// it up, or 3001
const port = process.env.PORT || 3001;

// uncomment after placing your favicon in /public
// let favicon = require('serve-favicon');
// app.use(bodyParser.urlencoded({parameterLimit: 100000, limit: '50mb', extended: true}));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
// TODO only allow cors for specific endpoints, not all: https://github.com/expressjs/cors#enable-cors-for-a-single-route
app.use(cors());
app.use(fileUpload());

// To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use((req, res, next) => {
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
const facultyRoute = require('./api/faculty');
const applicationRoute = require('./api/applications');
const labRoute = require('./api/labs');
const docsRoute = require('./api/docs');
const classesRoute = require('./api/classes');

app.use('/api/', index);
app.use('/api/labAdmins', labAdminsRoute);
app.use('/api/opportunities', opportunityRoute);
app.use('/api/applications', applicationRoute);
app.use('/api/undergrads', undergradRoute);
app.use('/api/faculty', facultyRoute);
app.use('/api/labs', labRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/docs', docsRoute);
app.use('/api/classes', classesRoute);

// router.get('/', function (req, res) {
//     res.json({message: 'API Initialized!'});
// });

app.use('/api', router);
app.use(express.static('./build'));
app.use('/*', express.static('./build'));


/** Begin ENDPOINTS */

/** End ENDPOINTS */


/** **************************** */
// END NON-DEFAULT CODE
/** **************************** */


// catch 404 and fgorward to error handler
// app.use(function (req, res, next) {
//     let err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

module.exports = app;

// starts the server and listens for requests
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Api running on port:: ${port}`);
});
