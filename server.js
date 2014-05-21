/**
 * BBC News Labs - European Election Data Insight
 */

var express = require('express');
var partials = require('express-partials');
var ejs = require('ejs');
var mongoJs = require('mongojs');
var Q = require('q');
var dateFormat = require('dateformat');
var fs = require('fs');

GLOBAL.db = mongoJs.connect("127.0.0.1/eu-bbc-news-labs", ["candidates", "parties", "concepts", "regions"]);

// Initialise and configure Express and Express Partials
var app = express();
// Allows all JSON files (e.g. map GeoJSON) to be accessed from any domain
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.use(express.static(__dirname + '/public'))
app.use(partials());
app.set('title', 'BBC News Labs');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', ejs.__express);
partials.register('.ejs', ejs);

/**
 * Get all candidates
 */
app.get('/uk/candidates', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Get detailed candidate info by candidate name
 */
app.get('/uk/candidates/:name', function(req, res, next) {
    var candidate = req.params.candidate;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Get all parties
 */
app.get('/uk/parties', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Get detailed party info by party name
 */
app.get('/uk/parties/:name', function(req, res, next) {
    var party = req.params.party;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Get regions
 */
app.get('/uk/regions', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Get regional candidates
 */
app.get('/uk/:region/candidates', function(req, res, next) {
    var region = req.params.region;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Get regional parties
 */
app.get('/uk/:region/parties', function(req, res, next) {
    var region = req.params.region;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Get regional articles
 */
app.get('/uk/:region/articles', function(req, res, next) {
    var region = req.params.region;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Handle all other requests as 404 / Page Not Found errors
 */
app.use(function(req, res, next) {
    res.status(404).render('page-not-found', { title: "Page not found" });
});

app.listen(3001);