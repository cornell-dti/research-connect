let express = require('express');
let app = express.Router();
let common = require('../common.js');
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken, mongoose} = require('../common.js');


/**
 * A method to populate fields. Feel free to change it as need be.
 */
app.get('/populate', function (req, res) {
    opportunityModel.find({}, function (err, opps) {
        for (let i = 0; i < opps.length; i++) {
            opps[i]["messages"] = {
                "accept": 'Hi {studentFirstName}, \nI am pleased to inform you that our lab will accept you for the opportunity "{opportunityTitle}". Please email me at {yourEmail} to find out more about when you will start. \n\nSincerely, \n{yourFirstName} {yourLastName}',
                "reject": 'Hi {studentFirstName}, \nI regret to inform you that our lab will not be able to accept you for the ' +
                ' "{opportunityTitle}" position this time. Please consider applying in the future. \n\nRespectfully, ' +
                '\n{yourFirstName} {yourLastName}”.',
                "interview": 'Hi {studentFirstName}, \nWe reviewed your application and would love to learn more about you. Please email {yourEmail} with times in the next seven days that work for you for an interview regarding the opportunity "{opportunityTitle}". \n\nSincerely, \n{yourFirstName} {yourLastName}'
            };
            opps[i].save(function (err) {
                debug(err);
            });
        }
    });
    res.end();
});

app.get("/hasRegistered/:netId", function (req, res) {
    undergradModel.findOne({netId: req.params.netId}, function (err, undergrad) {
        if (undergrad !== null) return res.send(true);
        labAdministratorModel.findOne({netId: req.params.netId}, function (err, labAdmin) {
            return res.send(labAdmin !== null);
        })
    })
});

/**
 * Returns the role associated with that net id
 * Can either be undergrad, none, or one of the various lab administrator roles
 */
app.get("/role/:netId", function (req, res) {
    undergradModel.findOne({netId: req.params.netId}, function (err, undergrad) {
        if (undergrad !== null) return res.send("undergrad");
        labAdministratorModel.findOne({netId: req.params.netId}, function (err, labAdmin) {
            if (labAdmin === null) return res.send("none");
            res.send(labAdmin.role);
        })
    })
});

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com");


app.get("/verify/:token", function (req, res){
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.params.token,
            audience: "938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log('before');
        console.log(userid);
        console.log(payload);
        console.log('after');

        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
    verify().catch(console.error);
});

module.exports = app;
