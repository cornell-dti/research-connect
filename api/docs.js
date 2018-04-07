let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken, s3} = require('../common.js');


app.get('/:id', function (req, res) {
    /** MLAB STORAGE
     docModel.findById(req.params.id, function(err, document){
        res.send(document.doc)
    })
     */
    let params = {
        Bucket: "research-connect-student-files",
        Key: req.params.id
    };
    s3.getObject(params, function (err, data) {
        if (err) {
            console.log('err!');
            console.log(err);
            console.log(err.stack);
            debug(err, err.stack);
        } // an error occurred
        else {
            let baseString = Buffer.from(data.Body, 'base64').toString('ascii');
            res.set('content-type', 'text/plain');
            return res.send(baseString);
        }
    });
});

function generateId(){
    return (Date.now().toString() + Math.random().toString()).replace(".","");
}

//Only used to store resume and transcript, looks for req.body.resume or req.body.transcript.
app.post('/', function (req, res) {
    debug('reached');
    let netId = req.body.netid;
    let resume = req.body.resume;
    let docId = generateId();
    //if there's no resume, so add the trasncript
    if (resume === undefined || resume === null) {
        let transcript = req.body.transcript;
        if (transcript === undefined || transcript === null) {
            res.status(500).send("No files submitted");
        }
        else {
            transcript = transcript[0];
            /** MLAB STORAGE
             let transcriptObj = new docModel();
             transcriptObj.doc = transcript;
             transcriptObj.save(function(err, document){
                    undergradModel.findOneAndUpdate({"netId": netId}, {transcriptId: document.id}, function(err, oldDoc){
                        console.log("trans error: " + err);
                    });
                });
             */
            let uploadParams = {
                Bucket: "research-connect-student-files",
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
            undergradModel.findOneAndUpdate({"netId": netId}, {$set: {transcriptId: docId}}, function(err, oldDoc){
                console.log("trans error: " + err);
            });
        }
    }
    //resume is defined
    else {
        console.log("resume uploaded");
        resume = resume[0];
        /** MLAB STORAGE
         let resumeObj = new docModel();
         resumeObj.doc = resume;
         resumeObj.save(function(err, document){
                undergradModel.findOneAndUpdate({"netId": netId}, {resumeId: document.id}, function(err, oldDoc){
                    console.log("resume error: " + err);
                });
            });
         */
        let uploadParams = {
            Bucket: "research-connect-student-files",
            Key: docId,
            ContentEncoding: 'base64',
            ContentType: 'text/plain',
            Body: resume
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
        undergradModel.findOneAndUpdate({"netId": netId}, {$set: {resumeId: docId}}, function(err, oldDoc){
            console.log("resume error: " + err);
        });
        console.log('gend');
    }
});

module.exports = app;
