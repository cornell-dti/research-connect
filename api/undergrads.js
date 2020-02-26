const express = require('express');

const app = express.Router();
const {
  verify, undergradModel, labAdministratorModel, debug, handleVerifyError, sgMail, sgAnnouncementsGroup,
} = require('../common.js');
const common = require('../common.js');

// professors can get the information on any student
app.get('/la/:netId', (req, res) => {
  verify(req.query.tokenId, (profNetId) => {
    if (!profNetId) {
      return res.status(401).send({});
    }
    labAdministratorModel.findOne({ netId: profNetId }, (err, labAdmin) => {
      if (labAdmin === null) return res.status(403).send({});
      undergradModel.findOne({ netId: req.params.netId }, (err2, undergrad) => {
        if (err2) {
          return err2;
        }
        res.send(undergrad);
        return null;
      });
      return null;
    });
    return null;
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

/**
 * Params in body: tokenId (contains google auth token)
 */
app.post('/email', (req, res) => {
  const { tokenId } = req.body;
  verify(tokenId, (netId) => {
    if (!netId) {
      res.send('');
      return;
    }
    undergradModel.findOne({ netId }, (err, undergrad) => {
      if (err || !undergrad) {
        debug(err);
        res.send('');
        return;
      }
      res.send(undergrad.emailHtml);
    });
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

app.get('/star', (req, res) => {
  verify(req.query.token_id, (decrypted) => {
    if (!decrypted) {
      res.send([]);
      return;
    }
    undergradModel.find({ netId: decrypted }, (err, undergrads) => {
      if (err) {
        res.status(500).send([]);
        return;
      }
      if (!undergrads.length) {
        res.send([]);
        return;
      }
      if (req.query.type === 'opportunity') {
        res.send(undergrads[0].starredOpportunities);
        return;
      }
      if (req.query.type === 'faculty') {
        res.send(undergrads[0].starredFaculty);
      }
    });
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

/**
 * takes in the token_id, opportunity id (`id`) and the type enum and returns true if the opportunity id is in the array
 */
app.get('/isStarred', (req, res) => {
  const itemId = req.query.id;
  const { type } = req.query;
  verify(req.query.token_id, (decrypted) => {
    if (!decrypted) {
      res.send([]);
      return;
    }
    const searchObj = { netId: decrypted };
    if (type === 'opportunity') {
      searchObj.starredOpportunities = itemId;
    } else {
      searchObj.starredFaculty = itemId;
    }
    // if undergrad is falsy, then this will be false meaning this id isn't in this undergrad
    undergradModel.findOne(searchObj, (_, undergrad) => res.send(!!undergrad));
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

app.get('/token/:tokenId', (req, res) => {
  verify(req.params.tokenId, (decrypted) => {
    if (!decrypted) {
      res.send([]);
      return;
    }
    undergradModel.find({ netId: decrypted }, (err, undergrads) => {
      if (err) {
        return err;
      }
      return res.send(undergrads);
    });
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

// previously POST /createUndergrad
app.post('/', (req, res) => {
  if (!req.body || !req.body.token_id) {
    return res.status(412).send('No user found with current session token.');
  }
  verify(req.body.token_id, (email) => {
    if (email === null) {
      return res.status(412).send('No user found with current session token.');
    }
    const netId = common.getNetIdFromEmail(email);
    if (!netId) {
      return res.status(412)
        .send('The email you signed up with does not end in @cornell.edu. Please log out and try again.');
    }
    // req is json containing the stuff that was sent if there was anything
    const data = req.body;
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
    undergrad.save((err) => {
      if (err) {
        res.status(500).send({ errors: err.errors });
      } else {
        // Handle this error however you see fit
        const msg = {
          to: `${netId}@cornell.edu`,
          from: {
            name: 'Research Connect',
            email: 'hello@research-connect.com',
          },
          replyTo: 'acb352@cornell.edu',
          asm: {
            groupId: sgAnnouncementsGroup,
          },
          subject: 'Guide to Finding Research!',
          html: `Hi ${undergrad.firstName},<br />
                       Thanks for signing up for Research Connect! To help you
                       in your research journey, we've provided a comprehensive
                       step-by-step guide to finding computer science research. View it <a href="http://bit.ly/2Ob7dfz?ref=email">here!</a>
                       <br /><br />Thanks,
                       <br />The Research Connect Team<br /><br />`,
        };
        sgMail.send(msg).catch((e) => debug(e.response.body.errors));
        res.status(200).send('success!');
      }
      // Now the opportunity is saved in the commonApp collection on mlab!
    });
    return null;
  }, true).catch((error) => {
    debug(error);
    handleVerifyError(error, res);
    return null;
  });
  return null;
});

app.put('/:netId', (req, res) => {
  const data = req.body;
  let nId = req.params.netId;
  verify(req.params.tokenId, (decrypted) => {
    nId = decrypted;
    undergradModel.find({ netId: nId }, (err, undergrad) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.

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
          res.status(200).send(todo);
        });
      }
    });
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

/**
 * Removes val from arr if it's already in there, otherwise adds it.
 * @param arr
 * @param val
 */
function addOrRemoveIfExists(arr, val) {
  if (arr.includes(val)) {
    arr.splice(arr.indexOf(val), 1);
  } else {
    arr.push(val);
  }
}

/**
 * Adds `id` to array in undergrad of `token_id` to the array for `type`
 * sends back the updated array of starred items
 * If `id` is already in the array, then it's removed
 */
app.post('/star', (req, res) => {
  const data = req.body;
  const itemId = req.body.id;
  const { type } = req.body;
  verify(data.token_id, (decrypted) => {
    if (!decrypted) {
      res.send([]);
      return;
    }
    undergradModel.find({ netId: decrypted }, (err, undergrad) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // this would happen if a lab admin is POSTing
        if (!undergrad.length) {
          res.send([]);
          return;
        }
        let arr = [];
        if (itemId) {
          if (type === 'opportunity') {
            arr = undergrad[0].starredOpportunities;
          } else if (type === 'faculty') {
            arr = undergrad[0].starredFaculty;
          }
          addOrRemoveIfExists(arr, itemId);
        } else {
          res.status(500).send('no faculty or opportunity id present');
          return;
        }
        // Save the updated document back to the database
        undergrad[0].save((err2) => {
          if (err2) {
            res.status(500).send(err2);
            return;
          }
          res.status(200).send(arr);
        });
      }
    });
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

module.exports = app;
