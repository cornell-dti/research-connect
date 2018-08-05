let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken, mongoose, verify, handleVerifyError} = require('../common.js');
let common = require('../common.js');


//gets the lab admin by their net id
app.get('/:netId', function (req, res) {
    labAdministratorModel.find({netId: req.params.netId}, function (err, labAdmin) {
        if (err) {
            return err;
        }

        res.send(labAdmin);
    });
});

/* In the addLabAdmin endpoint, check to see if the req.body.labId field is null.
 If it is null, then create a lab with labName, labDescription, and labUrl and save it to the database.
 All three should be in req.body. If labId is not null, then just continue with the method as usual.
 */
function createLabAndAdmin(req, res) {
    debug("This means we had to go somewhere else");

    var data = req.body;

    var lab = new labModel({
        name: data.name,
        labPage: data.labPage,
        labDescription: data.labDescription,
        labAdmins: [data.netId],
        pi: data.pi
        // labAdmins and opportunities not needed during lab admin signup. so commented out.
        // labAdmins: data.labAdmins,
        // opportunities: data.opportunities
    });

    lab.save(function (err, labObject) {

        if (err) {
            res.status(500).send({"errors": err.errors});
            debug(err);
        }

        if (data.notifications === undefined || data.notifications === -2){
            //set it to 0 since that means they'll get an email every time someone submits an application
            data.notifications = 0;
        }

        let labAdmin = new labAdministratorModel({
            role: data.role,
            labId: labObject._id,
            netId: data.netId,
            firstName: data.firstName,
            lastName: data.lastName,
            verified: data.verified,
            notifications: data.notifications,
            lastSent: Date.now(),
        });

        labAdmin.save(function (err) {
            if (err) {
                res.status(500).send({"errors": err.errors});
                debug(err);
            }
        });
    });
}

/**
 * Takes data and creates a lab admin assuming they already have a lab id
 * @param data
 * @param res the response
 */
function createLabAdmin(data, res){
    //-2 means they didn't select anything since -2 is the value of the default option on the select menu
    if (data.notifications === undefined || data.notifications === -2){
        //set it to 0 since that means they'll get an email every time someone submits an application
        data.notifications = 0;
    }

    let labAdmin = new labAdministratorModel({
        role: data.role,
        labId: data.labId,
        netId: data.netId,
        firstName: data.firstName,
        lastName: data.lastName,
        notifications: data.notifications,
        lastSent: Date.now(),
        verified: data.verified,
        email: data.email
    });

    labAdmin.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            debug(err);
        } //Handle this error however you see fit
        else {
            labModel.findById(data.labId, function (error, lab) {
                lab.labAdmins.push(data.netId);
                lab.markModified("labAdmins");
                lab.save((err, todo) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    res.status(200).send("success");
                });
            });
        }
        // Now the opportunity is saved in the commonApp collection on mlab!
    });
}

//previously POST /createLabAdmin
app.post('/', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    let data = req.body;
    debug(data);

    debug("we are in createLabAdmin");
    debug(data.role);
    debug(data.labId);
    debug(data.netId);
    debug(data.firstName);
    debug(data.lastName);
    debug(data.verified);
    debug(data.labDescription);

    verify(data.token_id, function(email){
        data.email = email;
        // if labId is null then there is no existing lab and creating new lab
        if (data.labId == null) {
            //check to see if they are creating a new lab or the select just bugged out and didn't add the lab id
            labModel.findOne({name: new RegExp(["^", data.name, "$"].join(""), "i")}, function (err, lab) {
                if (lab === null){
                    createLabAndAdmin(req, res);
                    return res.send("success!");
                }
                else {
                    data.labId = lab._id;
                    //-2 means they didn't select anything since -2 is the value of the default option on the select menu
                    if (data.notifications === undefined || data.notifications === -2){
                        //set it to 0 since that means they'll get an email every time someone submits an application
                        data.notifications = 0;
                    }

                    let labAdmin = new labAdministratorModel({
                        role: data.role,
                        labId: data.labId,
                        netId: data.netId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        notifications: data.notifications,
                        lastSent: Date.now(),
                        verified: data.verified,
                        email: email
                    });

                    labAdmin.save(function (err) {
                        if (err) {
                            res.status(500).send({"errors": err.errors});
                            debug(err);
                        } //Handle this error however you see fit
                        else {
                            labModel.findById(data.labId, function (error, lab) {
                                lab.labAdmins.push(data.netId);
                                lab.markModified("labAdmins");
                                lab.save((err, todo) => {
                                    if (err) {
                                        res.status(500).send(err)
                                    }
                                    res.send("success");
                                });
                            });
                        }
                        // Now the opportunity is saved in the commonApp collection on mlab!
                    });            }
            });
        } else {
            //-2 means they didn't select anything since -2 is the value of the default option on the select menu
            if (data.notifications === undefined || data.notifications === -2){
                //set it to 0 since that means they'll get an email every time someone submits an application
                data.notifications = 0;
            }

            let labAdmin = new labAdministratorModel({
                role: data.role,
                labId: data.labId,
                netId: data.netId,
                firstName: data.firstName,
                lastName: data.lastName,
                notifications: data.notifications,
                lastSent: Date.now(),
                verified: data.verified,
                email: email
            });

            labAdmin.save(function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send({"errors": err.errors});
                } //Handle this error however you see fit
                else {
                    labModel.findById(data.labId, function (error, lab) {
                        lab.labAdmins.push(data.netId);
                        lab.markModified("labAdmins");
                        lab.save((err, todo) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send(err)
                            }
                            res.send("success");
                        });
                    });
                }
                // Now the opportunity is saved in the commonApp collection on mlab!
            });    }
    }, true).catch(function(error){
        handleVerifyError(error,res);
    });

});

app.put('/:id', function (req, res) {
    let id = req.params.id;
    labAdministratorModel.findById(id, function (err, labAdmin) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            labAdmin.role = req.body.role || labAdmin.role;
            labAdmin.labId = req.body.labId || labAdmin.labId;
            labAdmin.netId = req.body.netId || labAdmin.netId;
            labAdmin.firstName = req.body.firstName || labAdmin.firstName;
            labAdmin.lastName = req.body.lastName || labAdmin.lastName;
            labAdmin.verified = req.body.verified || labAdmin.verified;

            // Save the updated document back to the database
            labAdmin.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});

app.delete('/:id', function (req, res) {
    let id = req.params.id;

    labAdministratorModel.findByIdAndRemove(id, function (err, labAdmin) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Lab admin successfully deleted",
            id: id
        };
        res.status(200).send(response);

    });
});


module.exports = app;
