var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();

var url = 'mongodb://localhost:27017/test';

mongo.connect(url, function(err, db) {
	if (err) throw new Error("oops");

	app.get('/restaurants', function(req,res) {
		
		console.log("Connected");

		var collection = db.collection('restaurants');

		collection.find({}).toArray(function(err, docs) {
  			res.json(docs);
          	db.close();
		});

	});


});

app.listen(3000)
