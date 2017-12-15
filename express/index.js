const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const env = require('dotenv').load(); // try to incorporate config.json file;

// initialize elasticsearch server connection //
console.log('this is the host for elasticsearch: ', process.env.ELASTICSEARCH_HOST);
const es_client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200'
});
const es_index = 'search';
const es_type = 'listings';

// ensure es index exists
es_client.indices.create({
  index: es_index
}, function(err, resp, status) {
  // ensure es document exists
  es_client.index({
    index: es_index,
    type: es_type,
    id: 1,
    body: {
      uuid: 1,
      address: '38 Palm St.',
      city: 'San Francisco',
      country: 'USA',
      daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
      price: 540,
      rooms: 3,
      photos: ['www.image1.com', 'www.image2.com'],
      photoAccuracy: 3
    }
  }, function(err, resp, status) {
    if (err) { console.log('ERROR:', err); }
  });
});

app.get('/', function (req, res) {
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
