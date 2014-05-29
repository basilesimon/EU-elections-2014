/**
 * Script to fetch latest articles mentioning candidates, parties and regions to mongodb
 * @todo Add support for regions (need to add Juicer free text support to newsQuery)
 */

var Q = require('q');
var mongoJs = require('mongojs');
var csvtojson = require("csvtojson").core.Converter;
var crypto = require('crypto');
var fs = require("fs");
var moment = require("moment");
var config = require(__dirname + '/../config.json');
var euElectionCoverage = require(__dirname + '/../lib/eu-election-coverage.js');
var newsquery = require('newsquery')(config.bbcNewsLabs.apiKey);

GLOBAL.config = config;
GLOBAL.db = mongoJs.connect("127.0.0.1/eu-election-coverage", ["candidates", "parties", "regions", "concepts"]);

euElectionCoverage.getCandidates()
.then(function(candidates) {
    var promises = [];
    candidates.forEach(function(candidate, i) {
        if (!candidate.uri)
            return;
        var promise = newsquery.getArticlesByConcept(candidate.uri, 100)
        .then(function(articles) {
            console.log("Retreived "+articles.length+" articles mentioning "+candidate.uri);
            candidate.articles = articles
            return candidate;
        });
        promises.push(promise);
    });
    return Q.all(promises);
})
.then(function(candidates) {
    var promises = [];
    candidates.forEach(function(candidate, i) {
        promises.push( save('candidates', candidate) );
    });
    return Q.all(promises);
})
.then(function() {
    return euElectionCoverage.getParties()
})
.then(function(parties) {
    var promises = [];
    parties.forEach(function(party, i) {
        if (!party.uri)
            return;
        var promise = newsquery.getArticlesByConcept(party.uri, 100)
        .then(function(articles) {
            console.log("Retreived "+articles.length+" articles mentioning "+party.uri);
            party.articles = articles
            return party;
        });
        promises.push(promise);
    });
    return Q.all(promises);
})
.then(function(parties) {
    var promises = [];
    parties.forEach(function(party, i) {
        promises.push( save('parties', party) );
    });
    return Q.all(promises);
})
.then(function() {
    db.close();
});

function save(collection, record) {
    var deferred = Q.defer();
    db[collection].save(record, function(err, saved) {
        if (err || !saved)
            console.log("Could not save to collection '"+collection+"': "+err);
        deferred.resolve(record);
    });
    return deferred.promise;
}