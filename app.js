var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();

var url = 'mongodb://localhost:27017/test';

mongo.connect(url, function(err, db) {
	if (err) throw new Error("oops");

	app.get('/restaurants', function(req,res) {
		console.log("Connected");
		var collection = db.collection('restaurants');

		if(Object.keys(req.query).length === 0){

			collection.find({}).toArray(function(err, docs) {
				if (err) throw new Error("oops");
				res.json(docs);
			});
			
		} else {

			var newObj = {};

			if (req.query.show) {
				var toShow = req.query.show.split(',');
				toShow.forEach(function(elem){
					newObj[elem] = 1;
				});
			}			
			if(req.query.hide){
				var toHide = req.query.hide.split(',');	
				toHide.forEach(function(elem){
					newObj[elem] = 0;
				});
			}
			collection.find({}, newObj).toArray(function(err, docs) {
				if (err) throw new Error("oops");
				res.json(docs);
			});
		}
	});

	app.get('/restaurants/borough/:borough', function(req,res) {
		
		console.log("Connected");
		var collection = db.collection('restaurants');

		var borough = req.params.borough;

		collection.find({borough: borough}).toArray(function(err, docs) {
			if (err) throw new Error("oops");
			res.json(docs);
			
		});

	});


});

app.listen(3000)
