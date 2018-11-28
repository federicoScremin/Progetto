// server.js

// set up
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration and connection to mongoDB database
mongoose.connect('mongodb://localhost:27017/zero12_db', {useNewUrlParser: true}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(express.static(__dirname + '/public')); // set the static files location
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// define model
var Temperature = mongoose.model('Temperature', {
    Value: String,
    Timestamp: String
});


// ROUTES API
// get all temperatures
app.get('/api/temperatures', function(req, res) {
    // use mongoose to get all temperatures in the database
    Temperature.find(function(err, temperatures) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(temperatures); // return all temperatures in JSON format
    });
});

// create temperature and send back all temperatures after creation
app.post('/api/temperatures', function(req, res) {
    // create a temperature, information comes from AJAX request from Angular
    Temperature.create({
        Value : req.body.Value,
        Timestamp : req.body.Timestamp
    }, function(err, temperature) {
        if (err)
            res.send(err);
        // get and return all the temperatures after you create another
        Temperature.find(function(err, temperatures) {
            if (err)
                res.send(err)
            res.json(temperatures);
        });
    });

});

// delete a temperature
app.delete('/api/temperatures/:temperatures_id', function(req, res) {
    Temperature.deleteOne({
        _id : req.params.temperatures_id
    }, function(err, temperature) {
        if (err)
            res.send(err);
        // get and return all the temperatures after you create another
        Temperature.find(function(err, temperatures) {
            if (err)
                res.send(err)
            res.json(temperatures);
        });
    });
});


// application
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


// listen (start app with node server.js)
app.listen(8080);
console.log("Server listening on port 8080");
