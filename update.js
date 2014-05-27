var Q = require('q');
var mongoJs = require('mongojs');
var csvtojson = require("csvtojson").core.Converter;
var crypto = require('crypto');
var fs = require("fs");
var config = require(__dirname + '/config.json');
var euElectionCoverage = require(__dirname + '/lib/eu-election-coverage.js');
var newsquery = require('newsquery')(config.bbcNewsLabs.apiKey);

GLOBAL.config = config;
GLOBAL.db = mongoJs.connect("127.0.0.1/eu-election-coverage", ["candidates", "parties", "regions", "concepts"]);

euElectionCoverage.getCandidates()
.then(function(candidates) {
    var promises = [];
    candidates.forEach(function(candidate, i) {
        if (!candidate.uri)
            return;
        var promise = newsquery.getRelatedConcepts(candidate.uri, 100)
        .then(function(concepts) {
            console.log("Retreived "+concepts.length+" concepts related to "+candidate.uri);
            candidate.concepts = concepts;
            return save('candidates', candidate);
        });
        promises.push(promise);
    });
    return Q.all(promises);
})
.then(function() {
   return euElectionCoverage.getCandidates();
})
.then(function(candidates) {
    var promises = [];
    candidates.forEach(function(candidate, i) {
        if (candidate.concepts.length == 0)
            return;
        var promise = getDetailedConcepts(candidate.concepts)
        .then(function(detailedConcepts) {
            candidate.concepts = detailedConcepts;
            return candidate;
        });
        promises.push(promise);
    });
    return Q.all(promises);
})
.then(function(candidates) {
    console.log(candidates);
    var promises = [];
    candidates.forEach(function(candidate, i) {
        promises.push( save('candidates', candidate) );
    });
    return Q.all(promises);
})

.then(function() {
   return euElectionCoverage.getCandidates();
})
.then(function(candidates) {
    var promises = [];
    candidates.forEach(function(candidate, i) {
        if (!candidate.uri)
            return;
        var promise = newsquery.getArticlesByConcept(candidate.uri, 100)
        .then(function(articles) {
            console.log("Retreived "+articles.length+" articles mentioning "+candidate.uri);
            candidate.articles = articles;
            return save('candidates', candidate);
        });
        promises.push(promise);
    });
    return Q.all(promises);
})
// .then(function() {
//    return euElectionCoverage.getparties();
// })
// .then(function(parties) {
//     var promises = [];
//     parties.forEach(function(party, i) {
//         if (!party.uri)
//             return;    
//         var promise = newsquery.getArticlesByConcept(party.uri, 100)
//         .then(function(articles) {
//             console.log("Retreived "+articles.length+" articles mentioning "+party.uri);
//             party.articles = articles;
//             return save('candidates', party);
//         });
//         promises.push(promise);
//     });
//     return Q.all(promises);
// })
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

function getDetailedConcepts(concepts) {
    var promises = [];
    concepts.forEach(function(concept, i) {
        var promise = newsquery.getConcept(concept.uri, 1)
        .then(function(detailedConcept) {
            console.log(detailedConcept);
            if (detailedConcept.type)
                concept.type = detailedConcept.type;
            if (detailedConcept.description)
                concept.description = detailedConcept.description;
            return concept;
        });
        promises.push(promise);
    });
    return Q.all(promises);
}