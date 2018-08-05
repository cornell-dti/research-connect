let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken, mongoose, verify} = require('../common.js');
let common = require('../common.js');


//previously GET /getlabs
//get all the labs
app.get('/', function (req, res) {
    labModel.find({}, function (err, labs) {
        if (err) {
            res.send(err);
            //handle the error appropriately
            return; //instead of putting an else
        }
        res.send(labs);

    });
});

//get one lab by object id
app.get('/:id', function (req, res) {
    labModel.findById(req.params.id, function (err, lab) {
        if (err) {
            return err;
        }
        res.send(lab);
    });
});

//previously POST /createLab
app.post('/', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    let data = req.body;
    debug(data);

    debug("We are in createLab");
    debug(data.name);
    debug(data.labPage);
    debug(data.labDescription);

    let lab = new labModel({
        name: data.name,
        labPage: data.labPage,
        labDescription: data.labDescription,
        labAdmins: [],
        opportunities: null
    });

    lab.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            debug(err);
        } //Handle this error however you see fit
        else {
            res.send("success!");
        }
    });
});

app.put('/:id', function (req, res) {
    let id = req.params.id;
    labModel.findById(id, function (err, lab) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            lab.name = req.body.name || lab.name;
            lab.labPage = req.body.labPage || lab.labPage;
            lab.labDescription = req.body.labDescription || lab.labDescription;
            lab.labAdmins = req.body.labAdmins || lab.labAdmins;
            lab.opportunities = req.body.opportunities || lab.opportunities;

            // Save the updated document back to the database
            lab.save((err, todo) => {
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

    labModel.findByIdAndRemove(id, function (err, lab) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Lab successfully deleted",
            id: id
        };
        res.status(200).send(response);

    });
});


module.exports = app;
