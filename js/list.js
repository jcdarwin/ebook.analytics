// List records in our database

var mongoose = require('mongoose/');
var config = require('./config');

var collections = ['analytics'];
var db = require('mongojs').connect(config.creds.auth, collections);

db.analytics.find({}, function(err, records) {
  if( err || !records) console.log("No records found");
  else records.forEach( function(record) {
    console.log(record);
  } );
});