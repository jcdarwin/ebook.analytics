// Setup mongoose and the database
var mongoose = require('mongoose/');
var config = require('./config'); // Local congig file to hide creds
db = mongoose.connect(config.creds.auth),
Schema = mongoose.Schema;

// require restify and bodyParser to read Backbone.js syncs
var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());

// Create a schema for our data
var AnalyticsSchema = new Schema({
  category: String,
  action: String,
  label: String,
  value: Number,
  date: Date
});

// Use the schema to register a model
mongoose.model('Analytic', AnalyticsSchema);
var Analytic = mongoose.model('Analytic');


// This function is responsible for returning all entries for the Message model
function getAnalytics(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to server our response to any origin
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  Analytic.find().limit(20).sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}

function postAnalytic(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // Create a new message model, fill it up and save it to Mongodb
  var analytic = new Analytic();
  analytic.analytic = req.params.analytic;
  analytic.date = new Date();
  analytic.save(function () {
    res.send(req.body);
  });
}

// Set up our routes and start the server
server.get('/analytics', getAnalytics);
server.post('/analytics', postAnalytic);

server.listen(8080, function() {
  console.log('%s listening at %s, love & peace', server.name, server.url);
});
