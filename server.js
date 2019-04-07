// Get dependencies
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// Get routes
const artist = require('./routes/artist');

// Define port
const port = 8000;

// Ready app up for json format
app.use(bodyParser.json());


app.get('/', function(req, res) {
	res.send('Welcome to Cygni code test!');
});

// Use routes
app.use('/artist', artist);

// Run on defined port
app.listen(port, function() {
	console.log('running on port 8000.');
});