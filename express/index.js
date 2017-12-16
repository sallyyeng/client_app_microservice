const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;
const esHelpers = require('./esHelpers');

const sampleReq = {
  body: [{
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

// initial load of database listings //
app.post('/client/create_database', (req, res) => {
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

// Endpoints //

app.get('/client/listings', (req, res) => {
  console.log('inside handler');
  esHelpers.searchListings(req, res);
});

app.get('/client/listings/:id', (req, res) => {
  esHelpers.selectListing(req, res);
});

// SQS: Output bookings request to Bookings
// post to bookings with req.body (bookings data)
// when it comes back, check out response > call esHelpers.isBooked
// it will handle from there

// SQS: Output new listings request to Inventory
// use the /createdatabase endpoint handler above to handle those incoming new listings

const express_port = 3000;

app.listen(express_port, function () {
  console.log('App starting on port: ', express_port);
});

// To-Do:
// Look into SQS
// Implement all output requirements
// include body parser
