const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;
const esHelpers = require('./esHelpers');

const req = {
  body: [{
    uuid: 1,
    address: '38 TestHelper3 St.',
    city: 'San Francisco',
    country: 'USA',
    daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
    price: 540,
    rooms: 3,
    photos: ['www.image1.com', 'www.image2.com'],
    photoAccuracy: 3
  }]
};

app.post('/', (req, res) => {
  esHelpers.createListing(req, res);

});

app.get('/', (req, res) => {
  esHelpers.searchListing(req, res);
});

const express_port = 3000;

app.listen(express_port, function () {
  console.log('App starting on port: ', express_port);
});
