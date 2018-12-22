const express = require('express');

const app = express.Router();
const {
  labModel, debug,
} = require('../common.js');


// previously GET /getlabs
// get all the labs
app.get('/', (req, res) => {
  labModel.find({}, (err, labs) => {
    if (err) {
      res.send(err);
      // handle the error appropriately
      return; // instead of putting an else
    }
    res.send(labs);
  });
});

// get one lab by object id
app.get('/:id', (req, res) => {
  labModel.findById(req.params.id, (err, lab) => {
    if (err) {
      return err;
    }
    return res.send(lab);
  });
});

// previously POST /createLab
app.post('/', (req, res) => {
  // req is json containing the stuff that was sent if there was anything
  const data = req.body;
  debug(data);

  debug('We are in createLab');
  debug(data.name);
  debug(data.labPage);
  debug(data.labDescription);

  const lab = new labModel({
    name: data.name,
    labPage: data.labPage,
    labDescription: data.labDescription,
    labAdmins: [],
    opportunities: null,
  });

  lab.save((err) => {
    if (err) {
      res.status(500).send({ errors: err.errors });
      debug(err);
    } else { // Handle this error however you see fit
      res.send('success!');
    }
  });
});

app.put('/:id', (req, res) => {
  const { id } = req.params;
  labModel.findById(id, (err, lab) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.
      lab.name = req.body.name || lab.name;
      lab.labPage = req.body.labPage || lab.labPage;
      lab.labDescription = req.body.labDescription || lab.labDescription;
      lab.labAdmins = req.body.labAdmins || lab.labAdmins;
      lab.opportunities = req.body.opportunities || lab.opportunities;

      // Save the updated document back to the database
      lab.save((err2, todo) => {
        if (err2) {
          res.status(500).send(err2);
        }
        res.status(200).send(todo);
      });
    }
  });
});

app.delete('/:id', (req, res) => {
  const { id } = req.params;

  labModel.findByIdAndRemove(id, () => {
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    const response = {
      message: 'Lab successfully deleted',
      id,
    };
    res.status(200).send(response);
  });
});


module.exports = app;
