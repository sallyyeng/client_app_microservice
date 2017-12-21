const axios = require('axios');

let getDaysAvailable = (selectedListing, res) => {
  return axios.get(`http://localhost:3000/bookings/availability/${selectedListing._id}`)
    .then((response) => {
      let daysAvail = response.data;
      // append daysAvail to matched listing (object is complicated i.e. the chain of properties below)
      selectedListing.hits.hits[0]._source['days_available'] = daysAvail;
      return selectedListing.hits.hits;
    })
    .catch(function (error) {
      console.log(`directToBookings SEARCH LISTING QUERY FAILED with error: ${err}`);
    });
};

let getBookingReqConfirmation = (req, res) => {
  let { user_uuid, listing_uuid, PA_rating, booking_length, booking_start_date, booking_end_date, booking_cost_per_night, booking_total_cost, booking_date } = req.body;

  return axios.post('http://localhost:3000/bookings/book/:listing_uuid', {
    user_uuid: user_uuid,
    listing_uuid: listing_uuid,
    PA_rating: PA_rating,
    booking_length: booking_length,
    booking_start_date: booking_start_date,
    booking_end_date: booking_end_date,
    booking_cost_per_night: booking_cost_per_night,
    booking_total_cost: booking_total_cost,
    booking_date: booking_date
  })
    .then((bookingsReqStatus) => {
      return bookingsReqStatus.data;
    })
    .catch(function (error) {
      console.log(`directToBookings SEARCH LISTING QUERY FAILED with error: ${err}`);
    });
};


module.exports = {
  getDaysAvailable, getBookingReqConfirmation
};
