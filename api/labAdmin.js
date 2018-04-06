let express = require('express');
let app = express.Router();
import {labAdministratorModel, debug} from '../server.js'


//Previously POST /getLabAdmin req.body.id
app.get('/labAdmin/:id', function (req, res) {
    labAdministratorModel.findById(req.params.id, function (err, labAdmin) {
        if (err) {
            return err;
        }
        debug(labAdmin.labId);

        res.send(labAdmin);
    });
});

module.exports = app;
