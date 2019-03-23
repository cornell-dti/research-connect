const express = require('express');

const app = express.Router();
const {
  undergradModel, labAdministratorModel, opportunityModel, labModel, debug, replaceAll, sgMail, verify, mongoose,
  handleVerifyError, sgOppsGroup,
} = require('../common.js');
const common = require('../common.js');

// finds lab where lab admin = {adminNetId}, undefined if the id can't be fine in any lab
function findLabWithAdmin(labs, adminNetId) {
  return labs.filter(lab => lab.labAdmins.includes(adminNetId))[0];
}

app.get('/check/:opportunityId', (req, res) => {
  const idToCheck = req.query.netId;
  debug('THIS IS WHERE WE START');

  opportunityModel.findById(req.params.opportunityId, (err, opportunity) => {
    // debug(err);
    debug('callback function is being run');
    // debug(opportunity);
    if (!opportunity) {
      debug('could not find matching opportunity');
      res.send(false);
      return;
    }
    const toSearch = opportunity.applications;
    if (!toSearch) {
      res.send(false);
      return;
    }
    // check if at least one application has the net id of the student we're looking for
    res.send(toSearch.some(
      applicationObj => applicationObj.undergradNetId === idToCheck,
    ));
  });
});

/**
function roleToInt(role) {
  if (role === 'pi') {
    return 6;
  }
  if (role === 'postdoc') {
    return 5;
  }
  if (role === 'staffscientists') {
    return 4;
  }
  if (role === 'labtech') {
    return 3;
  }
  if (role === 'grad') {
    return 2;
  }

  return 1;
}
*/
/**
 function getLabAdmin(oppId) {
  console.log(`The id we are working with is: ${oppId}`);
  labModel.find({ opportunities: mongoose.Types.ObjectId(oppId) }, (err, lab) => {
    if (lab) {
      const admins = [];
      for (let i = 0; i < lab.length; i++) {
        console.log(`This lab is: ${lab[i]}`);
        for (let j = 0; j < lab[i].labAdmins.length; j++) {
          admins.push(lab[i].labAdmins[j]);
        }
      }
      let maximum = '';
      let maxStatus = '';
      for (let i = 0; i < admins.length; i++) {
        // console.log("We are working with netid: "+admins[i]);
        labAdministratorModel.findOne({ netId: admins[i] }, (err2, ad) => {
          if (ad) {
            const r = ad.role;
            if (roleToInt(r) > roleToInt(maxStatus)) {
              maximum = ad.netId;
              maxStatus = r;
            }
            if (i >= admins.length - 1) {
              console.log(`Here maximum is this: ${maximum}`);
              opp.contactName = maximum;
              return maximum;
            }
          }
        });
      }
    } else {
      console.log('We done goofed');
    }
  });
}
 */

