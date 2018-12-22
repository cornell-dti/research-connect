const express = require('express');

const app = express.Router();
const {
  undergradModel, labAdministratorModel, opportunityModel, debug, replaceAll, sgMail, sgStatusGroup,
} = require('../common.js');

/**
 * Send an email to notify the student of their status change
 * Body of request: {
 *  opportunityId: xxx,
 *  labAdminNetId: xxx,
 *  undergradNetId: xxx,
 *  message: xxx,
 *  status: "accept" | "reject" | "interviewing"
 * }
 */
app.post('/send', (req, res) => {
  debug('top');
  const oppId = req.body.opportunityId;
  const profId = req.body.labAdminNetId;
  const ugradNetId = req.body.undergradNetId;
  let { message } = req.body;
  const { status } = req.body;
  /**
     *  *  Values we can replace:
     *  {studentFirstName}, {studentLastName} --> the first or last name of the student they just clicked accept/reject/interview for
     *  {opportunity title} --> the title/name of the opportunity that students see when browsing and examining opportunities.
     *  {yourFirstName}, {yourLastName}, {yourEmail} --> first or last name or email of current lab administrator viewing applications
     *
     */
  debug(1);
  undergradModel.findOne({ netId: ugradNetId }, (err, ugradInfo) => {
    debug(ugradInfo);
    labAdministratorModel.findOne({ netId: profId }, (err2, prof) => {
      opportunityModel.findById(oppId, (err3, opportunity) => {
        debug('2');
        for (let i = 0; i < opportunity.applications.length; i++) {
          if (opportunity.applications[i].undergradNetId === ugradNetId) {
            opportunity.applications[i].status = status;
            break;
          }
        }
        const temp = opportunity.messages;
        temp[status] = message;
        debug(3);
        opportunity.messages = temp;
        opportunity.markModified('messages');
        opportunity.markModified('applications');
        opportunity.save((err4) => {
          if (err4) {
            debug(err);
          }
        });
        message = replaceAll(message, '{studentFirstName}', ugradInfo.firstName);
        message = replaceAll(message, '{studentLastName}', ugradInfo.lastName);
        message = replaceAll(message, '{yourFirstName}', prof.firstName);
        message = replaceAll(message, '{yourLastName}', prof.lastName);
        message = replaceAll(message, '{yourEmail}', `${prof.netId}@cornell.edu`);
        message = replaceAll(message, '{opportunityTitle}', opportunity.title);
        const msg = {
          to: `${ugradNetId}@cornell.edu`,
          from: {
            name: 'Research Connect',
            email: 'hello@research-connect.com',
          },
          replyTo: 'acb352@cornell.edu',
          asm: {
            groupId: sgStatusGroup,
          },
          subject: `Research Connect Application Update for "${opportunity.title}"`,
          text: message,
          html: replaceAll(message, '\n', '<br />'),
        };
        debug(10);
        sgMail.send(msg);
        res.status(200).end();
      });
    });
  });
});


/**
 * Takes the id of an opportunity as a parameter in the url
 * Returns the messages object of the opportunity Messages object looks like so:
 * {
 *  "accept": "Hi {firstName}, ....",
 *  "reject": "...",
 *  "interview": "..."
 * }
 *  When sent to the back-end, any fields in {} will be replaced with that field
 *  Values we can replace:
 *  {studentFirstName}, {studentLastName} --> the first or last name of the student they just clicked accept/reject/interview for
 *  {opportunityTitle} --> the title/name of the opportunity that students see when browsing and examining opportunities.
 *  {yourFirstName}, {yourLastName}, {yourEmail} --> first or last name or email of current lab administrator viewing applications
 *
 * }
 */
app.get('/:opportunityId', (req, res) => {
  const { opportunityId } = req.params;
  opportunityModel.findById(opportunityId, (err, opportunity) => {
    res.send(opportunity.messages);
  });
});

module.exports = app;
