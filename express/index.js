const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;
const esHelpers = require('./database/esHelpers');
const sqsHelpers = require('./sqs/sqsHelpers.js');
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

//******************* Endpoint Tests *******************//
require('./cURL_tests.js');

//****************** Initialize queues *****************//
// sqsHelpers.createQueue('SearchEventsQueue');
// sqsHelpers.createQueue('NewListingsQueue');

//********************** Endpoints **********************//

app.get('/client/listings', (req, res) => {
  // query listings matching user's serach
  esHelpers.searchListings(req, res)
    .then(listings => {
      console.log(`${listings.length} listings returned from search`);
      sqsHelpers.sendUserSearchEvent(req);
      res.status(200).send(listings);
    })
    .catch(err => {
      console.log('index.js search listings error: ', err);
    });
});

app.get('/client/listing/:id', (req, res) => { // figure out how to ping this
  esHelpers.selectListing(req, res)
    .then(listing => {
      // console.log(listing[0]._source); // print matched listing
      res.send(listing);
    })
    .catch(err => {
      console.log('index.js select listings error: ', err);
    });
});

app.post('/client/booking', (req, res) => {
  // let { user_uuid, listing_uuid, PA_rating, booking_start_date, booking_end_date, booking_cost_per_night, booking_total_cost } = req.body;
  // send direct http request to bookings
  // use helper isBooked below
  // handle the message received from bookings: 201 for success; 404? for denial


});

//********************** Test Endpoints **********************//

app.get('/bookings/days-available', (req, res) => {
  let sampleDaysAvail = ['1/1/2018', '1/2/2018', '1/3/2018', '1/4/2018'];
  res.send(sampleDaysAvail);
});

//********************** Test Endpoints **********************//

const express_port = 3000;

app.listen(express_port, function () {
  console.log('App starting on port: ', express_port);
});

// To-Do:
// all routes are kinda broken:
// listings doesn't return different listings, just different dates of the same listing
// listing: cannot test cause need to figure out curl
// booking: not yet configured
// figure out how to time the request to inv for new listings
// logstash the events

// Notes:
// figure out if your database storing is correct b/c search listings is weird.. 10 entries only
// configure booking handler with axios etc.

// Stretch goal:
// figure out elastic search exact match: san francisco should not return san marino lol
// docker
// starting testing your mvp
