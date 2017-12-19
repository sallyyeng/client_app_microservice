// const elasticsearch = require('elasticsearch');

// // Initialize elasticsearch server connection //
// const es_client = elasticsearch.Client({
//   host: 'localhost' + ':9200'
// });
// const es_index = 'client_micro_service';
// const es_type = 'listings';

// const fs = require('fs');
// const moment = require('moment')
// moment().format();

// const Chance = require('chance'),
// chance = new Chance();

// generatePhotoAccuracy = () => {
//   let options = [null, 1, 2, 3, 4, 5];
//   let index = getRandomInt(0,6);
//   return options[index]
// }

// generatePhotoURL = () => {
//   let images = [];
//   let imageCount = getRandomInt(1,5)
//   for (let i = 0; i < imageCount; i++) {
//     images.push(`www.${chance.word()}_img.com`)
//   }
//   return images;
// }

// getRandomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// randomDate = (start, end) => {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// }

// enumerateDaysBetweenDates = (startDate, daysLength) => {
//   // create storage array for avail dates
//   const daysAvailable = [];
//   const currDate = moment(startDate).startOf('day');

//   // create sequential days from start date for duration of daysLength
//   let n = 0;
//   while(n < daysLength) {
//       let shrinkedDate = currDate.toDate().valueOf()/10000 // turn Date format to shortened integer
//       daysAvailable.push(shrinkedDate);
//       currDate.add(1, 'days') // you may want to put a limit of 12/31/2018 on this
//     n++;
//   }

//   return daysAvailable;
// };

// generateDaysAvailable = () => {
//   // generate length of daysAvail array
//   let daysLength = getRandomInt(100, 250);

//   let randomStartDate = randomDate(new Date(2018, 01, 01), new Date(2018, 06, 31)) // select random start date between 1/1/2018 and 6/31/2018
//   return enumerateDaysBetweenDates(randomStartDate, daysLength);
// };

// staticListingGenerator = (uuid) => {
//   return listing = {
//     address: chance.address({short_suffix: true}),
//     city: chance.city(),
//     country: chance.country({full: true}),
//     price: getRandomInt(50, 800),
//     rooms: getRandomInt(1,4),
//     photos: generatePhotoURL(),
//     photoAccuracy: generatePhotoAccuracy()
//   };
// };

// listingDaysGenerator = () => {
//   // generate static listing instance and days avail array
//   let thisStaticListing = staticListingGenerator();
//   let daysAvail = generateDaysAvailable();
//   // let daysAvail = ['day1', 'day2', 'day3', 'day4'];

//   // store each day into its own listing instance
//   let daysAvailFull = daysAvail.map(day => {
//     let copy = Object.assign({}, thisStaticListing);
//     copy['date'] = day;
//     return copy;
//   })

//   // format data to es bulk import complaint
//   let bulkFormat = [];
//   daysAvailFull.forEach(dayAvailFull => {
//     bulkFormat.push({"index":{"_index": es_index, "_type": es_type}})
//     bulkFormat.push(dayAvailFull)
//   })
//   // console.log(bulkFormat);
//   return bulkFormat;
// }

// let uploadCount = 0;

// createBulkPost = () => {
//   let bulkUpload = [];
//     if (uploadCount % 100 === 0) {
//       console.log(`progress: ${uploadCount}`);
//     }

//     // Assumption: max 250 days generated * 60 iterations * 2 (b/c extra row for es bulk format) = 30k entries in one bulk upload
//     for (let i = 0; i < 40; i++) {
//       bulkUpload = bulkUpload.concat(listingDaysGenerator());
//     }

//     es_client.bulk({
//       body: bulkUpload
//     }).then((response, err) => {
//       if (err) { throw err; }
//       if (uploadCount < 1000) {
//         uploadCount++;
//         createBulkPost();
//       }
//     }).catch(err => {
//       console.log(`esHelpers BULK LISTING ERROR where err is ${err}`);
//     });
// }

// createBulkPost();

// // let i = 0;
// // let bulkUpload = [];

// // let interval = setInterval(function(){ createBulkPost() }, 3000);

// // createBulkPost = () => {
// //   i += 1;
// //     console.log('inside createdbulkpost')
// //     // Assumption: max 250 days generated * 60 iterations * 2 (b/c extra row for es bulk format) = 30k entries in one bulk upload
// //     for (let i = 0; i < 75; i++) {
// //       bulkUpload = bulkUpload.concat(listingDaysGenerator());
// //     }

// //     es_client.bulk({
// //       body: bulkUpload
// //     }).then((response, err) => {
// //       bulkUpload = [];
// //       console.log('success!')
// //       if (err) { throw err; }
// //     }).catch(err => {
// //       bulkUpload = [];
// //       console.log(`esHelpers BULK LISTING ERROR where err is ${err}`);
// //     });
// //     // 150 75
// //   if (i > 4) {
// //     clearInterval(interval);
// //   }
// // }


