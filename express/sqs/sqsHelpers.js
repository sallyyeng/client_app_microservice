const sqs = require('./index.js');
const queueURL = 'https://sqs.us-west-1.amazonaws.com/748430602903/SearchEventsQueue';

module.exports.sendUserSearchEvent = (req) => {
  let { user_uuid, search_date, query } = req.params;
  let userSearch = {
    user_uuid: user_uuid,
    search_date: search_date,
    query: query,
  };

  let sqsParams = {
    MessageBody: JSON.stringify(userSearch),
    QueueUrl: queueURL,
  };

  sqs.sendMessage(sqsParams, (err, data) => {
    if (err) {
      console.log('ERROR: SQS MESSAGE SEND: ', err);
    } else {
      console.log('SUCCESS: SQS MESSAGE SEND: ', data);
    }
  });
};

module.exports.createQueue = (queueName) => {
  let params = {
    QueueName: queueName
  };

  sqs.createQueue(params, (err, data) => {
    if (err) {
      console.log('ERROR: SQS MESSAGE SEND: ', err);
    } else {
      console.log('SUCCESS: SQS MESSAGE SEND: ', data);
    }
  });
};
