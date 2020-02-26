const express = require('express');

const app = express.Router();

const { OAuth2Client } = require('google-auth-library');
const {
  undergradModel,
  labAdministratorModel,
  opportunityModel,
  debug,
  verify,
  handleVerifyError,
} = require('../common.js');

/**
 * A method to populate fields. Feel free to change it as need be.
 */
app.get('/populate', (req, res) => {
  opportunityModel.find({}, (err, opps) => {
    for (let i = 0; i < opps.length; i++) {
      opps[i].messages = {
        accept: 'Hi {studentFirstName}, \n'
          + 'I am pleased to inform you that our lab will accept you for the opportunity '
          + '"{opportunityTitle}". Please email me at {yourEmail} to find out more about when you will start. \n\n'
          + 'Sincerely, \n{yourFirstName} {yourLastName}',
        reject: 'Hi {studentFirstName}, \n'
          + 'I regret to inform you that our lab will not be able to accept you for the '
          + ' "{opportunityTitle}" position this time. Please consider applying in the future. \n\nRespectfully, '
          + '\n{yourFirstName} {yourLastName}”.',
        interview: 'Hi {studentFirstName}, \nWe reviewed your application and would love to learn more about you. '
          + 'Please email {yourEmail} with times in the next seven days that work for you '
          + 'for an interview regarding the opportunity "{opportunityTitle}". \n\n'
          + 'Sincerely, \n{yourFirstName} {yourLastName}',
      };
      opps[i].contactName = 'N/A';
      opps[i].additionalInformation = '';
      opps[i].save((err2) => debug(err2));
    }
  });
  res.end();
});

// :input can be email or netid...
app.get('/hasRegistered/:input', (req, res) => {
  const { input } = req.params;
  let netId = null;
  let email = null;
  // if they sent their email...
  if (input.indexOf('@') !== -1) {
    const emailParts = input.split('@');
    // get just the part before the at sign
    const domain = emailParts[1];
    // if they're a cornell net id user...
    if (domain.indexOf('cornell.edu') !== -1) {
      [netId] = emailParts;
    } else {
      email = input;
    }
  } else {
    netId = input;
  }
  undergradModel.findOne({ netId }, (err, undergrad) => {
    if (undergrad !== null) {
      return res.send(true);
    }
    // see if they have a netid or not (in which case we'll have to search by email)
    const searchQuery = (email === null ? { netId } : { email });
    labAdministratorModel.findOne(searchQuery, (_, labAdmin) => res.send(labAdmin !== null));
    return null;
  }).catch((err) => {
    debug(err);
  });
});


/**
 * Returns the role associated with that net id
 * Can either be undergrad, none, or one of the various lab administrator roles
 * @return undergrad, one of the many labAdmin roles, or none
 */
app.get('/role/:token', (req, res) => {
  verify(req.params.token, (netId) => {
    if (netId === null) {
      return res.send('none');
    }
    undergradModel.findOne({ netId }, (err, undergrad) => {
      if (undergrad !== null) {
        return res.send('undergrad');
      }
      labAdministratorModel.findOne({ netId }, (err2, labAdmin) => {
        if (labAdmin === null) {
          return res.send('none');
        }
        return res.send(labAdmin.role);
      });
      return null;
    });
    return null;
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

const client = new OAuth2Client('938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com');

app.get('/decrypt', (req, res) => {
  const { token } = req.query;
  // const returnEmail = (req.query.returnEmail != null && req.query.returnEmail === 'true');
  verify(token, (netId) => res.send(netId));
});

// never called? run code coverage test
app.get('/verify/:token', (req) => {
  async function verify2() {
    const ticket = await client.verifyIdToken({
      idToken: req.params.token,
      audience: '938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    ticket.getPayload();
  }
  verify2();
});

module.exports = app;
