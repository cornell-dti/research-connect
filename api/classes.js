const express = require('express');

const app = express.Router();
const { classesModel, debug } = require('../common.js');

//* returns (`res.send()`s) all the classes in the following array:
// [{"label": classFull (that's a field in the model), "value": id of that class}, ... and so on for every class]
app.get('/', (req, res) => {
  classesModel.find({}, (err, classes) => {
    if (err) {
      res.send(err);
      return;
    }
    const arr = [];
    for (let i = 0; i < classes.length; i++) {
      const classesObject = classes[i];
      const text = { value: classesObject._id, label: classesObject.classFull };
      arr.push(text);
    }
    res.send(arr);
  });
});

module.exports = app;
