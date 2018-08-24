let express = require('express');
let app = express.Router();
let {facultyModel, debug, replaceAll, decryptGoogleToken, mongoose, verify, handleVerifyError} = require('../common.js');
let common = require('../common.js');

/** gets all the faculty in the database.
 * @param limit users can specify to only return x number of results by appending ?limit=x at the end of their query. i.e. GET /api/faculty?limit=10
 * @param skip users can also specify to skip x number of results. Default is 0. i.e. GET /api/faculty?limit=10&skip=20
 * @return array of faculty members
 */
app.get('/', function (req, res) {
    let skip = req.query.skip;
    //if they didn't make skip a number or just didn't specify it, make it 0.
    if (isNaN(skip) || !skip){
        skip = 0;
    }
    //the query things are always strings, and mongoose requires a number
    else {
        skip = parseInt(skip);
    }
    debug("skip: " + skip);
    let limit = req.query.limit;
    //if they did specify a limit and it is a number (where "1" and 1 are both numbers. We solve this with parseInt below)
    if (limit && limit !== "null" && !isNaN(limit)) {
        facultyModel.find({})
            .skip(skip)
            .limit(parseInt(limit))
            .sort({name: "ascending"}) //https://mongoosejs.com/docs/api.html#query_Query-sort (it's hard to find)
            .exec(function (err, faculty) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(faculty);
            });
    }
    else {
        facultyModel.find({})
            .skip(skip)
            .sort({name: "ascending"}) //https://mongoosejs.com/docs/api.html#query_Query-sort (it's hard to find)
            .exec(function (err, faculty) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(faculty);
            });
    }
});

/**Searches the database for whatever the user has in their query string
 * DO NOT REORDER: this endpoint MUST be "above app.get('/:id'..." below. Why? Because when someone sends a request to
 * the back-end, express moves sequentially down these endpoints and stops at the first match. If /:id was above this
 * endpoint, something like /api/faculty/search?search="abc" would be triggered first by /:id since express thinks that
 * "search" is the id that you want to use for that endpoint (since :id is a wildcard operator, meaning that ":id"
 * can be anything, even the term "search"). So if we put /search first, then our desired /ap/faculty/search requests
 * will get triggered here.
 * @requires a query string called "search". so /api/faculty/search?search="my search term"
 * @return array of 0 elements if no search is specified, matching profs if search term is specified
 */
app.get('/search', function (req, res) {
    debug(req.query.search);
    let searchQuery = {$text: {$search: req.query.search}};
    //if req.query.search is empty string or undefined (falsy) then just send back all faculty
    if (!req.query.search){
        //when you don't specify any criteria, mongo returns everything
        searchQuery = {};
    }
    facultyModel.find(searchQuery, function (err, search) {
        if (err) {
            // //if the error code name is "TypeMismatch" then req.query.search was null so just send back an empty array
            // if (err.codeName === "TypeMismatch"){
            //     res.status(200).send([]);
            // }
            debug(err);
            res.send(err);
        }
        else {
            if (search === null) {
                res.send([]);
            }
            debug(search);
            res.send(search);
        }
    });
});

/** gets the faculty by their object id. GET /api/faculty/:id
 * @field id is the object id of the faculty member
 * @return one faculty member object
 */
app.get('/:id', function (req, res) {
        facultyModel.findById(req.params.id, function (err, faculty) {
            if (err) {
                if (err.name === "CastError"){
                    return res.status(400).send("No faculty could be found with that id.");
                }
                return res.status(500).send(err);
            }
            res.send(faculty);
        });
});

app.post('/', function (req, res) {
    let data = req.body;
    //TODO
});

app.put('/:id', function (req, res) {
    let id = req.params.id;
    //TODO
});

app.delete('/:id', function (req, res) {
    let id = req.params.id;

    facultyModel.findByIdAndRemove(id, function (err, faculty) {
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
