/**
 * Script to preform initial import of data to mongodb
 */

var Q = require('q');
var mongoJs = require('mongojs');
var csvtojson = require("csvtojson").core.Converter;
var crypto = require('crypto');
var fs = require("fs");

GLOBAL.db = mongoJs.connect("127.0.0.1/eu-election-coverage", ["candidates", "parties", "regions", "concepts"]);

db.candidates.drop();
db.regions.drop();
db.parties.drop();

loadCandidatesFromCsv()
.then(function(candidates) {
    var promises = [];
    
    var regions = {};
    var parties = {};
    
    // Build list of candidates and parties
    candidates.forEach(function(candidate, i) {

        candidate._id = crypto.createHash('sha1').update( candidate.name+candidate.region+candidate.party ).digest("hex");
        
        if (!regions[candidate.region])
            regions[candidate.region] = { name: candidate.region, country: "United Kingdom", candidates: [], articles: [] };

        if (!parties[candidate.party])
            parties[candidate.party] = { name: candidate.party, candidates: [], articles: [] };

        regions[candidate.region].candidates.push( JSON.parse(JSON.stringify(candidate)) );
        parties[candidate.party].candidates.push( JSON.parse(JSON.stringify(candidate)) );
        
        // Save each candidate to DB
        candidate.country = "United Kingdom";
        candidate.articles = [];
        candidate.concepts = [];
        promises.push( save('candidates', candidate) );
    });

    // Save all regions to db
    Object.keys(regions).forEach(function(region) {
        promises.push( save('regions', regions[region]) );
    });
    
    // Save all parties to db
    Object.keys(parties).forEach(function(party) {
        promises.push( save('parties', parties[party]) );
    });
    
    return Q.all(promises);
})
.then(function() {
    db.parties.ensureIndex( { "name": 1 } );
    db.candidates.ensureIndex( { "name": 1 } );
    db.regions.ensureIndex( { "name": 1 } );
    db.close();
})
    
function loadCandidatesFromCsv() {
    var deferred = Q.defer();
    var csvFileName = "../data/candidates.csv";
    var fileStream = fs.createReadStream(csvFileName);
    var csvConverter = new csvtojson();
    csvConverter.on("end_parsed", function(candidates) {
        //party,region,Candidate,Twitter
        deferred.resolve(candidates);
    });
    fileStream.pipe(csvConverter);
    return deferred.promise;
}

function save(collection, record) {
    var deferred = Q.defer();
    db[collection].save(record, function(err, saved) {
        if (err || !saved)
            console.log("Could not save to collection '"+collection+"': "+err);

        deferred.resolve(record);
    });
    return deferred.promise;
}