const sqs = require('./index.js');
const es = require('../database/esHelpers.js');
const searchEventsQueue = 'https://sqs.us-west-1.amazonaws.com/748430602903/SearchEventsQueue';
const newListingsQueue = 'https://sqs.us-west-1.amazonaws.com/748430602903/NewListingsQueue';

// sample response from Inventory //
const sampleNewListingsFromInv = {
  params: [{
    listing_uuid: 5674,
    address: '38 Molly St.',
    city: 'Houston',
    country: 'USA',
    daysAvailable: [01012017, 01022017, 01032017, 01042017],
    price: 300,
    rooms: 2,
    photos: ['www.imgur2.com', 'www.imgur3.com', 'www.imgur4.com'],
    photoAccuracy: 3
  },
  {
    listing_uuid: 3512,
    address: '38 Candy Ave.',
    city: 'Bangkok',
    country: 'Thailand',
    daysAvailable: [02012017, 02022017, 03032017, 04042017],
    price: 321,
    rooms: 3,
    photos: ['www.imgur2.com', 'www.imgur3.com', 'www.imgur4.com'],
    photoAccuracy: 4
  },
  {
    listing_uuid: 5635574,
    address: '38 Monner Ave.',
    city: 'Taipei',
    country: 'Taiwan',
    daysAvailable: [02012017, 02022017, 03032017, 04042017],
    price: 500,
    rooms: 1,
    photos: ['www.imgur2.com', 'www.imgur3.com', 'www.imgur4.com'],
    photoAccuracy: 4
  }]
};

// refactor later for sending batched messages //
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

module.exports.sendUserSearchEvent = (req) => {
  let { user_uuid, search_date, query } = req.query;
  let userSearch = {
    user_uuid: user_uuid,
    search_date: search_date,
    query: query,
  };

  let sqsParams = {
    MessageBody: JSON.stringify(userSearch),
    QueueUrl: searchEventsQueue,
  };

  sqs.sendMessage(sqsParams, (err, data) => {
    if (err) {
      console.log('User Search ERROR: SQS MESSAGE SEND: ', err);
    } else {
      console.log('User Search SUCCESS: SQS MESSAGE SEND: ', data);
    }
  });
};

// may not be necessary because you're not receiving anything from Events?
module.exports.pollUserSearchQueue = (req) => {
  let params = {
    QueueUrl: searchEventsQueue,
    VisibilityTimeout: 600 // 10 min wait time for anyone else to process.
  };

  return sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('error in poll from user search queue');
    } else {
      // return the message back to endpoint handler
      return data;
    }
  });
};

module.exports.sendNewListingsReq = (req) => {
  let newListingsReq = {
    message: 'Give me new listings please!'
  };

  let sqsParams = {
    MessageBody: JSON.stringify(newListingsReq),
    QueueUrl: newListingsQueue,
  };

  return sqs.sendMessage(sqsParams, (err, data) => {
    if (err) {
      console.log('New Listings Req ERROR: SQS MESSAGE SEND: ', err);
    } else {
      console.log('New Listing Req SUCCESS: SQS MESSAGE SEND: ', data); // contains message id details
    }
  });
};

module.exports.pollNewListingsQueue = (req) => {
  let params = {
    QueueUrl: newListingsQueue,
    VisibilityTimeout: 600 // 10 min wait time for anyone else to process.
  };

  return sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('error in poll from user search queue');
    } else {
      const listings = data; // data = returned from Inventory after requesting for new listings
      Promise.all(listings.map(listing => {
        return esHelpers.createListing(listing, res);
      }))
        .then((response, err) => {
          if (err) { throw err; }
          res.sendStatus(201);
        })
        .catch(err => {
          console.log(`post handler: CREATE LISTING ERROR where err is ${err}`);
          res.sendStatus(400);
        });
    }
  });
};

