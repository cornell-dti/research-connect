const express = require('express');

const app = express.Router();
const {
  verify, undergradModel, labAdministratorModel, debug, handleVerifyError,
} = require('../common.js');
const common = require('../common.js');

// professors can get the information on any student
app.get('/la/:netId', (req, res) => {
  verify(req.query.tokenId, (profNetId) => {
    if (!profNetId) {
      return res.status(401).send({});
    }
    debug('prof net id');
    debug(profNetId);
    labAdministratorModel.findOne({ netId: profNetId }, (err, labAdmin) => {
      if (labAdmin === null) return res.status(403).send({});
      debug(req.params);
      undergradModel.findOne({ netId: req.params.netId }, (err2, undergrad) => {
        if (err2) {
          return err2;
        }
        debug(undergrad);
        res.send(undergrad);
        // debug(undergrad.netId);
        return null;
      });
      return null;
    });
    return null;
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

app.get('/:tokenId', (req, res) => {
  verify(req.params.tokenId, (decrypted) => {
    if (!decrypted) {
      return res.send([]);
    }
    undergradModel.find({ netId: decrypted }, (err, undergrads) => {
      if (err) {
        debug('Not found');
        return err;
      }
      debug('Found');
      if (undergrads.length) {
        debug(undergrads[0].netId);
      } else {
        debug('no results found');
      }

      return res.send(undergrads);
    });
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

// previously POST /createUndergrad
app.post('/', (req, res) => {
  debug(req.body);
  if (!req.body || !req.body.token_id) {
    return res.status(412).send('No user found with current session token.');
  }
  verify(req.body.token_id, (email) => {
    debug(`email: ${email}`);
    if (email === null) {
      return res.status(412).send('No user found with current session token.');
    }
    debug('net id:');
    const netId = common.getNetIdFromEmail(email);
    debug(netId);
    if (!netId) {
      return res.status(412).send('The email you signed up with does not end in @cornell.edu. Please log out and try again.');
    }
    debug('checkpoint');
    // req is json containing the stuff that was sent if there was anything
    const data = req.body;
    debug(data.firstName);
    debug(data.lastName);
    debug(data.gradYear);
    debug(data.major);
    debug(data.GPA);
    if (data.courses) {
      data.courses = data.courses.map((element) => {
        const trimmed = element.trim();
        if (trimmed) {
          const courseNumberRegex = /[0-9]{4}/; // look for first set of four consecutive digits. eg: 1110 in CS 1110
          const matchResult = trimmed.match(courseNumberRegex);
          const courseNumber = trimmed.slice(0, matchResult.index + 4);
          return courseNumber;
        }
        return null;
      });
      data.courses = data.courses.filter(Boolean); // remove falsy values, https://stackoverflow.com/a/32906951/5177017
    }
    debug(data.courses);
    debug('This be the resume');
    // if they don't have the required values
    if (!data.firstName || !data.lastName || !data.gradYear) {
      return res.status(400).send('Missing either first name, last name, or graduation year');
    }
    const undergrad = new undergradModel({

      firstName: data.firstName,
      lastName: data.lastName,
      gradYear: data.gradYear, // number
      major: data.major,
      gpa: data.GPA,
      netId,
      courses: data.courses,
    });
    debug(undergrad);
    undergrad.save((err) => {
      if (err) {
        res.status(500).send({ errors: err.errors });
        debug(err);
        debug('error in saving ugrad');
        debug(err);
      } else { // Handle this error however you see fit
        debug('saved');
        res.status(200).send('success!');
      }
      // Now the opportunity is saved in the commonApp collection on mlab!
    });
    return null;
  }, true).catch((error) => {
    debug('error in verify');
    debug(error);
    handleVerifyError(error, res);
    return null;
  });
  return null;
});

app.put('/:netId', (req, res) => {
  debug('We have reached the backend');
  debug(req.body);
  const data = req.body;
  const nId = req.params.netId;
  undergradModel.find({ netId: nId }, (err, undergrad) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.

      debug(undergrad);

      undergrad[0].gradYear = data.year || undergrad[0].gradYear;
      undergrad[0].major = data.major || undergrad[0].major;
      undergrad[0].gpa = data.gpa || undergrad[0].gpa;
      undergrad[0].courses = data.relevantCourses || undergrad[0].courses;
      undergrad[0].skills = data.relevantSkills || undergrad[0].skills;
      undergrad[0].resumeId = data.resumeId || undergrad[0].resumeId;
      undergrad[0].transcriptId = data.transcriptId || undergrad[0].transcriptId;

      // Save the updated document back to the database
      undergrad[0].save((err2, todo) => {
        if (err2) {
          res.status(500).send(err2);
        }
        debug('success!');
        res.status(200).send(todo);
      });
    }
  });
});

app.delete('/:id', (req, res) => {
  const { id } = req.params;
  undergradModel.findByIdAndRemove(id, () => {
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    const response = {
      message: 'Undergrad successfully deleted',
      id,
    };
    res.status(200).send(response);
  });
});

module.exports = app;
