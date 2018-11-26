let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, mongoose, verify} = require('../common.js');
let common = require('../common.js');


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
app.post('/send', function (req, res) {
    debug("top");
    let oppId = req.body.opportunityId;
    let profId = req.body.labAdminNetId;
    let ugradNetId = req.body.undergradNetId;
    let message = req.body.message;
    let status = req.body.status;
    /**
     *  *  Values we can replace:
     *  {studentFirstName}, {studentLastName} --> the first or last name of the student they just clicked accept/reject/interview for
     *  {opportunity title} --> the title/name of the opportunity that students see when browsing and examining opportunities.
     *  {yourFirstName}, {yourLastName}, {yourEmail} --> first or last name or email of current lab administrator viewing applications
     *
     */
    debug(1);
    undergradModel.findOne({netId: ugradNetId}, function (err, ugradInfo) {
        debug(ugradInfo);
        labAdministratorModel.findOne({netId: profId}, function (err, prof) {
            opportunityModel.findById(oppId, function (err, opportunity) {
                debug("2");
                for (let i = 0; i < opportunity.applications.length; i++) {
                    if (opportunity.applications[i].undergradNetId === ugradNetId) {
                        opportunity.applications[i].status = status;
                        break;
                    }
                }
                let temp = opportunity.messages;
                temp[status] = message;
                debug(3);
                opportunity.messages = temp;
                opportunity.markModified("messages");
                opportunity.markModified("applications");
                opportunity.save(function (err, todo) {
                    if (err) {
                        debug(err);
                    }
                });
                message = replaceAll(message, "{studentFirstName}", ugradInfo.firstName);
                message = replaceAll(message, "{studentLastName}", ugradInfo.lastName);
                message = replaceAll(message, "{yourFirstName}", prof.firstName);
                message = replaceAll(message, "{yourLastName}", prof.lastName);
                message = replaceAll(message, "{yourEmail}", prof.netId + "@cornell.edu");
                message = replaceAll(message, "{opportunityTitle}", opportunity.title);
                let msg = {
                    to: ugradNetId + "@cornell.edu",
                    from: {
                        name: "Research Connect",
                        email: 'hello@research-connect.com'
                    },
                    replyTo: "acb352@cornell.edu",
                    subject: "Research Connect Application Update for \"" + opportunity.title + "\"",
                    text: message,
                    html: replaceAll(message, "\n", "<br />")
                };
                debug(10);
                sgMail.send(msg);
                res.status(200).end();
            })
        })
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
app.get('/:opportunityId', function (req, res) {
    let opportunityId = req.params.opportunityId;
    opportunityModel.findById(opportunityId, function (err, opportunity) {
        res.send(opportunity.messages);
    })
});

module.exports = app;
