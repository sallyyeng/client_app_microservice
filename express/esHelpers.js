const elasticsearch = require('elasticsearch');

// initialize elasticsearch server connection //
console.log('this is the host for elasticsearch: ', process.env.ELASTICSEARCH_HOST);

const es_client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200'
});
const es_index = 'search';
const es_type = 'listings';

// // create initial search database //
// es_client.indices.create({
//   index: es_index
// }).then((response, err) => {
//   if (err) {
//     throw err;
//   }
// }).catch(err => {
//   console.log(`esHelpers CREATE LISTING ERROR where err is ${err}`);
// });

// ElasticSearch helper functions //
module.exports.createListing = (req, res) => {
  const listing = [{
    uuid: 1,
    address: '38 DOESTHISWORK St.',
    city: 'San Francisco',
    country: 'USA',
    daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
    price: 540,
    rooms: 3,
    photos: ['www.image1.com', 'www.image2.com'],
    photoAccuracy: 3
  }];

  return es_client.index({
    index: es_index,
    type: es_type,
    body: listing[0]
  }).then((response, err) => {
    if (err) { throw err; }
    res.sendStatus(200);
  }).catch(err => {
    console.log(`esHelpers CREATE LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });

};

module.exports.searchListing = (listing, res) => {
  console.log('inside searchListing handler');
  return es_client.search({
    index: es_index,
    type: es_type,
    body: {
      query: {
        match_all: {}
      }
    }
  }).then((response, err) => {
    if (err) { throw err; }
    res.send(response.hits.hits);
  }).catch(err => {
    console.log(`esHelpers SEARCH LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });
};
