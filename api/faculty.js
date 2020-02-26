const express = require('express');

const app = express.Router();
const https = require('https');
const {
  facultyModel, debug, verify, handleVerifyError, undergradModel, sgMail,
} = require('../common.js');

/**
 * For the current iteration, we only want CS Professors not at Cornell Tech.
 * However, the database still has those professors in it. So we need to filter
 * whenever we query. We're keeping them in the db in case we need them one day.
 */
function getBaseFacultyFilter() {
  return {
    department: {
      $in: [
        'Computer Science',
      ],
    },
    office: {
      $regex: '^((?!Cornell Tech).)*$',
    },
    title: {
      $regex: '^((?!PhD Student).)*$',
    },
  };
}

/** gets all the faculty in the database.
 * @param limit users can specify to only return x number of results by appending ?limit=x at the end of their query. i.e. GET /api/faculty?limit=10
 * @param skip users can also specify to skip x number of results. Default is 0. i.e. GET /api/faculty?limit=10&skip=20
 * @param area. shows only faculty in that area. returns all if falsy.
 * @param search. text to search by
 * @return array of faculty members
 */
app.get('/', (req, res) => {
  let { skip, limit } = req.query;
  const { area, search } = req.query;
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
  const facultyFilter = getBaseFacultyFilter();
  if (area) {
    facultyFilter.researchInterests = { $in: [area.trim()] };
  }
  if (search) {
    facultyFilter.$text = { $search: search };
  }
  facultyModel.find(facultyFilter)
    .skip(skip)
    .limit(parseInt(limit, 10))
    .sort({ name: 'ascending' }) // https://mongoosejs.com/docs/api.html#query_Query-sort (it's hard to find)
    .exec((err, faculty) => {
      const allAreas = [];
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
  let searchQuery = getBaseFacultyFilter();
  searchQuery.$text = { $search: req.query.search };
  // if req.query.search is empty string or undefined (falsy) then just send back all faculty
  if (!req.query.search) {
    // when you don't specify any criteria, mongo returns everything
    searchQuery = getBaseFacultyFilter();
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
 * Returns random int between lowerBound inclusive and upperBound exclusive
 * @param lowerBound
 * @param upperBound
 */
function getRandomInt(lowerBound, upperBound) {
  return Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound;
}

/**
 * Returns date with random optimal time between 8 and 10
 * @param date; the date to set the hours and minutes for
 */
function setOptimalHoursMins(date) {
  // GMT is ahead of EST by 4 hours.
  const gmtOffset = 4;
  date.setHours(getRandomInt(8 + gmtOffset, 10 + gmtOffset));
  date.setMinutes(getRandomInt(0, 60));
  return date;
}

/**
 * Returns the ideal time in unix time to send an email in the morning following these rules
 * (WD = weekday)
 * -if sat or sun, send mon using setOptimalHoursMins
 * if WD
 *  -if before 8am, send at 8am later that day using setOptimalHoursMins
 *  -if between 8 and 10, send now
 *  -if MTWTh and after 10am, send next day using setOptimalHoursMins
 *  -if Friday after 10am, send monday using setOptimalHoursMins
 */
function calculateSendTime() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = sunday 6 = saturday
  let timeToSend = new Date();
  let increment = 0;
  const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
  const currentHour = now.getHours();
  let timezoneDiff = 0;
  // If the host machine isn't in EST...
  if (now.getTimezoneOffset() !== 240) {
    // timezoneDiff = hours ahead that the host machine is of EST
    timezoneDiff = Math.floor((240 - now.getTimezoneOffset() / 60));
  }
  const isBefore8am = currentHour < (8 + timezoneDiff);
  const isAfter10am = currentHour > (10 + timezoneDiff);
  let sendNow = false;
  if (!isWeekday) {
    if (dayOfWeek === 0) {
      increment = 1; // Sunday/0
    } else {
      increment = 2; // Saturday/6
    }
  } else if (isBefore8am) {
    // Weekdays
    increment = 0;
  } else if (!isBefore8am && !isAfter10am) {
    // Weekdays
    increment = 0;
    sendNow = true;
  } else if (dayOfWeek !== 5) {
    // Must be past 10am today at this point.
    // if not friday...
    increment = 1;
  } else {
    // Must be past 10am and friday so send on Monday
    increment = 3;
  }

  timeToSend.setDate(now.getDate() + increment); // set to Monday
  if (!sendNow) {
    timeToSend = setOptimalHoursMins(timeToSend);
  } else {
    // add some minutes to current time so we can still use sendLater and not
    // have it be a time in the past if the sendgrid api is slow
    timeToSend.setMinutes(timeToSend.getMinutes() + 5);
  }
  return timeToSend;
}


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
  // poor man's logging, goes to 404 on our site and we can see the bitly count
  https.get('https://bit.ly/2HHdTR1', (resp) => {
  });
  verify(userToken, (netId) => {
    if (!netId) {
      res.status(500).send('No account found.');
      return;
    }

    undergradModel.findOneAndUpdate({ netId }, { $set: { emailHtml } }, {}, (err, undergrad) => {
      if (err || !undergrad) {
        // if here, somehow they submitted an email without having an account
        res.status(500).send(err);
        return;
      }
      const sendTime = calculateSendTime();
      // convert to Unix timestamp in seconds b/c that's what sendgrid requires
      // https://github.com/sendgrid/sendgrid-nodejs/blob/master/packages/mail/USE_CASES.md
      const sendTimeSeconds = Math.floor(+sendTime / 1000);
      const userEmail = `${netId}@cornell.edu`;
      const subjectOptions = ['Interest in Doing Research',
        'Possibility of Conducting Research',
        'Learning More About Your CS Research'];
      const subject = subjectOptions[getRandomInt(0, subjectOptions.length)];
      const msg = {
        to: profEmail, // change to 'abagh0703@gmail.com' when testing, profEmail when not
        from: {
          name: `${undergrad.firstName} ${undergrad.lastName}`,
          email: userEmail,
        },
        bcc: userEmail,
        replyTo: userEmail,
        subject,
        html: emailHtml,
        sendAt: sendTimeSeconds,
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
          res.status(500).send(err2);
        }
      });
    });
  }).catch((error) => {
    handleVerifyError(error, res);
  });
});

module.exports = app;
