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