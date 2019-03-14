const express = require('express');

const app = express.Router();
const {
  facultyModel, debug, verify, handleVerifyError, undergradModel, sgMail,
} = require('../common.js');


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/** gets all the faculty in the database.
 * @param ?department=tech means only return CS or ECE professors (I would include Info Sci but we don't have info on them yet...)
 * @param limit users can specify to only return x number of results by appending ?limit=x at the end of their query. i.e. GET /api/faculty?limit=10
 * @param skip users can also specify to skip x number of results. Default is 0. i.e. GET /api/faculty?limit=10&skip=20
 * @param area. shows only faculty in that area. returns all if falsy.
 * @param search. text to search by
 * @return array of faculty members
 */
app.get('/', (req, res) => {
  let { department, skip, limit, area, search } = req.query;
  // if they didn't make skip a number or just didn't specify it, make it 0.
  if (Number.isNaN(Number(skip)) || !skip) {
    skip = 0;
  } else { // the query things are always strings, and mongoose requires a number
    skip = parseInt(skip, 10);
  }
  if (!Number.isNaN(Number(limit))) {
    limit = parseInt(limit, 10);
  } else {
    limit = 0;
  }
  let facultyFilter = {};
  if (department === "tech") {
    facultyFilter = {
      department: {$in: ["Computer Science"]}
    }
  }
  if (area) {
    facultyFilter["researchInterests"] = {$in: [area]}
  }
  if (search) {
    facultyFilter["$text"] = {$search: search};
  }
  facultyModel.find(facultyFilter)
    .skip(skip)
    .limit(parseInt(limit, 10))
    .sort({ name: 'ascending' }) // https://mongoosejs.com/docs/api.html#query_Query-sort (it's hard to find)
    .exec((err, faculty) => {
      let allAreas = [];
      if (err) {
        return res.status(500).send(err);
      }
      /** BEGIN code to print out all unique facutly researchInterests
      faculty.forEach((fac) =>{
        if (fac){
          const interests = fac.researchInterests;
          if (interests){
            allAreas.push(...interests);
          }
        }
      });
      console.log("All areas!");
      console.log(allAreas.length);
      allAreas = allAreas.filter( onlyUnique );
      console.log(allAreas.length);
      console.log(allAreas);
       * END CODE TO PRINT OUT ALL UNIQUE researchInterests (for testing)
       */
      return res.send(faculty);
    });

});

/** Searches the database for whatever the user has in their query string
 * DO NOT REORDER: this endpoint MUST be "above app.get('/:id'..." below. Why? Because when someone sends a request to
 * the back-end, express moves sequentially down these endpoints and stops at the first match. If /:id was above this
 * endpoint, something like /api/faculty/search?search="abc" would be triggered first by /:id since express thinks that
 * "search" is the id that you want to use for that endpoint (since :id is a wildcard operator, meaning that ":id"
 * can be anything, even the term "search"). So if we put /search first, then our desired /ap/faculty/search requests
 * will get triggered here.
 * @requires a query string called "search". so /api/faculty/search?search="my search term"
 * @return array of 0 elements if no search is specified, matching profs if search term is specified
 */
app.get('/search', (req, res) => {
  debug(req.query.search);
  let searchQuery = { $text: { $search: req.query.search } };
  // if req.query.search is empty string or undefined (falsy) then just send back all faculty
  if (!req.query.search) {
    // when you don't specify any criteria, mongo returns everything
    searchQuery = {};
  }
  facultyModel.find(searchQuery, (err, search) => {
    if (err) {
      // //if the error code name is "TypeMismatch" then req.query.search was null so just send back an empty array
      // if (err.codeName === "TypeMismatch"){
      //     res.status(200).send([]);
      // }
      debug(err);
      res.send(err);
    } else {
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
app.get('/:id', (req, res) => {
  facultyModel.findById(req.params.id, (err, faculty) => {
    if (err) {
      if (err.name === 'CastError') {
        return res.status(400).send('No faculty could be found with that id.');
      }
      return res.status(500).send(err);
    }
    return res.send(faculty);
  });
});

/**
app.post('/', (req, res) => {
  const data = req.body;
  // TODO
});

app.put('/:id', (req, res) => {
  const id = req.params.id;
  // TODO
});

 */

app.delete('/:id', (req, res) => {
  const { id } = req.params;

  facultyModel.findByIdAndRemove(id, () => {
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    const response = {
      message: 'Lab admin successfully deleted',
      id,
    };
    res.status(200).send(response);
  });
});

/**
 * Sends an email to the professor on behalf of the student at an ideal time
 * req.body = {
 *   email: string of html for email,
 *   profEmail: string of professor's email to send to,
 *   userToken: string of the user's google token, have to run it through
 *   the verify function in utils to get the email
 * }
 */
app.post('/email', (req, res) => {
  const { emailHtml, profEmail, userToken } = req.body;
  verify(userToken, (netId) => {
    if (!netId) {
      return res.status(500).send('No account found.');
    }

    undergradModel.findOneAndUpdate({ netId }, { $set: { emailHtml } }, {}, (err, undergrad) => {
      if (err || !undergrad) {
        // if here, somehow they submitted an email without having an account
        return res.status(500).send(err);
      }
      debug(profEmail);
      const userEmail = `${netId}@cornell.edu`;
      const msg = {
        to: 'abagh0703@gmail.com',
        from: {
          name: `${undergrad.firstName} ${undergrad.lastName}`,
          email: userEmail,
        },
        replyTo: userEmail,
        subject: 'Interest in Your Research',
        html: emailHtml,
        trackingSettings: {
          clickTracking: {
            enable: true,
          },
          openTracking: {
            enable: true,
          },
          subscriptionTracking: {
            enable: false,
          },
        },
      };
      sgMail.send(msg).then(() => res.end()).catch((err2) => {
        if (err2) {
          debug(err2);
          return res.status(500).send(err2);
        }
      });
    });
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

module.exports = app;
