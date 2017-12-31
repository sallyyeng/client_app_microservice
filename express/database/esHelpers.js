const axios = require('axios');
const es_client = require('./index.js');
const bookings = require('../server/directToBookings.js');

const es_type = 'listings';

//****************** ElasticSearch helper functions ******************//

mapLetterToIndex = (letter) => {
  let alphabetMapper = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9,
    K: 10,
    L: 11,
    M: 12,
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
  };

  let number = alphabetMapper[letter];

  if (number >= 0 && number <= 5) {
    return 1;
  } else if (number >= 6 && number <= 11) {
    return 2;
  } else if (number >= 12 && number <= 17) {
    return 3;
  } else {
    return 4;
  }
};

module.exports.searchListings = (req, res) => {
  let { query } = req.query;
  let es_index = `es_index_${mapLetterToIndex(query[0])}`;

  return es_client.search({
    index: es_index,
    type: es_type,
    body: {
      query: {
        match: {
          country: query
        }
      }
    }
  }).then((response, err) => {
    return response.hits.hits;
  }).catch(err => {
    console.log(`esHelpers SEARCH LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });
};

module.exports.selectListing = (req, res) => {
  // let { id } = req.query; // Code for when Users data is generated
  let id = req.params.listing_uuid;
  let es_index = `es_index_${mapLetterToIndex(req.query.country[0])}`;

  // get listing obj matching user selection
  return es_client.search({
    index: es_index,
    type: es_type,
    body: {
      query: {
        match: {
          _id: id
        }
      }
    }
  }).then(listing => {
    // get dates available from bookings
    return bookings.getDaysAvailable(listing, res);
  }).catch(err => {
    console.log(`esHelpers SEARCH LISTING QUERY FAILED`);
    res.status(404).send();
  });
};

module.exports.createListing = (listing, res) => {
  // destructure body for listings array
  // loop through each listing and grab the country's first letter
  // define es_index and then use es create command to add to db

  let es_index = `es_index_${mapLetterToIndex(req.query.country[0])}`;
  return es_client.create({
    index: es_index,
    type: es_type,
    body: listing
  }).then((response, err) => {

  }).catch(err => {
    console.log(`esHelpers CREATE LISTING ERROR where err is ${err}`);
    res.status(err.statusCode).send(err.message);
  });
};

//****** To Do: ******//

// - Let user search by city or country so both must be pulled from same address
// - NOT generated independently randomly

