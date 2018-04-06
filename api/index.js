let express = require('express');
let app = express.Router();

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = app;
