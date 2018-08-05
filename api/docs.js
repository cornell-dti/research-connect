let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken, s3, mongoose, verify, handleVerifyError} = require('../common.js');
let common = require('../common.js');
const BUCKET_NAME = process.env.BUCKET_NAME;



app.get('/:id', function (req, res) {
    /** MLAB STORAGE
     docModel.findById(req.params.id, function(err, document){
        res.send(document.doc)
    })
     */
    let params = {
        Bucket: BUCKET_NAME,
        Key: req.params.id
    };
    verify(req.query.token, function (netId) {
        s3.getObject(params, function (err, data) {
            if (err) {
                debug('err!');
                debug(err);
                debug(err.stack);
                debug(err, err.stack);
            } // an error occurred
            else {
                let baseString = Buffer.from(data.Body, 'base64').toString('ascii');
                res.set('content-type', 'text/plain');
                return res.send(baseString);
            }
        });
    }).catch(function(){
        res.status(403).send("You are unauthorized to access this document.");
    });
});

function generateId() {
    return (Date.now().toString() + Math.random().toString()).replace(".", "");
}

//Only used to store resume and transcript, looks for req.body.resume or req.body.transcript.
app.post('/', function (req, res) {
    debug('reached');
    verify(req.body.token_id, function(email){
        debug("email: " + email);
        if (email === null){
            return res.status(412).send("No user found with current session token.");
        }
        debug("net id:");
        let netId = common.getNetIdFromEmail(email);
        debug(netId);
        if (!netId){
            return res.status(412).send("The email you signed up with does not end in @cornell.edu. Please log out and try again.");
        }
        let resume = req.body.resume;
        let docId = generateId();
        debug("resume:");
        debug(resume);
        debug("req.body below, resume above");
        debug(req.body);
        //if there's no resume, so add the trasncript
        if (resume === undefined || resume === null) {
            let transcript = req.body.transcript;
            if (transcript === undefined || transcript === null) {
                res.status(400).send("No files submitted");
            }
            else {
                transcript = transcript[0];
                /** MLAB STORAGE
                 let transcriptObj = new docModel();
                 transcriptObj.doc = transcript;
                 transcriptObj.save(function(err, document){
                    undergradModel.findOneAndUpdate({"netId": netId}, {transcriptId: document.id}, function(err, oldDoc){
                        debug("trans error: " + err);
                    });
                });
                 */
                let uploadParams = {
                    Bucket: BUCKET_NAME,
                    Key: docId,
                    ContentEncoding: 'base64',
                    ContentType: 'text/plain',
                    Body: transcript
                };
                s3.upload(uploadParams, function (err, data) {
                    if (err) {
                        debug("Error", err);
                    }
                    if (data) {
                        debug("Upload Success", data.Location);
                        res.send("Success!");
                    }
                });
                //if this doessn't work, use update operators for the second param: https://docs.mongodb.com/manual/reference/operator/update/
                undergradModel.findOneAndUpdate({"netId": netId}, {$set: {transcriptId: docId}}, function (err, oldDoc) {
                    debug("trans error: " + err);
                });
            }
        }
        //resume is defined
        else {
            debug("resume uploaded");
            resume = resume[0];
            debug(resume);
            /** MLAB STORAGE
             let resumeObj = new docModel();
             resumeObj.doc = resume;
             resumeObj.save(function(err, document){
                undergradModel.findOneAndUpdate({"netId": netId}, {resumeId: document.id}, function(err, oldDoc){
                    debug("resume error: " + err);
                });
            });
             */
            let uploadParams = {
                Bucket: BUCKET_NAME,
                Key: docId,
                ContentEncoding: 'base64',
                ContentType: 'text/plain',
                Body: resume
            };
            debug("upload params");
            debug(uploadParams);
            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    debug("Error in s3 upload", err);
                    debug(err);
                    return;
                }
                if (data) {
                    debug("Upload Success", data.Location);
                    undergradModel.findOneAndUpdate({"netId": netId}, {$set: {resumeId: docId}}, function (err, oldDoc) {
                        debug("resume error: " + err);
                        if (!err){
                            res.status(200).send();
                        }
                        else{
                            debug("error in find  one and update");
                            debug(err);
                            res.status(500).send(err);
                        }
                    });
                }
            });
            debug('gend');
        }
    }, true).catch(function(error){
        debug("error in post doc/");
        debug(error);
        if (!handleVerifyError(error, res)){
            res.status(500).send("Error in submitting your doc. Please try again");
        }
    })
});

module.exports = app;
