/**
 * Send a request to /applications/:id, where "id" is the id of the application
 * Returns the application object with that id
 */
let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken,
verify, handleVerifyError} = require('../common.js');
let common = require('../common.js');
const mongoose = require('mongoose');

app.get('/:id', function (req, res) {
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
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com");

//previously POST /getApplications
app.get('/', function (req, res) {
    // decryptGoogleToken(req.query.id, function (tokenBody) {
    verify(req.query.id, function (labAdminId) {
        // let labAdminId = tokenBody.email.replace("@cornell.edu", "");
        let opportunitiesArray = [];
        let reformatted = {};
        labAdministratorModel.findOne({netId: labAdminId}, function (err, labAdmin) {
            if (err) {
                res.send(err);
                return;
            }
            if (labAdmin === null){
                return res.status(401).send({});
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
    }).catch(function(error){
        handleVerifyError(error, res);
    });
});

//previously POST /storeApplication
app.post('/', function (req, res) {
    opportunityModel.findById(req.body.opportunityId, function (err, opportunity) {
        if (err) {
            return err;
        }

        let application = {
            "undergradNetId": req.body.netId,
            "status": "received",
            "responses": req.body.responses,
            "timeSubmitted": Date.now(),
            "id": req.body.netId + Date.now()
        };
        opportunity.applications.push(application);
        opportunity.save(function (err) {
        });
        res.send("success!");
    });
});

module.exports = app;