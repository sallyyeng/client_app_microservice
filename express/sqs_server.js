// Require objects.
var express = require('express');
var app = express();
var aws = require('aws-sdk');

// Load your AWS credentials and try to instantiate the object.
aws.config.loadFromPath(__dirname + '/config/config.json');

// Instantiate SQS.
var sqs = new aws.SQS();

// Creating a queue.
app.get('/create', (req, res) => {
  var params = {
    QueueName: 'SearchEventsQueue'
  };

  sqs.createQueue(params, (err, data) => {
    if (err) {
      res.send('CREATE QUEUE ERROR: ', err);
    } else {
      res.send('CREATE QUEUE STATUS: ', data);
    }
  });
});

// Listing our queues.
app.get('/list', function (req, res) {
  sqs.listQueues(function(err, data) {
    if (err) {
      res.send(err);
    } else {
      console.log('data: ', data);
      res.send(data);
    }
  });
});

// // Sending a message.
// // NOTE: Here we need to populate the queue url you want to send to.
// // That variable is indicated at the top of app.js.
// app.get('/send', function (req, res) {
//   var params = {
//     MessageBody: 'Hello world!',
//     QueueUrl: queueUrl,
//     DelaySeconds: 0
//   };

//   sqs.sendMessage(params, function(err, data) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(data);
//     }
//   });
// });

// // Receive a message.
// // NOTE: This is a great long polling example. You would want to perform
// // this action on some sort of job server so that you can process these
// // records. In this example I'm just showing you how to make the call.
// // It will then put the message "in flight" and I won't be able to
// // reach that message again until that visibility timeout is done.
// app.get('/receive', function (req, res) {
//   var params = {
//     QueueUrl: queueUrl,
//     VisibilityTimeout: 600 // 10 min wait time for anyone else to process.
//   };

//   sqs.receiveMessage(params, function(err, data) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(data);
//     }
//   });
// });

// // Deleting a message.
// app.get('/delete', function (req, res) {
//   var params = {
//     QueueUrl: queueUrl,
//     ReceiptHandle: receipt
//   };

//   sqs.deleteMessage(params, function(err, data) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(data);
//     }
//   });
// });

// // Purging the entire queue.
// app.get('/purge', function (req, res) {
//   var params = {
//     QueueUrl: queueUrl
//   };

//   sqs.purgeQueue(params, function(err, data) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(data);
//     }
//   });
// });

// Start server.
const sqs_port = 5000;

app.listen(sqs_port, function () {
  console.log(`AWS SQS example app listening on port ${sqs_port}`);
});
