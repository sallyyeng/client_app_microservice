const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;
const esHelpers = require('./esHelpers');

const sampleReq = {
  body: [{
    user_uuid: 84,
    address: '38 Leo St.',
    city: 'Taipei',
    country: 'Taisan',
    daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
    price: 540,
    rooms: 3,
    photos: ['www.image1.com', 'www.image2.com'],
    photoAccuracy: 3
  },
  {
    user_uuid: 93,
    address: '38 Leo2 St.',
    city: 'Shanghai',
    country: 'China',
    daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
    price: 540,
    rooms: 3,
    photos: ['www.image1.com', 'www.image2.com'],
    photoAccuracy: 3
  },
  {
    user_uuid: 44,
    address: '38 Leo3 St.',
    city: 'Miami',
    country: 'USA',
    daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
    price: 540,
    rooms: 3,
    photos: ['www.image1.com', 'www.image2.com'],
    photoAccuracy: 3
  }]
};

app.post('/client/update', (req, res) => {
  const listings = sampleReq.body;
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

});

app.get('/client/listings', (req, res) => {
  esHelpers.searchListings(req, res);
});

app.get('/client/listing', (req, res) => {
  esHelpers.selectListing(req, res);
});

app.post('/client/booking', (req, res) => {
  // post to bookings with req.body (bookings data)
  // when it comes back, check out response > call esHelpers.isBooked
  // it will handle from there
});

const express_port = 3000;

app.listen(express_port, function () {
  console.log('App starting on port: ', express_port);
});

// To-Do:
// Figure out how to prioritize search fields
// Look into SQS
// Implement all output requirements
