const elasticsearch = require('elasticsearch');

// Initialize elasticsearch server connection //
const es_client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200'
});
const es_index = 'user_events';
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

// From User
const query = {
  user_uuid: 58,
  city: 'San Francisco',
  country: 'USA',
  daysAvailable: [],
  price: 500,
  rooms: 3,
};

const selectedListing = {
  user_uuid: '',
  listing_uuid: 've0KWWABidUrXXgVbtYb'
};

const confirmation = {
  booking_id: 1234556,
  is_booked: true,
};


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

module.exports.selectListing = (req, res) => {
  // const query = req.params; // Code for when Users data is generated
  return es_client.search({
    index: es_index,
    type: es_type,
    body: {
      query: {
        match: {
          _id: selectedListing.listing_uuid
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
    res.status(400).send('Our apologies, the listing is no longer available');
  }
};
