/**
 * Send a request to /applications/:id, where "id" is the id of the application
 * Returns the application object with that id
 */
const express = require('express');
const {
  undergradModel, labAdministratorModel, opportunityModel, labModel, mongoose, debug, handleVerifyError, verify,
} = require('../common.js');

const app = express.Router();
app.get('/:id', (req, res) => {
  const appId = req.params.id;
  opportunityModel.find({}, (err, docs) => {
    for (let i = 0; i < docs.length; i++) {
      const opportunityObject = docs[i];
      for (let j = 0; j < opportunityObject.applications.length; j++) {
        if (opportunityObject.applications[j].id === appId) {
          res.send(opportunityObject.applications[j]);
          return;
        }
      }
    }
  });
});


// previously POST /getApplications
app.get('/', (req, res) => {
  // decryptGoogleToken(req.query.id, function (tokenBody) {
  verify(req.query.id, (labAdminId) => {
  // const labAdminId = 'acb352352';
  // let labAdminId = tokenBody.email.replace("@cornell.edu", "");
    const opportunitiesArray = [];
    const reformatted = {};
    // get the labAdmin object of the lab admin who made this requeste
    labAdministratorModel.findOne({ netId: labAdminId }, (err, labAdmin) => {
      if (err) {
        return res.send(err);
      }
      if (labAdmin === null) {
        return res
          .status(401)
          .send(`Lab administrator with Net ID "${labAdminId}" was not found in the database for lab administrators.`);
      }
      // get the lab of the lab admin who made this request
      labModel.findById(labAdmin.labId, (err2, lab) => {
        if (err2) {
          return res.send(err2);
        }
        const mongooseLabIds = [];
        for (let i = 0; i < lab.opportunities.length; i += 1) {
          mongooseLabIds.push(mongoose.Types.ObjectId(lab.opportunities[i]));
        }
        // get all the opportunities of the lab of the lab admin who made this request
        opportunityModel.find({
          _id: {
            $in: mongooseLabIds,
          },
        }, (err3, docs) => { // docs = all opportunities of the lab of the lab admin who made this request
          let applicationsArray = [];// all applications for all opportunities
          const allApplications = {};// dict where key=title of opportunity / value=list of applications for that opportunity
          const netIds = [];// netIds of all students that applied for any opportunity
          for (let i = 0; i < docs.length; i++) {
            const opportunityObject = docs[i];// an opportunityModel
            for (let j = 0; j < opportunityObject.applications.length; j++) {
              applicationsArray.push(opportunityObject.applications[j]);
              netIds.push(opportunityObject.applications[j].undergradNetId);
            }
            // allApplications is object where key is opportunity name and value is array of all applications
            allApplications[opportunityObject.title] = applicationsArray;
            opportunitiesArray.push(opportunityObject);
            applicationsArray = [];
          }
          undergradModel.find({
            netId: {
              $in: netIds,
            },
          }, (err4, studentInfoArray) => { // studentInfoArray is list of undergradModels
            let count = 0;
            Object.keys(allApplications).forEach((key) => { // For each opportunity in a list of all opportunities
              const currentApplication = allApplications[key];// currentApplication is all applications of a given opportunity
              for (let i = 0; i < currentApplication.length; i++) { // for each student's application for this opportunity...
                const currentStudent = currentApplication[i];
                const undergradId = currentStudent.undergradNetId;
                const undergradInfo = studentInfoArray.filter((student) => student.netId === undergradId)[0];
                // now we add more info to it so we can send this applications object thing back to the front-end with the undergrad data for them to display, kind of like joining tables if we were using SQL
                currentStudent.firstName = undergradInfo.firstName;
                currentStudent.lastName = undergradInfo.lastName;
                currentStudent.gradYear = undergradInfo.gradYear;
                currentStudent.major = undergradInfo.major;
                currentStudent.gpa = undergradInfo.gpa;
                currentStudent.courses = undergradInfo.courses;
                currentStudent.skills = undergradInfo.skills;
                currentStudent.opportunity = key; // The title of the opportunity this application is being sent to
              }
              // reformat it to match:
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
                opportunity: opportunitiesArray[count],
                applications: allApplications[key],
                debugThis: opportunitiesArray[count]._doc.title,
              };
              count += 1;
            });
            res.send(reformatted);
          });
        });
        return null;
      });
      return null;
    });
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

// previously POST /storeApplication
app.post('/', (req, res) => {
  opportunityModel.findById(req.body.opportunityId, (err, opportunity) => {
    if (err) {
      return err;
    }

    // if req.body is not empty and (netid is falsy or netid is unknown)
    if (req.body && (!req.body.netId || req.body.netId === 'unknown')) {
      return res.send('');
    }
    const application = {
      undergradNetId: req.body.netId,
      status: 'received',
      responses: req.body.responses,
      timeSubmitted: Date.now(),
      id: req.body.netId + Date.now(),
      skills: [],
      opportunity: opportunity.title,
    };
    undergradModel.find({ netId: req.body.netId }, (_, u) => {
      application.skills = u[0].skills;
      opportunity.applications.push(application);
      opportunity.save((err3) => {
        if (err3) {
          debug(err3);
        }
      });
      res.send('success!');
    });
    return null;
  });
});

module.exports = app;
