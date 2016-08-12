var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var ObjectID = require('mongodb').ObjectId;

var limitItems = require('./helpers/limitItems');
var pagination = require('./helpers/pagination');
var filter = require('./helpers/filter');

var url = 'mongodb://localhost:27017/test';

var db = mongo.connect(url)

db.then(function(db){

	app.get('/restaurants', function(req,res) {
		console.log("Connected");
		var collection = db.collection('restaurants');

		var oFilter = filter(req);
		var limit = limitItems(req);
		var page = pagination(req);
		
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

	var routesCuisine = ['/restaurants/cuisine/:cuisine', '/restaurants/cuisine/not/:cuisine'];
	app.get(routesCuisine, function(req,res) {
		
		console.log("Connected");

		var collection = db.collection('restaurants');

		var cuisine = req.params.cuisine;

		var oFilter = filter(req);
		var limit = limitItems(req);
		var page = pagination(req);

		var path = req.path.split('/');

		if(path[3]==='not'){
			cuisine = {$ne: cuisine};
		}
		
		collection.find({cuisine: cuisine}, oFilter).skip(page).limit(limit).toArray(function(err, docs) {
			if (err) throw new Error("oops");
			res.json(docs);
			
		});

	});

	app.get('/restaurant/:id', function(req, res){
		console.log("Connected");

		var collection = db.collection('restaurants');

		var oFilter = filter(req);
		var limit = limitItems(req);
		var page = pagination(req);
		
		var id = req.params.id;		

		collection.find({_id: ObjectID(id)}, oFilter).skip(page).limit(limit).toArray(function(err, docs) {
			if (err) throw new Error("oops");
			res.json(docs);
			
		});
	})

	app.get('/restaurant/:id/around/:km', function(req, res){
		console.log("Connected");

		var collection = db.collection('restaurants');

		var oFilter = filter(req);
		var limit = limitItems(req);
		var page = pagination(req);
		
		var id = req.params.id;
		var km = req.params.km;

		var longitude = 0;
		var latitude = 0;
		
		collection.ensureIndex({ "address.coord":"2dsphere"}); 

		collection.find({_id: ObjectID(id)}).limit(1).toArray(function(err, docs) {
			if (err) throw new Error("oops");
			longitude = docs[0].address.coord[0];
			latitude = docs[0].address.coord[1];
			
			collection.find({
				"address.coord" : {
				    $near: {
				        $geometry: {
				            type: "Point" ,
				            coordinates: [ longitude , latitude ]
				        },
				        $maxDistance: km*1000
				    }
				}
			}, oFilter)
			.skip(page).limit(limit).toArray(function(err, docs) {
				if (err) throw new Error("oops");
				res.json(docs);
				
			});
		});
	});

	app.listen(3000, function() {
		console.log ("listening to port 3000");
	})

})
.catch(function(err) {
	throw new Error("something failed in the connection");
})