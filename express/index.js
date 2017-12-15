const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;
const esHelpers = require('./esHelpers');

const sampleReqBody = [{
  uuid: 1,
  address: '38 TestHelper1 St.',
  city: 'San Francisco',
  country: 'USA',
  daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
  price: 540,
  rooms: 3,
  photos: ['www.image1.com', 'www.image2.com'],
  photoAccuracy: 3
}];

app.post('/', (req, res) => {
  console.log('inside post handler');
  esHelpers.createListing(sampleReqBody);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  es_client.search({
    index: es_index,
    type: es_type,
    body: {
      query: {
        match_all: {}
      }
    }
  }).then(err => {
    res.send(response.hits.hits);
  }, error => {
    res.status(error.statusCode).send(error.message);
  });
});

const express_port = 3000;

app.listen(express_port, function () {
  console.log('App starting on port: ', express_port);
});