// previously POST /getOpportunitiesListing
app.get('/', (req, res) => {
  let sortOrder = req.query.date;
  if (typeof sortOrder === 'string') {
    sortOrder = sortOrder.toLowerCase();
    if (sortOrder === 'asc') {
      sortOrder = 1;
    } else {
      // sortOrder is default descending
      sortOrder = -1;
    }
  } else {
    sortOrder = -1;
  }
  // list courses that are prereqs that can be skipped or are the same
  // make sure no spaces inbetween course letters and numbers
  const coursePrereqs = {
    CS1110: ['CS2110', 'CS2112', 'CS3110'],
    CS1112: ['CS2110', 'CS2112', 'CS3110'],
    CS2110: ['CS2112'],
    CHEM2090: ['CHEM2080'],
  };

  const token = req.query.netId;
  const urlLabId = req.query.labId;
  const sortOrderObj = { opens: sortOrder };
  if (token && token !== 'null') {
    verify(token, (undergradNetId) => {
      debug(`here! ${undergradNetId}`);
      // find the undergrad so we can get their info to determine the "preqreqs match" field
      undergradModel.findOne({ netId: undergradNetId }, (err, undergrad) => {
        const undergrad1 = undergrad;
        // if they're a lab admin, show all the opportunites and set all prereqsMatch to true
        if (undergrad1 === undefined || undergrad1 === null) {
          let timeRange;
          // if there's a lab id in the url, then it's a lab administrator trying to view their own opportunities
          if (urlLabId) {
            timeRange = {};
          } else {
            timeRange = {
              opens: {
                $lte: new Date(),
              },
              closes: {
                $gte: new Date(),
              },
            };
          }
          opportunityModel.find(timeRange)
            .sort(sortOrderObj)
            .exec((err2, opportunities) => {
              for (let i = 0; i < opportunities.length; i++) {
                opportunities[i].prereqsMatch = true;
              }
              // make sure it's not null/undefined/falsy, but express also makes it a string "null" if the value isn't there so we have to check for that
              if (urlLabId && urlLabId !== 'null') {
                debug('2');
                labModel.findById(urlLabId, (err3, lab) => {
                  let oppIdsToOnlyInclude = lab.opportunities;
                  // right now the ids are Object Ids (some mongoose thing) so we have to convert them to strings; it's tricky because if you console.log them when they're objects it'll look just like they're strings!
                  oppIdsToOnlyInclude = oppIdsToOnlyInclude.map(
                    opp => opp.toString(),
                  );
                  // remove all opportunities that don't belong to the lab (i.e. if their id isn't in the lab.opportunities ids list
                  opportunities = opportunities.filter(
                    opp => oppIdsToOnlyInclude.includes(
                      opp._id.toString(),
                    ),
                  );
                  return res.send(opportunities);
                });
              } else {
                return res.send(opportunities);
              }
              return null;
            });
        } else {
          undergrad1.courses = undergrad1.courses.map(
            course => replaceAll(course, ' ', ''),
          );
          // only get the ones that are currenlty open
          opportunityModel.find({
            opens: {
              $lte: new Date(),
            },
            closes: {
              $gte: new Date(),
            },
          }).sort(sortOrderObj).lean().exec((err2, opportunities) => {
            if (!opportunities) {
              return res.send({});
            }
            let labs = [];
            // get all the labs so you have the info to update
            labModel.find({}, (labErr, labs2) => {
              labs = labs2;
              for (let i = 0; i < opportunities.length; i++) {
                let prereqsMatch = false;
                opportunities[i].requiredClasses = opportunities[i].requiredClasses.map(
                  course => replaceAll(course, ' ', ''),
                );
                // checks for gpa, major, and gradYear
                if (opportunities[i].minGPA <= undergrad1.gpa
                    && opportunities[i].requiredClasses.every((val) => {
                      // Check for synonymous courses, or courses where you can skip the prereqs

                      if (!undergrad1.courses.includes(val)) {
                        const courseSubs = coursePrereqs[val];
                        if (courseSubs !== undefined) {
                          return undergrad1.courses.some(
                            course => courseSubs.includes(course),
                          );
                        }
                        return false;
                      }
                      return true; // if it's contained in the undergrad1 courses straight off the bat
                    })
                    && opportunities[i].yearsAllowed.includes(
                      common.gradYearToString(undergrad1.gradYear),
                    )) {
                  prereqsMatch = true;
                }
                let thisLab = findLabWithAdmin(labs,
                  opportunities[i].creatorNetId);
                // prevent "undefined" values if there's some error
                if (thisLab === undefined) {
                  thisLab = {
                    name: '',
                    labPage: '',
                    labDescription: '',
                  };
                }
                opportunities[i].prereqsMatch = prereqsMatch;
                opportunities[i].labName = thisLab.name;
                opportunities[i].labPage = thisLab.labPage;
                opportunities[i].labDescription = thisLab.labDescription;
                /**
                 if (opportunities[i].contactName === 'dummy value') {
                  console.log('In here');
                  // var contact = getLabAdmin(opportunities[i]._id,opportunities[i]);

                  // var contact = getLabAdmin();
                  // opportunities[i]["contactName"] = contact;
                  const oppId = opportunities[i]._id;
                  labModel.find({ opportunities: mongoose.Types.ObjectId(oppId) }, (err3, lab) => {
                    if (lab) {
                      debug('The lab is not null');
                      const admins = [];
                      lab.forEach((oneLab) => {
                      // for (let i = 0; i < lab.length; i++) {
                        debug(`This lab is: ${oneLab}`);
                        oneLab.labAdmins.forEach((labAdmin) => {
                        // for (let j = 0; j < oneLab.labAdmins.length; j++) {
                          admins.push(labAdmin);
                        });
                      });

                      let maximum = '';
                      let maxStatus = '';
                      admins.forEach((admin) => {
                      // for (let i = 0; i < admins.length; i++) {
                        // console.log("We are working with netid: "+admins[i]);
                        labAdministratorModel.findOne({ netId: admin }, (err4, ad) => {
                          if (ad) {
                            debug('Ad is not null');
                            const r = ad.role;
                            if (roleToInt(r) > roleToInt(maxStatus)) {
                              maximum = ad.netId;
                              maxStatus = r;
                            }
                            if (i >= admins.length - 1) {
                              debug(`Here maximum is this: ${maximum}`);
                              opportunities[i].contactName = maximum;
                            }
                          }
                        });
                      });
                    } else {
                      debug('We done goofed');
                    }
                  });
                } else {
                  debug('Contact names are already in');
                }
                debug(`Here is the contactName: ${opportunities[i].contactName}`);
                debug(`Here is the additional info: ${opportunities[i].additionalInformation}`);
                 */
              }
              res.send(opportunities);
            });
            if (opportunities) {
              for (let i = 0; i < opportunities.length; i++) {
                // debug(opportunities[i].prereqsMatch);
              }
              if (err) {
                // handle the error appropriately
                res.send(err);
              }
            }
            return null;
          });
        }
      });
    }).catch((error) => {
      handleVerifyError(error, res);
    });
  } else {
    opportunityModel.find({
      opens: {
        $lte: new Date(),
      },
      closes: {
        $gte: new Date(),
      },
    }).sort(sortOrderObj).exec((err, opportunities) => {
      for (let i = 0; i < opportunities.length; i++) {
        opportunities[i].prereqsMatch = true;
      }
      res.send(opportunities);
    });
  }
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUniqueTitle(title, supervisor) {
  return new Promise(((resolve) => {
    const regexTitle = `^${title}$`; // https://stackoverflow.com/a/36916270
    // see if there is any opportunity with this title, case insentitive
    opportunityModel.find({ title: { $regex: regexTitle, $options: 'i' } }, 'title',
      (err, otherTitles) => {
        if (err) {
          debug('error in get unique title');
          debug(err);
          // if there's an error, just append a random integer
          resolve(`${title} (${getRandomInt(1, 15)})`);
        }
        if (otherTitles.length === 0) {
          resolve(title);
        }
        let newTitle;
        if (!supervisor) {
          newTitle = `${title}`;
        } else {
          newTitle = `${title} - ${supervisor}`;
        }
        // find all opps that have the title that case insensitive starts with: title + supervisor
        // if there's an opp called "intern (john smith) 2", then this will match the intern (john smith) and we'll add the 3 after it
        debug(`new title so far: ${newTitle}`);
        opportunityModel.find(
          { title: { $regex: `^${newTitle}`, $options: 'i' } }, 'title',
          (err2, otherTitles2) => {
            debug(`other titles found: ${otherTitles2}`);
            if (err2) {
              debug(err2);
            }
            if (otherTitles2.length === 0) {
              resolve(newTitle);
            }
            const nextNum = otherTitles2.length + 1;
            resolve(`${newTitle} ${nextNum}`);
          },
        );
      });
  }));
}

app.post('/', async (req, res, next) => {
  // TODO test what next() does, create middleware from https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016 ?
  try {
    // req is json containing the stuff that was sent if there was anything
    const data = req.body;
    debug(data);
    // TODO don't make startSeason and startYear required, say "leave blank for ASAP", update that in the back-end
    // REQUIRED FIELDS:
    if (!data
        || !data.email
        || !data.title
        || !data.undergradTasks
        || !data.startSeason
        || !data.startYear
        || !data.supervisor
    ) {
      return res.status(400).send();
    }

    debug(`email: ${data.email}`);
    debug(`netid: ${data.creatorNetId}`);
    debug(`labpage: ${data.labPage}`);
    debug(`title: ${data.title}`);
    debug(`projDesc: ${data.projectDescription}`);
    debug(`undergradTasks: ${data.undergradTasks}`);
    debug(`qualifs: ${data.qualifications}`);
    debug(`supervisor: ${data.supervisor}`);
    debug(`startSeason: ${data.startSeason}`);
    debug(`startYear: ${data.startYear}`);
    debug(`apps: ${data.applications}`);
    debug(`yearsAllowed: ${data.yearsAllowed}`);
    debug(`majorsAllowed: ${data.majorsAllowed}`);
    // debug(`question 1: ${JSON.parse(JSON.stringify(data.questions)).q0}`);
    // debug(`question 2: ${JSON.parse(JSON.stringify(data.questions)).q1}`);
    debug(`requiredClasses: ${data.requiredClasses}`);
    debug(`minGPA: ${data.minGPA}`);
    debug(`minHours: ${data.minHours}`);
    debug(`maxHours: ${data.maxHours}`);
    debug(`additionalInformation: ${data.additionalInformation}`);
    debug(`opens: ${data.opens}`);
    debug(`closes: ${data.closes}`);
    debug(`areas: ${data.areas}`);
    let maxHours;
    data.minHours = parseInt(data.minHours, 10);
    data.minHours = Number(data.minHours);
    if (Number.isNaN(data.minHours)) {
      data.minHours = 0;
    }
    if (data.maxHours) {
      // eslint-disable-next-line prefer-destructuring
      maxHours = data.maxHours;
    } else {
      maxHours = 0;
    }
    if (maxHours < data.minHours) {
      data.minHours = 0;
      maxHours = 10;
    }

    if (data.yearsAllowed && data.yearsAllowed.length === 0) {
      data.yearsAllowed = ['freshman', 'sophomore', 'junior', 'senior'];
    }
    // BEGIN CLEAN UP QUESTIONS FIELD
    if (data.questions) {
      Object.keys(data.questions).forEach((key) => {
        // if they added a question but then clicked the x then there would be q1 : null/undefined
        if (!data.questions[key]) {
          delete data.questions.key;
        }
      });
    } else {
      data.questions = {};
    }
    // END CLEAN UP QUESTIONS FIELD
    // if the compensation array is empty, then that means they don't have any compensation
    if (data.compensation === undefined || data.compensation.length === 0) {
      debug('2.5');
      data.compensation = ['none'];
    }
    data.questions.coverLetter = 'Cover Letter: Describe why you\'re interested in this lab/position in particular, '
        + 'as well as how any qualifications you have will help you excel in this lab. Please be concise.';
    if (data.areas) {
      data.areas = data.areas.map((element) => {
        const trimmed = element.trim();
        if (trimmed) {
          return trimmed;
        }
        return null;
      });
    }
    if (data.requiredClasses) {
      data.requiredClasses = data.requiredClasses.map((element) => {
        const trimmed = element.trim();
        if (trimmed) {
          return trimmed;
        }
        return null;
      });
    }

    const token = data.creatorNetId;
    // notice how we "thunk" (to use 3110 language) getUniqueTitle so we can get the promise it returns and await it to get its value
    const newTitle = await getUniqueTitle(data.title, data.supervisor);
    console.log(`new title: ${newTitle}`);
    verify(token, (netIdActual) => {
      let ghostPost = false;
      let ghostEmail = '';
      let ghostName = '';
      // if they made a "quick post" without an account
      if (netIdActual === null) {
        /** If there's no net id, then make it a "ghost post":
         * https://cornelldti.slab.com/posts/ghost-posts-publishing-opportunities-gathered-externally-100ca828
         * For this we need a lab admin who this post will fall under...
         * here we just use the account for acb352, but it can be anybody
         */
        netIdActual = 'acb352';
        ghostPost = true;
        ghostEmail = data.email;
        ghostName = data.supervisor;
      }
      const opportunity = new opportunityModel({
        creatorNetId: netIdActual,
        labPage: data.labPage,
        title: newTitle,
        projectDescription: data.projectDescription,
        undergradTasks: data.undergradTasks,
        qualifications: data.qualifications,
        compensation: data.compensation,
        supervisor: data.supervisor,
        // spots: data.spots,
        startSeason: data.startSeason,
        startYear: data.startYear,
        applications: data.applications, // missing
        yearsAllowed: data.yearsAllowed,
        majorsAllowed: data.majorsAllowed, // missing
        questions: data.questions,
        requiredClasses: data.requiredClasses,
        minGPA: data.minGPA,
        minHours: data.minHours,
        maxHours,
        additionalInformation: data.additionalInformation,
        opens: data.opens,
        closes: data.closes,
        areas: data.areas,
        ghostPost,
        ghostEmail,
        ghostName,
        datePosted: (new Date()).toISOString(),
      });
      opportunity.save((err, response) => {
        if (err) {
          debug(err);
          res.status(500).send({ errors: err.errors });
          return;
        }
        const oppId = response.id;
        labModel.findOne(
          { labAdmins: netIdActual },
          (error, lab) => {
            if (lab && lab.opportunities) {
              const opps = lab.opportunities;
              opps.push(mongoose.Types.ObjectId(oppId));
              lab.opportunities = opps;
              lab.markModified('opportunities');
              lab.save(() => {
              });
            }
          },
        );
        // const opportunityMajor = req.body.majorsAllowed;
        undergradModel.find({},
          (err2, studentsWhoMatch) => {
          debug("students who match");
            // studentsWhoMatch = [studentsWhoMatch[0]]; // just FOR TESTING
            Object.keys(studentsWhoMatch).forEach((undergrad1) => {
              const { firstName } = studentsWhoMatch[undergrad1];
              // to: `${studentsWhoMatch[undergrad1].netId}@cornell.edu`,
              debug("in email message!");
              const msg = {
                to: `${studentsWhoMatch[undergrad1].netId}@cornell.edu`,
                from: {
                  name: 'Research Connect',
                  email: 'hello@research-connect.com',
                },
                replyTo: 'acb352@cornell.edu',
                asm: {
                  groupId: sgOppsGroup,
                },
                subject: 'New Research Opportunity Available!',
                html: `Hi ${firstName},<br />
                       A new opportunity was just posted in an area you expressed interest in.
                       <br /><b>Title: </b><p>${opportunity.title}</p>
                       <br /><b>Supervisor: </b><p>${opportunity.supervisor}</p>
                       <br /><b>Undergrad Tasks: </b><p>${opportunity.undergradTasks}</p>
                       <br /><p>You can view more details about the opportunity and how to apply at <a href="https://www.research-connect.com/opportunity/${oppId}?ref=email">here!</a> </p>
                       <br /><br />Thanks,
                       <br />The Research Connect Team<br /><br />`,
              };
              debug("sending email now!");

              sgMail.send(msg).catch((e) => {
                console.log('error in sending below');
                console.log(e);
                console.log(e.response.body.errors);
              });
            });
            debug('finished emailling students');
          });
      });
      debug('done with function');
      res.send('Success!');
      // });
    }).catch((error) => {
      debug('verify error');
      debug(error);
      handleVerifyError(error, res);
    });
    return null;
  } catch (e) {
    next(e);
  }
  return null;
});

app.put('/:id', (req, res) => {
  const { id } = req.params;
  opportunityModel.findById(id, (err, opportunity) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.
      opportunity.labPage = req.body.labPage || opportunity.labPage;

      const newTitle = req.body.title;
      const titleChanged = newTitle && newTitle !== opportunity.title;
      const hasApplications = opportunity.applications
          && opportunity.applications.length > 0;
      opportunity.title = newTitle || opportunity.title;
      opportunity.projectDescription = req.body.projectDescription
          || opportunity.projectDescription;
      opportunity.qualifications = req.body.qualifications
          || opportunity.qualifications;
      opportunity.supervisor = req.body.supervisor || opportunity.supervisor;
      // opportunity.spots = req.body.spots || opportunity.spots;
      opportunity.startSeason = req.body.startSeason || opportunity.startSeason;
      opportunity.startYear = req.body.startYear || opportunity.startYear;
      opportunity.applications = req.body.applications
          || opportunity.applications;
      // TODO update skills field of undergrad in opportunity whenever the undergrad updates them
      // each application has a title and skills field (among others), so update those when the opportunity is updated.
      if (titleChanged && hasApplications) {
        opportunity.applications.forEach((applicationObj) => {
          applicationObj.opportunity = newTitle;
        });
      }

      opportunity.yearsAllowed = req.body.yearsAllowed
          || opportunity.yearsAllowed;
      opportunity.majorsAllowed = req.body.majorsAllowed
          || opportunity.majorsAllowed;
      opportunity.questions = req.body.questions || opportunity.questions;
      opportunity.requiredClasses = req.body.requiredClasses
          || opportunity.requiredClasses;
      opportunity.minGPA = req.body.minGPA || opportunity.minGPA;
      opportunity.minHours = req.body.minHours || opportunity.minHours;
      opportunity.maxHours = req.body.maxHours || opportunity.maxHours;
      opportunity.additionalInformation = req.body.additionalInformation
          || opportunity.additionalInformation;
      opportunity.opens = req.body.opens || opportunity.opens;
      opportunity.closes = req.body.closes || opportunity.closes;
      opportunity.areas = req.body.areas || opportunity.areas;

      opportunity.markModified('messages');
      opportunity.markModified('applications');
      opportunity.markModified('questions');

      // Save the updated document back to the database
      opportunity.save((err2, todo) => {
        if (err2) {
          res.status(500).send(err2);
        }
        res.status(200).send(todo);
      });
    }
  });
});
app.get('/search', (req, res) => {
  debug(req.query.search);
  opportunityModel.find({ $text: { $search: req.query.search } }, '_id',
    (err, search) => {
      if (err) {
        debug(err);
        res.send(err);
      } else {
        if (search === null) {
          res.send('Search not found :(');
        }
        debug(search);
        res.send(search);
      }
    });
});
app.delete('/:id', (req, res) => {
  const { id } = req.params;

  opportunityModel.findByIdAndRemove(id, () => {
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    const response = {
      message: 'Opportunity successfully deleted',
      id,
    };
    res.status(200).send(response);
  });
});

