// const elasticsearch = require('elasticsearch');

// // Initialize elasticsearch server connection //
// const es_client = elasticsearch.Client({
//   host: 'localhost:9200'
// });
// const es_index = 'listing';
// const es_type = 'available_listings';

// const fs = require('fs');
// const moment = require('moment');
// moment().format();

// const Chance = require('chance'),
//   chance = new Chance();

// generatePhotoAccuracy = () => {
//   let options = [null, 1, 2, 3, 4, 5];
//   let index = getRandomInt(0,6);
//   return options[index];
// };

// generatePhotoURL = () => {
//   let images = [];
//   let imageCount = getRandomInt(1,5);
//   for (let i = 0; i < imageCount; i++) {
//     images.push(`www.${chance.word()}_img.com`);
//   }
//   return images;
// };

// getRandomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };

// getRandomDate = (start, end) => {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// };

// listingGenerator = () => {
//   let headers = {"index":{"_index": es_index, "_type": es_type}};

//   let listing = {
//     address: chance.address({short_suffix: true}),
//     city: chance.city(),
//     country: chance.country({full: true}),
//     price: getRandomInt(50, 800),
//     rooms: getRandomInt(1,4),
//     photos: generatePhotoURL(),
//     photoAccuracy: generatePhotoAccuracy(),
//     // daysAvailable: generateDaysAvailable(), // knixing b/c you're querying johnny for availability
//   };

//   return [headers, listing];
// };

// let uploadCount = 0;

// createBulkPost = () => {
//   let bulkUpload = [];
//   if (uploadCount % 100 === 0) {
//     console.log(`progress: ${uploadCount}`);
//   }

//   for (let i = 0; i < 100; i++) {
//     bulkUpload = bulkUpload.concat(listingGenerator());
//   }

//   es_client.bulk({
//     body: bulkUpload
//   })
//     .then((response, err) => {
//       if (err) { throw err; }

//       if (uploadCount < 50000) {
//         uploadCount++;
//         createBulkPost();
//       }
//     })
//     .catch(err => {
//       console.log(`esHelpers BULK LISTING ERROR where err is ${err}`);
//     });
// };

// createBulkPost();


// // enumerateFromStartDate = (startDate, daysLength) => {
// //   // create storage array for avail dates
// //   const daysAvailable = [];
// //   const currDate = moment(startDate).startOf('day');

// //   // create sequential days from start date for duration of daysLength
// //   let n = 0;
// //   while(n < daysLength) {
// //       // let shrinkedDate = currDate.toDate().valueOf()/10000 // turn Date format to shortened integer
// //       let shrinkedDate = currDate.toDate() // turn Date format to shortened integer
// //       daysAvailable.push(shrinkedDate);
// //       currDate.add(1, 'days') // you may want to put a limit of 12/31/2018 on this
// //     n++;
// //   }

// //   return daysAvailable;
// // };

// // // generateDaysAvailable = () => {
// // //   // generate length of daysAvail array
// // //   let daysLength = getRandomInt(50, 150);

// // //   let randomStartDate = getRandomDate(new Date(2018, 01, 01), new Date(2018, 06, 31)) // select random start date between 1/1/2018 and 6/31/2018
// // //   return enumerateFromStartDate(randomStartDate, daysLength);
// // // };


