// Require objects.
var express = require('express');
var app = express();
var aws = require('aws-sdk');


// Load your AWS credentials and try to instantiate the object.
aws.config.loadFromPath('./config/config.json');

// Instantiate SQS.
const sqs = new aws.SQS();

module.exports = sqs;

// Start server.
const sqs_port = 5000;

app.listen(sqs_port, function () {
  console.log(`AWS SQS example app listening on port ${sqs_port}`);
});

// How can I create queue just once? //

  // module.exports.sendUserSearchEvent = (req) => {
  //   let { user_uuid, search_date, query } = req.params;
  //   let userSearch = {
  //     user_uuid: user_uuid,
  //     search_date: search_date,
  //     query: query,
  //   };

  //   let sqsParams = {
  //     MessageBody: JSON.stringify(userSearch),
  //     QueueUrl: queueURL,
  //   };

  //   sqs.sendMessage(sqsParams, (err, data) => {
  //     if (err) {
  //       console.log('ERROR: SQS MESSAGE SEND: ', err);
  //     } else {
  //       console.log('SUCCESS: SQS MESSAGE SEND: ', data);
  //     }
  //   });
  // };

  // module.exports.createQueue = (queueName) => {
  //   let params = {
  //     QueueName: queueName
  //   };

  //   sqs.createQueue(params, (err, data) => {
  //     if (err) {
  //       console.log('ERROR: SQS MESSAGE SEND: ', err);
  //     } else {
  //       console.log('SUCCESS: SQS MESSAGE SEND: ', data);
  //     }
  //   });
  // };
