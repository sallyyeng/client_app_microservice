const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;
const esHelpers = require('./database/esHelpers');
const sqsHelpers = require('./sqs/sqsHelpers.js');
const axios = require('axios');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));

// Initialize queues //
// sqsHelpers.createQueue('SearchEventsQueue');
// sqsHelpers.createQueue('NewListingsQueue');

const searchReq = { // When user searches for listings
  params: {
    user_uuid: 58,
    search_date: 03022017,
    query: 'Hikoje',
    daysAvailable: [],
    room_count: 3,
  }
};

// Endpoints //

app.get('/client/listings', (req, res) => {
  // let { user_uuid, search_date, query } = req.params; // comment in when real requests happen

  // query listings matching user's serach
  esHelpers.searchListings(searchReq, res)
    .then(listings => {
      console.log(`${listings.length} listings returned from search`)
      sqsHelpers.sendUserSearchEvent(req);
      res.status(200).send(listings);
    })
});

app.get('/client/listing/:id', (req, res) => { // figure out how to ping this
  console.log('inside listing search');
  esHelpers.selectListing(req, res)
    .then(listing => {
      if (response.hits.hits.length === 0) {
        console.log('NO MATCHING LISTINGS');
        res.status(404).send('No Matching Listings');
      }
      res.send(listing);
    });
});

app.post('/client/booking', (req, res) => {
  // let { user_uuid, listing_uuid, PA_rating, booking_start_date, booking_end_date, booking_cost_per_night, booking_total_cost } = req.body;
  // send direct http request to bookings
  // use helper isBooked below
  // handle the message received from bookings: 201 for success; 404? for denial
});

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

// Notes:
// figure out if your database storing is correct b/c search listings is weird.. 10 entries only
// configure booking handler with axios etc.

// Stretch goal:
// docker
// starting testing your mvp
