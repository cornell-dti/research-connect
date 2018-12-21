/**
 * Send a request to /applications/:id, where "id" is the id of the application
 * Returns the application object with that id
 */
const express = require('express');
const {
  undergradModel, labAdministratorModel, opportunityModel, labModel, verify, handleVerifyError, mongoose, debug,
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
    // let labAdminId = tokenBody.email.replace("@cornell.edu", "");
    const opportunitiesArray = [];
    const reformatted = {};
    labAdministratorModel.findOne({ netId: labAdminId }, (err, labAdmin) => {
      if (err) {
        return res.send(err);
      }
      if (labAdmin === null) {
        return res.status(401).send({});
      }
      labModel.findById(labAdmin.labId, (err2, lab) => {
        if (err2) {
          return res.send(err2);
        }
        const mongooseLabIds = [];
        for (let i = 0; i < lab.opportunities.length; i += 1) {
          mongooseLabIds.push(mongoose.Types.ObjectId(lab.opportunities[i]));
        }
        opportunityModel.find({
          _id: {
            $in: mongooseLabIds,
          },
        }, (err3, docs) => { // docs = all opportunities in database
          let applicationsArray = [];// all applications for all opportunities
          const allApplications = {};// dict where key=title of opportunity / value=list of applications for that opportunity
          const netIds = [];// netIds of all students that applied for any opportunity
          for (let i = 0; i < docs.length; i++) {
            const opportunityObject = docs[i];// an opportunityModel
            for (let j = 0; j < opportunityObject.applications.length; j++) {
              applicationsArray.push(opportunityObject.applications[j]);
              netIds.push(opportunityObject.applications[j].undergradNetId);
            }
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
              for (let i = 0; i < currentApplication.length; i++) {
                const currentStudent = currentApplication[i];
                const undergradId = currentStudent.undergradNetId;
                const undergradInfo = studentInfoArray.filter(student => student.netId === undergradId)[0];
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
  console.log('Entered the post function');
  opportunityModel.findById(req.body.opportunityId, (err, opportunity) => {
    if (err) {
      console.log("Post function's find did not work");
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
    undergradModel.find({ netId: req.body.netId }, (err2, u) => {
      console.log(`undergrad is: ${u[0].skills}`);
      application.skills = u[0].skills;
      console.log('Application dictionary set');
      console.log(`Skills be: ${application.skills}`);
      opportunity.applications.push(application);
      opportunity.save((err3) => {
        if (err3) {
          debug(err3);
        }
      });
      res.send('success!');
    });

    /*
        if(application['skills'].length > 0){
            console.log("good job you printed skills");
            console.log(application.skills[1]);
            console.log(application.opportunity);
        }
        */
    return null;
  });
});

module.exports = app;
