const MongoClient = require('mongodb').MongoClient;
const test        = require('assert');
const url         = 'mongodb://localhost:27017';
const dbName      = 'triplethreat';

function collection(name, callback) {
    MongoClient.connect(url, function(err, client) {
      // Create a collection we want to drop later
      const col = client.db(dbName).collection(name);
      // Show that duplicate records got dropped
      callback(col);
    });
}

module.exports = collection;


