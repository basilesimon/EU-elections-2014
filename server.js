/**
 * BBC News Labs - European Election Coverage Insight
 */

var express = require('express');
var partials = require('express-partials');
var ejs = require('ejs');
var mongoJs = require('mongojs');
var Q = require('q');
var fs = require('fs');
var config = require(__dirname + '/config.json');
var euElectionCoverage = require(__dirname + '/lib/eu-election-coverage.js');

GLOBAL.config = config;
GLOBAL.db = mongoJs.connect("127.0.0.1/eu-election-coverage", ["candidates", "parties", "regions", "concepts"]);

// Initialise and configure Express and Express Partials
var app = express();
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

app.get('/candidates', function(req, res, next) {
    euElectionCoverage.getCandidates()
    .then(function(candidates) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(candidates);
    });
});

app.get('/parties', function(req, res, next) {
    euElectionCoverage.getParties()
    .then(function(parties) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(parties);
    });
});


app.get('/candidate/:id', function(req, res, next) {
    var candidateId = req.params.id;
    euElectionCoverage.getCandidateById(candidateId)
    .then(function(candidates) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(candidates);
    });
});

/**
 * Get regions
 */
app.get('/:country/regions', function(req, res, next) {
    var country = req.params.country.replace(/_/g, ' ');
    euElectionCoverage.getRegions(country)
    .then(function(regions) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(regions);
    });
});

/**
 * Get region
 */
app.get('/:country/:region', function(req, res, next) {
    var country = req.params.country.replace(/_/g, ' ');
    var region = req.params.region.replace(/_/g, ' ');
    euElectionCoverage.getRegion(country, region)
    .then(function(region) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(region);
    });
});


app.get('/:country/:region/candidates', function(req, res, next) {
    var country = req.params.country.replace(/_/g, ' ');
    var region = req.params.region.replace(/_/g, ' ');
    euElectionCoverage.getCandidates(country, region)
    .then(function(candidates) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(candidates);
    });
});

app.get('/:country/candidates', function(req, res, next) {
    var country = req.params.country.replace(/_/g, ' ');
    euElectionCoverage.getCandidates(country)
    .then(function(candidates) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(candidates);
    });
});

/**
 * Get regional parties
 */
app.get('/:country/:region/parties', function(req, res, next) {
    var region = req.params.region;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send( JSON.stringify() );
});

/**
 * Get regional articles
 */
app.get('/:country/:region/articles', function(req, res, next) {
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

app.listen(3103);