const elasticsearch = require('elasticsearch');

// Initialize elasticsearch server connection //
const es_client = elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST + ':9200'
});

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

//***** Code to generate indexes, but initial db load took care of that for us ******//
// airbnbIndexes.forEach(index => {
//   // If index doesn't already exist, create one //
//   es_client.indices.exists({index: `${index}`})
//     .then(exists => {
//       if (!exists) {
//         es_client.indices.create({
//           index: index
//         })
//           .then((response, err) => {
//             if (err) { throw err; }
//             console.log('index created!');
//           })
//           .catch(err => {
//             console.log(`CANNOT CREATE INDEX > INVESTIGATE THIS ERROR: ${err}`);
//           });
//       }
//     });
// });