function processOpportunity(tokenNetId, oppId, res) {
  debug(`toke net id: ${tokenNetId}`);
  opportunityModel.findById(oppId).lean().exec((err, opportunity) => {
    if (err) {
      debug(err);
      res.send(err);
    }
    if (!opportunity) {
      return res.send('');
    }
    // get all labs, then find the lab that has an opportunity equal to this opportunity's id
    // TODO convert this into a mongoose query if possible
    labModel.find({}, (err2, labs) => {
      if (err2) {
        debug(err);
        return res.send(err);
      }
      let labAdmins = [];
      labs.forEach((currentLab) => {
        currentLab.opportunities.forEach((thisOpportunity) => {
          if (thisOpportunity.toString() === oppId) {
            opportunity.labPage = currentLab.labPage;
            opportunity.labDescription = currentLab.labDescription;
            opportunity.labName = currentLab.name;
            // eslint-disable-next-line prefer-destructuring
            labAdmins = currentLab.labAdmins;
          }
        });
      });
      // get the info of one of the lab admins
      // TODO change the array of positions to reference a constants file
      labAdministratorModel.findOne(
        {
          $and: [
            { netId: { $in: labAdmins } },
            {
              role: {
                $in: [
                  'pi',
                  'postdoc',
                  'grad',
                  'staffscientist',
                  'labtech'],
              },
            },
          ],
        },

        /*
             in this section, we attach the info of the student who requested this. This is used to fill in the
             qualifications section (I think) on the front-end. This should probably only happen if there is
             some query parameter, but we never got around to doing that. TODO
             */
        (err3, labAdmin) => {
          if (!labAdmin) {
            opportunity.pi = 'No lab members found';
          } else {
            // TODO how do we know this is the PI? I think ".pi" may be a misleading name.
            opportunity.pi = `${labAdmin.firstName} ${labAdmin.lastName}`;
          }
          undergradModel.findOne({ netId: tokenNetId }, (error3, student) => {
            if (student === undefined) {
              opportunity.student = {
                firstName: 'John',
                lastName: 'Smith',
                gradYear: (new Date()).getFullYear() + 1,
                major: 'Computer Science',
                gpa: 4.3,
                netId: 'rsn55',
                courses: [
                  'CS 1110',
                  'INFO 4998',
                  'CS 3110',
                ],
                skills: [
                  'HTML',
                ],
              };
            } else {
              opportunity.student = student;
            }
            res.send(opportunity);
          });
        },
      );
      return null;
    });
    return null;
  });
}

// previous POST /getOpportunity
// gets the opportunity given its object id
app.get('/:id', (req, res) => {
  if (!req.params || !req.params.id || req.params.id === 'null') {
    return res.send({});
  }
  const { id } = req.params;
  // if no net id
  if (!req.query || !req.query.netId || req.query.netId === 'null') {
    processOpportunity(null, id, res);
    return null;
  }
  debug(`token: ${req.query.netId}`);
  debug(`id: ${req.params.id}`);
  verify(req.query.netId, (tokenNetId) => {
    processOpportunity(tokenNetId, id, res);
  }).catch((error) => {
    handleVerifyError(error, res);
  });
  return null;
});

module.exports = app;
