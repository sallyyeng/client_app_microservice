
// const apm = require('elastic-apm-node').start({
//   appName: 'Client App Service',
//   serverUrl: 'http://localhost:8200',
// });

// const winston = require('winston');
// const Elasticsearch = require('winston-elasticsearch');

require('newrelic');

const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;
const axios = require('axios');
const bodyParser = require('body-parser');

const esHelpers = require('../database/esHelpers.js');
const sqsHelpers = require('../sqs/sqsHelpers.js');
const bookings = require('../server/directToBookings.js');
const db_load = require('../database/initial_db_load');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//****************** Initialize queues *****************//

// sqsHelpers.createQueue('SearchEventsQueue');
// sqsHelpers.createQueue('NewListingsQueue');

//********************** Endpoints **********************//

app.get('/', (req, res) => {
  res.send();
});

app.get('/client/listings', (req, res) => {
  // query listings matching user's serach
  esHelpers.searchListings(req, res)
    .then(listings => {
      // console.log(`${listings.length} listings returned from search`);
      sqsHelpers.sendUserSearchEvent(req);
      res.send(listings);
    })
    .catch(err => {
      console.log('index.js search listings error: ', err);
    });
});

app.get('/client/listing/:listing_uuid', (req, res) => {
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
  bookings.getBookingReqConfirmation(req)
    .then(bookingReq => {
      if (bookingReq.isBooked) {
        res.sendStatus(201);
      } else {
        throw err;
      }
    })
    .catch(err => {
      console.log('index.js booking request handler ERROR: ', err);
      res.status(400).send('Booking no longer available');
    });
});

//********************** Test Endpoints **********************//

app.get('/bookings/availability/:listing_uuid', (req, res) => {
  let sampleDaysAvail = {'10-10-1002': true, '11-23-2922': false};
  res.send(sampleDaysAvail);
});

app.post('/bookings/book/:listing_uuid', (req, res) => {
  let bookingReqStatus = {
    isBooked: true
  };
  res.send(bookingReqStatus);
});

// app.use(apm.middleware.express());

//**************** Server Initialization ****************//

const express_port = 3000;

app.listen(express_port, function () {
  console.log('OPT App starting on port: ', express_port);
});


// To-Do:
