// Require objects.
const express = require('express');
const app = express();
const aws = require('aws-sdk');

// Load your AWS credentials and try to instantiate the object.
aws.config.loadFromPath('./config/config.json');

// Instantiate SQS.
const sqs = new aws.SQS();

// Start server.
const sqs_port = 5000;

app.listen(sqs_port, function () {
  console.log(`AWS SQS example app listening on port ${sqs_port}`);
});

module.exports = sqs;

