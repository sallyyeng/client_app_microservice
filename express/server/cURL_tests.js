
const axios = require('axios');

// // search listings
// axios.get('http://localhost:3000/client/listings', {
//   params: {
//     query: 'Turkey'
//   }
// });

// // select listing
// axios.get('http://localhost:3000/client/listing/:listing_uuid', {
//   params: {
//     id: 'z6lvcGABjiHOqzg7w0Op'
//   }
// });

// booking request
axios.post('http://localhost:3000/client/booking', {
  user_uuid: 19299292824,
  listing_uuid: 'z6lvcGABjiHOqzg7w0Op',
  pa_rating: 2,
  booking_length: 20,
  booking_start_date: '1/1/2018',
  booking_end_date: '1/20/2018',
  booking_cost_per_night: 89,
  booking_total_cost: 1780,
  booking_date: '12/31/2017'
});



// axios.get('http://localhost:3000/bookings/book/:listing_uuid', {
//   params: {
//     id: 'z6lvcGABjiHOqzg7w0Op'
//   }
// });

// // search listings
// curl -X GET -d "query=Turkey" 'http://localhost:3000/client/listings'

// // select listing
// curl -X GET -d "id=z6lvcGABjiHOqzg7w0Op" 'http://localhost:3000/client/listing/:id'
