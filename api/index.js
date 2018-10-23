let express = require('express');
let app = express.Router();
let common = require('../common.js');
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken, mongoose, verify, handleVerifyError} = require('../common.js');

/**
 * Used to test quick functions that require the back-end
 */
app.get("/sandbox", function (req, res){
    const msg = {
        to: "abagh0703@gmail.com",
        from: {
            name: "Research Connect",
            email: 'hello@research-connect.com'
        },
        subject: 'New Research Opportunity Available!',
        html: 'Hi,<br />' +
        'A new opportunity was just posted in an area you expressed interest in - ' +
        1 + '. You can apply to it here: http://research-connect.com/opportunity/' + 2 + '<br />' +
        '<br />' +
        'Thanks,<br />' +
        'The Research Connect Team<br />'
    };

    sgMail.send(msg); //TODO uncomment


    return res.send();
});

/**
 * A method to populate fields. Feel free to change it as need be.
 */
app.get("/populate", function (req, res) {
    opportunityModel.find({}, function (err, opps) {
        for (let i = 0; i < opps.length; i++) {
            opps[i]["messages"] = {
                "accept": 'Hi {studentFirstName}, \nI am pleased to inform you that our lab will accept you for the opportunity "{opportunityTitle}". Please email me at {yourEmail} to find out more about when you will start. \n\nSincerely, \n{yourFirstName} {yourLastName}',
                "reject": 'Hi {studentFirstName}, \nI regret to inform you that our lab will not be able to accept you for the ' +
                ' "{opportunityTitle}" position this time. Please consider applying in the future. \n\nRespectfully, ' +
                '\n{yourFirstName} {yourLastName}”.',
                "interview": 'Hi {studentFirstName}, \nWe reviewed your application and would love to learn more about you. Please email {yourEmail} with times in the next seven days that work for you for an interview regarding the opportunity "{opportunityTitle}". \n\nSincerely, \n{yourFirstName} {yourLastName}'
            };
            opps[i]["contactName"] = "dummy value";
            opps[i]["additionalInformation"] = "dummy value";
            opps[i].save(function (err) {
                debug(err);
            });
        }
    });
    res.end();
});

//:input can be email or netid...
app.get("/hasRegistered/:input", function (req, res) {
    let input = req.params.input;
    let netId = null;
    let email = null;
    debug("in hasregistered");
    //if they sent their email...
    if (input.indexOf("@") !== -1){
        let emailParts = input.split("@");
        //get just the part before the at sign
        let domain = emailParts[1];
        //if they're a cornell net id user...
        if (domain.indexOf("cornell.edu") !== -1){
            netId = emailParts[0];
        }
        else {
            email = input;
        }
    }
    else {
        netId = input;
    }
    debug('about ot find one');
    undergradModel.findOne({netId: netId}, function (err, undergrad) {
        debug("undergrad");
        debug(undergrad);
        if (undergrad !== null) {
            return res.send(true);
        }
        //see if they have a netid or not (in which case we'll have to search by email)
        let searchQuery = (email === null ? {netId: netId} : {email: email});
        debug("before lab admin");
        labAdministratorModel.findOne(searchQuery, function (err, labAdmin) {
            debug("completed");
            debug(labAdmin);
            debug(labAdmin !== null);
            return res.send(labAdmin !== null);
        })
    }).catch(function(err){
        debug("weird error in findOne");
        debug(err);
    })
});



/**
 * Returns the role associated with that net id
 * Can either be undergrad, none, or one of the various lab administrator roles
 * @return undergrad, one of the many labAdmin roles, or none
 */
app.get("/role/:token", function (req, res) {
    verify(req.params.token, function (netId) {
        if (netId === null){
            return res.send("none");
        }
        undergradModel.findOne({netId: netId}, function (err, undergrad) {
            if (undergrad !== null) {
                return res.send("undergrad");
            }
            labAdministratorModel.findOne({netId: netId}, function (err, labAdmin) {
                if (labAdmin === null) {
                    return res.send("none");
                }
                res.send(labAdmin.role);
            })
        })
    }).catch(function(error){
        handleVerifyError(error, res);
    });
});

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com");

app.get("/decrypt", function(req, res) {
    let token = req.query.token;
    let returnEmail = (req.query.returnEmail != null && req.query.returnEmail === "true");
    verify(token, function(netId){
        return res.send(netId);
    })
});

//never called? run code coverage test
app.get("/verify/:token", function (req, res) {
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.params.token,
            audience: "938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        debug('before');
        debug(userid);
        debug(payload);
        debug('after');

        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }

    verify().catch(console.error("4"));
});

module.exports = app;
