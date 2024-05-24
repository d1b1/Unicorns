require('dotenv').config();

const _ = require('lodash');
const algoliasearch = require('algoliasearch');
const async = require('async');
const fs = require('fs');
const csv = require('csvtojson');
const moment = require('moment');
const { storeImage } = require('./utils');

// Initialize the Algolia client.
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const AlgoliaIndex = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

// ------------------------------------------------------------------------------
const csvFilePath = './data.csv'; 

function getLinkedInId (data) {
  try {
    return data.Linkedin.split('/in/')[1].replace('/', '').trim();
  } catch(err) {
    console.log('Skipping', err.message, data.Linkedin || 'No URL');
    return null;
  }
}

// create a queue object with concurrency 2
var ghQueue = async.queue(function(task, callback) {
  storeImage(task.url, 'network-book/logos', task.name).then(callback);
}, 1);

// assign a callback
ghQueue.drain(function() {
  console.log("\nAll Records have been processed.");
});

// const converter = csv({
//   noheader: false,
//   trim: true
// });

// // Function to replace spaces in header keys
// converter.on("header", (header) => {
//   console.log(header, header.map(field => field.replace(/\s+/g, '')))
//   return header.map(field => field.replace(/\s+/g, ''));
// });

csv()
  .fromFile(csvFilePath)
  .then(async (records) => {

    let i = 1;
    _.forEach(records, record => {
      record.objectID = i;
      record.Founders = (record.Founders || '').split(', ');
      record.Ethnicity = (record.Ethnicity || '').split(', ');
      record.SeedInvestors = (record.SeedInvestors || '').split(', ');
      record.DegreeStudied = (record.DegreeStudied || '').split(', ');
      record.Universities = (record.Universities || '').split(', ');
      i++;
    });

    // Force the index to run.
    // await AlgoliaIndex.saveObjects(dataToIndex).then(({ objectIDs }) => {
    //   console.log('Data pushed to Algolia:', objectIDs.length);
    // }).catch(err => {
    //   console.error('Error pushing data to Algolia:', err);
    // });

    // Dump it to a file.
    const outputFilePath = './output_file.json'; 
    fs.writeFile(outputFilePath, JSON.stringify(records, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON to file:', err);
      } else {
        console.log('JSON file has been saved.');
      }
    });

  })
  .catch((error) => {
    console.error('Error processing CSV file:', error);
  });


