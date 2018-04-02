const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');

const session = require('express-session');
 app.use(cookieparser());
        
 app.use(session({secret:'anyStringOfText',
                    saveUnInitialized: true,
                    resave: true }));

var bodyParser = require('body-parser');
app.use(bodyParser());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://ApertureScience:ApertureScience1@ds121589.mlab.com:21589/aperture_science";

var ObjectId = require('mongodb').ObjectID;
var path = require('path')
MongoClient.connect(url, function(err,res){
        if(err) console.log(err)
        console.log("Database created\n\n");
        client = res
        db = client.db("aperture_science");

	app.use(express.static(path.join(__dirname, 'public')));
		
	app.get('/', function(req, res) {
		
		res.sendfile('login.html');
		
	});

	app.get('/logout', function(req, res) {

		delete req.session.user;
		res.redirect('/');
		
	});

	app.get('/home', function(req, res) {
		if (!req.session.user) {
			console.log("not user")
			res.redirect('/')
		}
		else{
		res.sendfile('index.html');
		}
	});
	
	app.get('/flush', function(req, res) {
		db.collection("recipes").remove({});
		db.collection("blacklist").remove({});
		db.collection("logins").remove({});
		res.send("Database Flushed");
	});

	app.get('/recipes', function(req, res) {
		db.collection("recipes").find({}).toArray(function(error, result){
			res.send(result);
		});

	});
	
	app.get('/recipes/:recipeId/ingredients', function(req, res) {
		db.collection("recipes").find({"_id": ObjectId(req.params.recipeId)}).toArray(function(error, result) {
				res.send(result[0]["ingredients"]);
		});
	});

	app.get('/blacklist', function(req, res) {
                db.collection("blacklist").find({}).toArray(function(error, result){
                        res.send(result);
                });

        });

	app.get('/logins', function(req, res) {
                db.collection("logins").find({}).toArray(function(error, result){
                        res.send(result);
                });

        });

	app.post('/authenticate', function(req, res) {

		
		
		var username = req.body.username;
		var password = req.body.password;

		db.collection("logins").findOne({"username": username, "password": password}, function(err, user){
			if (!user) {
				res.send("Invalid");
			}
			else {
				req.session.user =user;
				res.send("Valid");
			}
		});
	});


	app.get('/logins/:username', function(req, res) {
		var username = req.params.username;

		db.collection("logins").findOne({"username": username}, function(err, user){
			if (!user) {
				res.send("Available")
			}
			else {
				res.send("Taken")
			}
		})
	});
	
	app.get('/blacklist/:entry', function(req, res) {
		var entry = req.params.entry;
		db.collection("blacklist").findOne({"entry": entry}, function(err, thing){
			if (!thing) {
					res.send("Clean");
			}
			else {
					res.send("Blocked");
			}
		})
		
		
	})

	app.post('/recipes', function(req, res) {
		db.collection("recipes").insert(req.body, function(err, result){});
		res.send("Added new recipe");
	});

	app.post('/blacklist', function(req, res) {
                db.collection("blacklist").insert(req.body, function(err, result){});
                res.send("Blacklisted");
        });


	app.post('/logins', function(req, res) {
                db.collection("logins").insert(req.body, function(err, result){});
                res.send("Login Created");
        });

	app.put('/recipes/:recipeId', function(req, res) {

		// NOTE: If you are updating a Yummly recipe, you need to blacklist it in a separate command.
		// 	 The updated version will be stored here, and the original recipe will be blacklisted.
		// remove by id
		db.collection("recipes").remove( {"_id": ObjectId(req.params.recipeId)}, function(err, result) {

		// add new object
                db.collection("recipes").insert(req.body, function(err, result){

                res.send("Updated recipe");

		});

		});
	});

	app.put('/logins/:username', function(req, res) {

                // remove by username
                db.collection("logins").remove( {"username": req.params.username }, function(err, result) {
                // add new object
                db.collection("logins").insert(req.body, function(err, result){});

                res.send("Updated password");

		});
        });


	app.delete('/recipes/:recipeId', function(req, res) {

		db.collection("recipes").remove( {"_id": ObjectId(req.params.recipeId)}, function(req, res) {});
		res.send("Removed recipe with id: " + req.params.recipeId);
	});

	app.delete('/blacklist/:entry', function(req, res) {
		db.collection("blacklist").remove({"entry": req.params.entry});
                res.send("Removed blacklist entry: " + req.params.entry);

	});

	app.delete('/logins/:username', function(req, res) {
                db.collection("logins").remove( {"username": req.params.username});
                res.send("Removed user: " + req.params.entry);

        });

	app.listen(3000);


});
