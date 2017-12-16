const elasticsearch = require('elasticsearch');

// Initialize elasticsearch server connection //
const es_client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200'
});
const es_index = 'client_events';
const es_type = 'listings';

// Verify connection with elasticsearch db //
es_client.ping({
  requestTimeout: 1000
}, (error => {
    if (error) {
      console.trace('elasticsearch cluster is down!: ', error);
    } else {
      console.log('ElasticSearch DB Connected');
    }
  }));

module.exports = es_client;

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

//*************** STUBBED REQUEST BODIES TO TEST HANDLERS *************//

const selectedListing = { // When user selects a listing
  params: {
    id: 'wu0MWWABidUrXXgV8Nan'
  }
};

const confirmation = { // When you hear back from bookings about bookings req
  booking_id: 1234556,
  is_booked: true,
};

//****************** ElasticSearch helper functions ******************//

module.exports.createListing = (listing, res) => {
  // const listings = req.body; // Code for when Inventory microserv is connected
  return es_client.index({
    index: es_index,
    type: es_type,
    body: listing
  }).then((response, err) => {
    if (err) { throw err; }
  }).catch(err => {
    console.log(`esHelpers CREATE LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });

};

module.exports.searchListings = (req, res) => {
  // const query = req.params; // Code for when Users data is generated
  return es_client.search({
    index: es_index,
    type: es_type,
    body: {
      query: {
        multi_match: {
          query: req.params.query, // change this for query
          fields: [
            'city',
            'country'
          ]
        }
      }
    }
  }).then((response, err) => {
    if (err) { throw err; }
    return response.hits.hits;
  }).catch(err => {
    console.log(`esHelpers SEARCH LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });
};

module.exports.selectListing = (req, res) => {
  // const query = req.params.id; // Code for when Users data is generated
  return es_client.search({
    index: es_index,
    type: es_type,
    body: {
      query: {
        match: {
          _id: selectedListing.params.id
        }
      }
    }
  }).then((response, err) => {
    if (err) { throw err; }
    res.send(response);
  }).catch(err => {
    console.log(`esHelpers SEARCH LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });
};

module.exports.isBooked = (req, res) => {
  if (confirmation.is_booked) {
    res.sendStatus(201);
  } else {
    res.status(400).send('Booking no longer available');
  }
};
