const elasticsearch = require('elasticsearch');

// Initialize elasticsearch server connection //
const es_client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200'
});
const es_index = 'search';
const es_type = 'listings';

// Verify connection with elasticsearch db //
es_client.ping({
  requestTimeout: 1000
}, (error => {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('ElasticSearch DB Connected');
    }
  }));

// If index doesn't already exist, create one //
es_client.indices.exists({index: `${es_index}`})
  .then(exists => {
    if (!exists) {
      es_client.indices.create({
        index: es_index
      })
        .then((response, err) => {
          if (err) { throw err; }
          console.log('es_index created!');
        })
        .catch(err => {
          console.log(`CANNOT CREATE INDEX > INVESTIGATE THIS ERROR: ${err}`);
        });
    }
  });

//****************** ElasticSearch helper functions ******************//

// Placeholder for incoming request bodies //

// From Inventory
const listings = [{
  uuid: 1,
  address: '38 WUSGOOD St.',
  city: 'Las Vegas',
  country: 'Nevada',
  daysAvailable: ['JAN012018', 'JAN022018', 'JAN032018'],
  price: 540,
  rooms: 3,
  photos: ['www.image1.com', 'www.image2.com'],
  photoAccuracy: 3
}];

// From User
const query = {
  uuid: 58,
  city: 'Las Vegas',
  country: 'USA',
  daysAvailable: [],
  price: 500,
  rooms: 3,
};

module.exports.createListing = (listing, res) => {
  // const listings = req.body; // Code for when Inventory microserv is connected

  return es_client.index({
    index: es_index,
    type: es_type,
    body: listing
  }).then((response, err) => {
    if (err) { throw err; }
    console.log('created listing in db');
  }).catch(err => {
    console.log(`esHelpers CREATE LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });

};

module.exports.searchListing = (listing, res) => {
  // const query = req.params; // Code for when Users data is generated

  return es_client.search({
    index: es_index,
    type: es_type,
    body: {
      query: {
        match: {
          city: query.city
        }
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
