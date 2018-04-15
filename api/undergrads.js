let express = require('express');
let app = express.Router();
let {undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, decryptGoogleToken, mongoose} = require('../common.js');

app.get('/:netId', function (req, res) {
    undergradModel.find({netId: req.params.netId}, function (err, undergrad) {
        if (err) {
            return err;
        }
        debug(undergrad.netId);

        res.send(undergrad);
    });
});

//previously POST /createUndergrad
app.post('/', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data.firstName);
    console.log(data.lastName);
    console.log(data.gradYear);
    console.log(data.major);
    console.log(data.GPA);
    console.log(data.netid);
    console.log(data.courses);
    console.log("This be the resume");
    var undergrad = new undergradModel({

        firstName: data.firstName,
        lastName: data.lastName,
        gradYear: data.gradYear,    //number
        major: data.major,
        gpa: data.GPA,
        netId: data.netid,
        courses: data.courses
    });
    debug(undergrad);
    undergrad.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            debug(err);
            console.log("eror in saving ugrad");
            console.log(err);
        } //Handle this error however you see fit
        else {
            console.log('saved');
            res.send("success!");
        }
        // Now the opportunity is saved in the commonApp collection on mlab!
    });
});

app.put('/:id', function (req, res) {
    let id = req.params.id;
    undergradModel.findById(id, function (err, undergrad) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            undergrad.firstName = req.body.firstName || undergrad.firstName;
            undergrad.lastName = req.body.lastName || undergrad.lastName;
            undergrad.gradYear = req.body.gradYear || undergrad.gradYear;
            undergrad.major = req.body.major || undergrad.major;
            undergrad.gpa = req.body.gpa || undergrad.gpa;
            undergrad.netID = req.body.netid || undergrad.netId;
            undergrad.resume = req.body.resume || undergrad.resume;


            // Save the updated document back to the database
            undergrad.save((err, todo) => {
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
    undergradModel.findByIdAndRemove(id, function (err, undergrad) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Undergrad successfully deleted",
            id: id
        };
        res.status(200).send(response);


    });
});



module.exports = app;
