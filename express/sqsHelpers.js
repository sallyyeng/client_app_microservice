const express = require('express');
const app = express();
const aws = require('aws-sdk');


// Instantiate SQS
const sqs = new aws.SQS();
