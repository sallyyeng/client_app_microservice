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

