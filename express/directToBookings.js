const axios = require('axios');

let getDaysAvailable = (seletedListing) => {

  return axios.get('http://localhost:3000/bookings/days-available', {
    params: {
      id: seletedListing._id
    }
  })
    .then((response) => {
      let daysAvail = response.data;
      // append daysAvail to matched listing (object is complicated i.e. the chain of properties below)
      seletedListing.hits.hits[0]._source['days_available'] = daysAvail;
      return seletedListing.hits.hits;
    })
    .catch(function (error) {
      console.log(`directToBookings SEARCH LISTING QUERY FAILED with error: ${err}`);
    });
};

let getBookingReqConfirmation = () => {

};

module.exports = {
  getDaysAvailable
};
