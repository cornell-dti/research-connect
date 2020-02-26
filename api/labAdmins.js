const express = require('express');

const app = express.Router();
const {
  labAdministratorModel, labModel, debug, verify, handleVerifyError,
} = require('../common.js');

// gets the lab admin by their net id
app.get('/:netId', (req, res) => {
  labAdministratorModel.find({ netId: req.params.netId }, (err, labAdmin) => {
    if (err) {
      return err;
    }

    return res.send(labAdmin);
  });
});

// return the labid of a labAdmin when given their token (id)
app.get('/lab/:id', (req, res) => {
  if (!req.params.id) {
    return res.send(null);
  }
  verify(req.params.id, (email) => {
    labAdministratorModel.findOne({ email }, (err, labAdmin) => {
      // if labAdmin is null or undefined (falsy) then it's an undergraed
      if (!labAdmin) {
        return res.send('undergrad');
      }
      if (err) {
        return res.status(500).send(err);
      }
      return res.send(labAdmin.labId);
    });
  }, true).catch((error) => {
    handleVerifyError(error, res);
  });
  return null;
});

/**
 * Creates lab admin object using info from the data object
 * @param data should have all the proper fields below
 */

function createLabAdminObject(data) {
  return new labAdministratorModel({
    role: data.role,
    labId: data.labId,
    netId: data.netId,
    firstName: data.firstName,
    lastName: data.lastName,
    verified: data.verified,
    notifications: data.notifications,
    lastSent: Date.now(),
    email: data.email,
  });
}

/* In the addLabAdmin endpoint, check to see if the req.body.labId field is null.
 If it is null, then create a lab with labName, labDescription, and labUrl and save it to the database.
 All three should be in req.body. If labId is not null, then just continue with the method as usual.
 */
function createLabAndAdmin(req, res) {
  const data = req.body;
  const lab = new labModel({
    name: data.name,
    labPage: data.labPage,
    labDescription: (data.labDescription ? data.labDescription : 'No lab info available.'),
    labAdmins: [data.netId],
    pi: data.pi,
    // labAdmins and opportunities not needed during lab admin signup. so commented out.
    // labAdmins: data.labAdmins,
    // opportunities: data.opportunities
  });

  lab.save((err, labObject) => {
    if (err) {
      debug(err);
      return res.status(500).send({ errors: err.errors });
    }

    if (data.notifications === undefined || data.notifications === -2) {
      // set it to 0 since that means they'll get an email every time someone submits an application
      data.notifications = 0;
    }

    data.labId = labObject._id;

    const labAdmin = createLabAdminObject(data);

    labAdmin.save((err2) => {
      if (err2) {
        debug(err2);
        return res.status(500).send({ errors: err2.errors });
      }
      return null;
    });
    return null;
  });
}

/**
 * Takes data and creates a lab admin assuming they already have a lab id
 * @param data
 * @param res the response
 */
/**
function createLabAdmin(data, res) {
  // -2 means they didn't select anything since -2 is the value of the default option on the select menu
  if (data.notifications === undefined || data.notifications === -2) {
    // set it to 0 since that means they'll get an email every time someone submits an application
    data.notifications = 0;
  }

  const labAdmin = createLabAdminObject(data);

  labAdmin.save((err) => {
    if (err) {
      res.status(500).send({ errors: err.errors });
      debug(err);
    } // Handle this error however you see fit
    else {
      labModel.findById(data.labId, (error, lab) => {
        lab.labAdmins.push(data.netId);
        lab.markModified('labAdmins');
        lab.save((err, todo) => {
          if (err) {
            res.status(500).send(err);
          }
          res.status(200).send('success');
        });
      });
    }
    // Now the opportunity is saved in the commonApp collection on mlab!
  });
}
 */

// previously POST /createLabAdmin
app.post('/', (req, res) => {
  // req is json containing the stuff that was sent if there was anything
  const data = req.body;
  verify(data.token_id, (email) => {
    data.email = email;
    // if labId is null then there is no existing lab and creating new lab
    if (!data.labId) {
      // check to see if they are creating a new lab or the select just bugged out and didn't add the lab id
      labModel.findOne({ name: new RegExp(['^', data.name, '$'].join(''), 'i') }, (err, lab) => {
        if (lab === null) {
          createLabAndAdmin(req, res);
          return res.send('success!');
        }

        data.labId = lab._id;
        // -2 means they didn't select anything since -2 is the value of the default option on the select menu
        if (data.notifications === undefined || data.notifications === -2) {
          // set it to 0 since that means they'll get an email every time someone submits an application
          data.notifications = 0;
        }

        const labAdmin = new labAdministratorModel({
          role: data.role,
          labId: data.labId,
          netId: data.netId,
          firstName: data.firstName,
          lastName: data.lastName,
          notifications: data.notifications,
          lastSent: Date.now(),
          verified: data.verified,
          email,
        });

        labAdmin.save((err2) => {
          if (err2) {
            res.status(500).send({ errors: err2.errors });
            debug(err2);
          } else { // Handle this error however you see fit
            labModel.findById(data.labId, (error, lab2) => {
              lab2.labAdmins.push(data.netId);
              lab2.markModified('labAdmins');
              lab2.save((err3) => {
                if (err3) {
                  res.status(500).send(err3);
                }
                res.send('success');
              });
            });
          }
          // Now the opportunity is saved in the commonApp collection on mlab!
        });
        return null;
      });
    } else {
      // -2 means they didn't select anything since -2 is the value of the default option on the select menu
      if (data.notifications === undefined || data.notifications === -2) {
        // set it to 0 since that means they'll get an email every time someone submits an application
        data.notifications = 0;
      }

      const labAdmin = new labAdministratorModel({
        role: data.role,
        labId: data.labId,
        netId: data.netId,
        firstName: data.firstName,
        lastName: data.lastName,
        notifications: data.notifications,
        lastSent: Date.now(),
        verified: data.verified,
        email,
      });

      labAdmin.save((err) => {
        if (err) {
          debug(err);
          return res.status(500).send({ errors: err.errors });
        } // Handle this error however you see fit

        labModel.findById(data.labId, (error, lab) => {
          lab.labAdmins.push(data.netId);
          lab.markModified('labAdmins');
          lab.save((err2) => {
            if (err2) {
              debug(err2);
              return res.status(500).send(err2);
            }
            return res.send('success');
          });
        });
        // Now the opportunity is saved in the commonApp collection on mlab!
        return null;
      });
    }
  }, true).catch((error) => {
    handleVerifyError(error, res);
  });
});

app.put('/:id', (req, res) => {
  const { id } = req.params;
  labAdministratorModel.findById(id, (err, labAdmin) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.
      labAdmin.role = req.body.role || labAdmin.role;
      labAdmin.labId = req.body.labId || labAdmin.labId;
      labAdmin.netId = req.body.netId || labAdmin.netId;
      labAdmin.firstName = req.body.firstName || labAdmin.firstName;
      labAdmin.lastName = req.body.lastName || labAdmin.lastName;
      labAdmin.verified = req.body.verified || labAdmin.verified;

      // Save the updated document back to the database
      labAdmin.save((err2, todo) => {
        if (err2) {
          res.status(500).send(err2);
        }
        return res.status(200).send(todo);
      });
    }
  });
});

app.delete('/:id', (req, res) => {
  const { id } = req.params;

  labAdministratorModel.findByIdAndRemove(id, () => {
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    const response = {
      message: 'Lab admin successfully deleted',
      id,
    };
    res.status(200).send(response);
  });
});


module.exports = app;
