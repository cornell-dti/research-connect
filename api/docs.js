const express = require('express');

const app = express.Router();
const {
  undergradModel, debug, s3, verify, handleVerifyError,
} = require('../common.js');
const common = require('../common.js');

const { BUCKET_NAME } = process.env;


app.get('/:id', (req, res) => {
  /** MLAB STORAGE
     docModel.findById(req.params.id, function(err, document){
        res.send(document.doc)
    })
     */
  const params = {
    Bucket: BUCKET_NAME,
    Key: req.params.id,
  };
  verify(req.query.token, () => {
    s3.getObject(params, (err, data) => {
      if (err) {
        debug('err!');
        debug(err);
        debug(err.stack);
        debug(err, err.stack);
      } else { // an error occurred
        const baseString = Buffer.from(data.Body, 'base64').toString('ascii');
        res.set('content-type', 'text/plain');
        return res.send(baseString);
      }
      return null;
    });
  }).catch(() => {
    res.status(403).send('You are unauthorized to access this document.');
  });
});

function generateId() {
  return (Date.now().toString() + Math.random().toString()).replace('.', '');
}

// Only used to store resume and transcript, looks for req.body.resume or req.body.transcript.
app.post('/', (req, res) => {
  debug('reached');
  verify(req.body.token_id, (email) => {
    debug(`email: ${email}`);
    if (email === null) {
      return res.status(412).send('No user found with current session token.');
    }
    debug('net id:');
    const netId = common.getNetIdFromEmail(email);
    debug(netId);
    if (!netId) {
      return res.status(412).send('The email you signed up with does not end in @cornell.edu. Please log out and try again.');
    }
    let { resume } = req.body;
    const docId = generateId();
    // if there's no resume, so add the trasncript
    if (resume === undefined || resume === null) {
      let { transcript } = req.body;
      if (transcript === undefined || transcript === null) {
        res.status(400).send('No files submitted');
      } else {
        [transcript] = transcript;
        /** MLAB STORAGE
                 let transcriptObj = new docModel();
                 transcriptObj.doc = transcript;
                 transcriptObj.save(function(err, document){
                    undergradModel.findOneAndUpdate({"netId": netId}, {transcriptId: document.id}, function(err, oldDoc){
                        debug("trans error: " + err);
                    });
                });
                 */
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: docId,
          ContentEncoding: 'base64',
          ContentType: 'text/plain',
          Body: transcript,
        };
        s3.upload(uploadParams, (err, data) => {
          if (err) {
            debug('Error', err);
          }
          if (data) {
            debug('Upload Success', data.Location);
            res.send('Success!');
          }
        });
        // if this doessn't work, use update operators for the second param: https://docs.mongodb.com/manual/reference/operator/update/
        undergradModel.findOneAndUpdate({ netId }, { $set: { transcriptId: docId } }, (err) => {
          debug(`trans error: ${err}`);
        });
      }
    } else { // resume is defined
      debug('resume uploaded');
      [resume] = resume;
      // debug(resume);
      /** MLAB STORAGE
             let resumeObj = new docModel();
             resumeObj.doc = resume;
             resumeObj.save(function(err, document){
                undergradModel.findOneAndUpdate({"netId": netId}, {resumeId: document.id}, function(err, oldDoc){
                    debug("resume error: " + err);
                });
            });
             */
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: docId,
        ContentEncoding: 'base64',
        ContentType: 'text/plain',
        Body: resume,
      };
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          debug('Error in s3 upload', err);
          debug(err);
          return;
        }
        if (data) {
          debug('Upload Success', data.Location);
          undergradModel.findOneAndUpdate({ netId }, { $set: { resumeId: docId } }, (err2) => {
            debug(`resume error: ${err2}`);
            if (!err2) {
              res.status(200).send();
            } else {
              debug('error in find  one and update');
              debug(err2);
              res.status(500).send(err2);
            }
          });
        }
      });
      debug('gend');
    }
    return null;
  }, true).catch((error) => {
    debug('error in post doc/');
    debug(error);
    if (!handleVerifyError(error, res)) {
      res.status(500).send('Error in submitting your doc. Please try again');
    }
  });
});

module.exports = app;
