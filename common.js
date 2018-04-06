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