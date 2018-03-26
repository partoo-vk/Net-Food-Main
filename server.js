const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://ApertureScience:ApertureScience1@ds121589.mlab.com:21589/aperture_science";


var posts = [ {recipeId: "a" , name: "onion soup", ingredients: [], rating: 0, image: "url", url: "url"} ];

var ObjectId = require('mongodb').ObjectID;

MongoClient.connect(url, function(err,res){
        if(err) console.log(err)
        console.log("Database created\n\n");
        client = res
        db = client.db("aperture_science");






	app.get('/recipes', function(req, res) {
		db.collection("recipes").find({}).toArray(function(error, result){
			res.send(result);
		});

	});

	app.get('/blacklist', function(req, res) {
                db.collection("blacklist").find({}).toArray(function(error, result){
                        res.send(result);
                });

        });


	app.post('/recipes', function(req, res) {
		db.collection("recipes").insert(req.body, function(err, result){});
		res.send("Added new recipe");
	});

	app.post('/blacklist', function(req, res) {
                db.collection("blacklist").insert(req.body, function(err, result){});
                res.send("Blacklisted");
        });


	app.put('/recipes/:recipeId', function(req, res) {
		// NEEDS TO BE TESTED

		// remove by id
		db.collection("recipes").remove( {"_id": ObjectId(req.params.recipe$
		// add new object
                db.collection("recipes").insert(req.body, function(err, result){});

                res.send("Updated recipe");
	});

	app.delete('/recipes/:recipeId', function(req, res) {

		db.collection("recipes").remove( {"_id": ObjectId(req.params.recipeId)}, function(req, res) {});
		res.send("Removed recipe with id: " + req.params.recipeId);
	});

	app.delete('/blacklist/:entry', function(req, res) {
		db.collection("blacklist").remove( {"entry": req.params.entry});
                res.send("Removed blacklist entry: " + req.params.entry);

	});

	app.listen(3000);


});
