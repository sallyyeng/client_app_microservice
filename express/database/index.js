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

module.exports = es_client;
// module.exports = es_index;
// module.exports = es_type;

