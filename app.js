var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();

var url = 'mongodb://localhost:27017/test';

function limitItems(req){
	var lim = 0;

	if (req.query.limit) {
		lim = req.query.limit;
	}

	return parseInt(lim);
}
function pagination(req){

	var itemsToSkip = 0;
	if (req.query.page) {
		var page = req.query.page - 1;
		itemsToSkip = req.query.limit * page;
	}
	
	return parseInt(itemsToSkip);
}
function filter(req){
	var oFilter = {};

	if (req.query.show) {
		var toShow = req.query.show.split(',');
		toShow.forEach(function(elem){
			oFilter[elem] = 1;
		});
	}			
	if(req.query.hide){
		var toHide = req.query.hide.split(',');	
		toHide.forEach(function(elem){
			oFilter[elem] = 0;
		});
	}
	return oFilter;
}

mongo.connect(url, function(err, db) {
	if (err) throw new Error("oops");

	app.get('/restaurants', function(req,res) {
		console.log("Connected");
		var collection = db.collection('restaurants');

		var oFilter = filter(req);
		var limit = limitItems(req);
		var page = pagination(req);
		// var limitItems = limitItems(req);
		
		collection.find({},oFilter).limit(limit).skip(page).toArray(function(err, docs) {
			if (err) throw new Error("oops");
			res.json(docs);
		});
	});

	app.get('/restaurants/borough/:borough', function(req,res) {
		
		console.log("Connected");
		var collection = db.collection('restaurants');

		var borough = req.params.borough;

		var oFilter = filter(req);
		var limit = limitItems(req);
		var page = pagination(req);

		collection.find({borough: borough}, oFilter).skip(page).limit(limit).toArray(function(err, docs) {
			if (err) throw new Error("oops");
			res.json(docs);
			
		});

	});

	var a = ['/restaurants/cuisine/:cuisine', '/restaurants/cuisine/not/:cuisine'];
	app.get(a, function(req,res) {
		
		console.log("Connected");

		var collection = db.collection('restaurants');

		var cuisine = req.params.cuisine;

		var oFilter = filter(req);
		var limit = limitItems(req);
		var page = pagination(req);

		var path = req.path.split('/');

		if(path[3]==='not'){
			cuisine = {$ne: cuisine}
		}
		
		collection.find({cuisine: cuisine}, oFilter).skip(page).limit(limit).toArray(function(err, docs) {
			if (err) throw new Error("oops");
			res.json(docs);
			
		});

	});


});

app.listen(3000);