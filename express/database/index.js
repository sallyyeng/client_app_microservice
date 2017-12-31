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

//***** Code to generate indexes - you can modify shard count here ******//
// let airbnbIndexes = ['listings-af', 'listings-gl', 'listings-mr', 'listings-sz'];
// airbnbIndexes.forEach(index => {
//   // If index doesn't already exist, create one //
//   es_client.indices.exists({index: `${index}`})
//     .then(exists => {
//       if (!exists) {
//         es_client.indices.create({ // specify body settings for shards and reps
//           index: index,
//           body: {
//             settings: {
//               index: {
//                 number_of_shards: 8,
//                 number_of_replicas: 2
//               }
//             }
//           }
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
