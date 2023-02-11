/**
 * Database management API
 * Will use SQLite3 for simplicity and portability
 * API will be RESTful
 */

// Import dependencies
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');

// create the express app
var app = express();
app.use(bodyParser.json());



// Create the database
var db = new sqlite3.Database('libraries.db');

// simple api
app.get('/api', function(req, res) {
    res.send('API is running');
});



// search for a library endpoint

app.get('/api/libraries/:query', function(req, res) {
    let query = req.params.query;
    let sql = `SELECT * FROM libraries WHERE name LIKE '%${query}%'`;

    // simply return the result
    db.all(sql, function(err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send('Error');
        }
        else if (rows.length === 0) {
            res.status(404).send('No libries found');
        }
         else {
            console.log(rows)
            res.json(rows);
        }
    });
});




// set port
app.set('port', (process.env.PORT || 4444));

// start the server
app.listen(app.get('port'), function() {
    console.log(`Node app is running on localhost:${app.get('port')}`);
});


