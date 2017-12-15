const elasticsearch = require('elasticsearch');

// initialize elasticsearch server connection //
console.log('this is the host for elasticsearch: ', process.env.ELASTICSEARCH_HOST);

const es_client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200'
});
const es_index = 'search';
const es_type = 'listings';

module.exports.createListing = (sampleReqBody) => {
  es_client.indices.create({
    index: es_index
  }, (err, resp, status) => {
    // ensure es document exists
    return es_client.index({
      index: es_index,
      type: es_type,
      body: sampleReqBody[0]
    }, (err, resp, status) => {
      if (err) { console.log(`esHelpers CREATE LISTING ERROR where err is ${err}, response is ${resp} and status is ${status}`); }
    });
  });
};

