let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken, mongoose} = require('../common.js');


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
    console.log("This means we had to go somewhere else");

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
            console.log(err);
        }

        let labAdmin = new labAdministratorModel({
            role: data.role,
            labId: labObject._id,
            netId: data.netId,
            firstName: data.firstName,
            lastName: data.lastName,
            verified: data.verified
        });

        labAdmin.save(function (err) {
            if (err) {
                res.status(500).send({"errors": err.errors});
                console.log(err);
            }
        });
    });
}


//previously POST /createLabAdmin
app.post('/', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    debug(data);

    console.log("we are in createLabAdmin");
    console.log(data.role);
    console.log(data.labId);
    console.log(data.netId);
    console.log(data.firstName);
    console.log(data.lastName);
    console.log(data.verified);
    console.log(data.labDescription);


    // if labId is null then there is no existing lab and creating new lab


    if (data.labId == null) {
        createLabAndAdmin(req, res);
        return res.send("success!");
    } else {
        var labAdmin = new labAdministratorModel({
            role: data.role,
            labId: data.labId,
            netId: data.netId,
            firstName: data.firstName,
            lastName: data.lastName,
            verified: data.verified
        });

        labAdmin.save(function (err) {
            if (err) {
                res.status(500).send({"errors": err.errors});
                console.log(err);
            } //Handle this error however you see fit
            else {
                labModel.findById(data.labId, function (error, lab) {
                    lab.labAdmins = lab.labAdmins.push(data.netId);
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
