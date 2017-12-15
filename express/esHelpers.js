const elasticsearch = require('elasticsearch');

// Initialize elasticsearch server connection //
const es_client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200'
});
const es_index = 'search';
const es_type = 'listings';

// Verify connection with elasticsearch db //
es_client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, (error => {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('ElasticSearch DB Connected');
    }
  }));

// Create initial search database //
es_client.indices.create({
  index: es_index
}).then((response, err) => {
  if (err) {
    throw err;
    console.log(`${es_index} index created!`);
  }
}).catch(err => {
  console.log(`${es_index} index already exists, but that's OKAY!`);
});

// ElasticSearch helper functions //

module.exports.createListing = (req, res) => {
  // placeholder for Inventory's request body //
  const listings = [{
    uuid: 1,
    address: '38 INDEXEXISTSTILLWORKS St.',
    city: 'San Francisco',
    country: 'USA',
    daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
    price: 540,
    rooms: 3,
    photos: ['www.image1.com', 'www.image2.com'],
    photoAccuracy: 3
  }];

  // const listings = req.body;
  return es_client.index({
    index: es_index,
    type: es_type,
    body: listings[0]
  }).then((response, err) => {
    if (err) { throw err; }
    res.sendStatus(200);
  }).catch(err => {
    console.log(`esHelpers CREATE LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });

};

module.exports.searchListing = (listing, res) => {
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
