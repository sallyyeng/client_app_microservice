const elasticsearch = require('elasticsearch');

// Initialize elasticsearch server connection //
const es_client = elasticsearch.Client({
  host: 'localhost:9200'
});

// map of index to letters
// const es_index_1 = 'listings_af';
// const es_index_2 = 'listings_gl';
// const es_index_3 = 'listings_mr';
// const es_index_4 = 'listings_sz';

const es_type = 'listings';

const fs = require('fs');
const moment = require('moment');
moment().format();

const Chance = require('chance'),
  chance = new Chance();

generatePhotoAccuracy = () => {
  let options = [null, 1, 2, 3, 4, 5];
  let index = getRandomInt(0, 6);
  return options[index];
};

generatePhotoURL = () => {
  let images = [];
  let imageCount = getRandomInt(1, 5);
  for (let i = 0; i < imageCount; i++) {
    images.push(`www.${chance.word()}_img.com`);
  }
  return images;
};

getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

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

listingGenerator = () => {

  let listing = {
    address: chance.address({short_suffix: true}),
    city: chance.city(),
    country: chance.country({full: true}),
    price: getRandomInt(50, 800),
    rooms: getRandomInt(1, 4),
    photos: generatePhotoURL(),
    photoAccuracy: generatePhotoAccuracy(),
    // daysAvailable: generateDaysAvailable(), // knixing b/c you're querying johnny for availability
  };

  let es_index = `es_index_${mapLetterToIndex(listing.country[0])}`;

  let headers = {'index': {'_index': es_index, '_type': es_type}};

  return [headers, listing];
};

// global variable counter for createBulkPost helper //
let uploadCount = 0;

createBulkPost = () => {
  // object with headers and listing data
  let bulkUpload = [];

  // track progress
  if (uploadCount % 1000 === 0) {
    console.log(`progress: ${uploadCount}`);
  }

  // generate x listings for each bulk upload
  for (let i = 0; i < 100; i++) {
    bulkUpload = bulkUpload.concat(listingGenerator());
  }

  es_client.bulk({
    body: bulkUpload
  })
    .then((response, err) => {
      if (err) { throw err; }

      // send bulk upload y times for x * y listings total in db
      if (uploadCount < 50000) {
        uploadCount++;
        createBulkPost();
      }
    })
    .catch(err => {
      console.log(`esHelpers BULK LISTING ERROR where err is ${err}`);
    });
};

// createBulkPost();

//********* Code for generating array of sequential dates ********//

// enumerateFromStartDate = (startDate, daysLength) => {
//   // create storage array for avail dates
//   const daysAvailable = [];
//   const currDate = moment(startDate).startOf('day');

//   // create sequential days from start date for duration of daysLength
//   let n = 0;
//   while(n < daysLength) {
//       // let shrinkedDate = currDate.toDate().valueOf()/10000 // turn Date format to shortened integer
//       let shrinkedDate = currDate.toDate() // turn Date format to shortened integer
//       daysAvailable.push(shrinkedDate);
//       currDate.add(1, 'days') // you may want to put a limit of 12/31/2018 on this
//     n++;
//   }

//   return daysAvailable;
// };

// // generateDaysAvailable = () => {
// //   // generate length of daysAvail array
// //   let daysLength = getRandomInt(50, 150);

// //   let randomStartDate = getRandomDate(new Date(2018, 01, 01), new Date(2018, 06, 31)) // select random start date between 1/1/2018 and 6/31/2018
// //   return enumerateFromStartDate(randomStartDate, daysLength);
// // };

