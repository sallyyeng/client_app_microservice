const es_client = require('./index.js');
const es_index = 'client_micro_service';
const es_type = 'listings';
// const es_index = require('./index.js');
// const es_type = require('./index.js');

//*************** STUBBED REQUEST BODIES TO TEST HANDLERS *************//

const selectedListing = { // When user selects a listing
  params: {
    id: 'ilJlXWABnGPG6BpeYTid'
  }
};

const confirmation = { // When you hear back from bookings about bookings req
  booking_id: 1234556,
  is_booked: true,
};

//****************** ElasticSearch helper functions ******************//

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
  console.log('inside select listing');
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
    return response.hits.hits;
  }).catch(err => {
    console.log(`esHelpers SEARCH LISTING QUERY FAILED with error: ${err}`);
    res.status(err.statusCode).send(err.message);
  });
};

module.exports.createListing = (listing, res) => {
  // const listings = req.body; // Code for when Inventory microserv is connected
  return es_client.create({
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

// module.exports.isBooked = (req, res) => {
//   if (confirmation.is_booked) {
//     res.sendStatus(201);
//   } else {
//     res.status(400).send('Booking no longer available');
//   }
// };
