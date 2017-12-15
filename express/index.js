const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;
const esHelpers = require('./esHelpers');

const sampleReq = {
  body: [{
    uuid: 1,
    address: '38 Hello St.',
    city: 'Chicago',
    country: 'USA',
    daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
    price: 540,
    rooms: 3,
    photos: ['www.image1.com', 'www.image2.com'],
    photoAccuracy: 3
  },
  {
    uuid: 1,
    address: '38 Another St.',
    city: 'Houston',
    country: 'USA',
    daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
    price: 540,
    rooms: 3,
    photos: ['www.image1.com', 'www.image2.com'],
    photoAccuracy: 3
  },
  {
    uuid: 1,
    address: '38 Nomo St.',
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
  esHelpers.searchListing(req, res);
});

const express_port = 3000;

app.listen(express_port, function () {
  console.log('App starting on port: ', express_port);
});
