var express = require('express');
var router = express.Router();

var limitItems = require('../helpers/limitItems');
var pagination = require('../helpers/pagination');
var filter = require('../helpers/filter');

function routes(db) {

	router.get('/restaurants', function(req,res) {
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

	router.get('/restaurants/borough/:borough', function(req,res) {
		
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

	var routerCuisine = ['/restaurants/cuisine/:cuisine', '/restaurants/cuisine/not/:cuisine'];
	router.get(routerCuisine, function(req,res) {
		
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

	router.get('/restaurant/:id', function(req, res){
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
	});

	router.get('/restaurant/:id/around/:km', function(req, res){
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

	return router;
}

module.exports = routes;