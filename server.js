const express = require('express');
const app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://ApertureScience:ApertureScience1@ds121589.mlab.com:21589/aperture_science";


var posts = [ {user: "me", text: "ha"} ];
MongoClient.connect(url, function(err,res){
        if(err) console.log(err)
        console.log("Database created\n\n");
        client = res
        db = client.db("csc309db");






	app.get('/recipes', function(req, res) {
	});


	app.post('/recipes', function(req, res) {

	});


	app.put('/recipes/:recipeId', function(req, res) {

	});

	app.delete('/recipes/:recipeId', function(req, res) {

	});

	app.listen(3000);


});
