var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var routes = require('./routes/routes');

var url = 'mongodb://localhost:27017/test';

var db = mongo.connect(url);

db.then(function(db){

	app.use('/', routes(db) );

	app.listen(3000, function() {
		console.log ("listening to port 3000");
	});

})
.catch(function(err) {
	throw new Error("something failed in the connection");
});