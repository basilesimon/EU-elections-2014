/**
 * Script to preform initial import of data to mongodb
 */

var Q = require('q');
var mongoJs = require('mongojs');
var csvtojson = require("csvtojson").core.Converter;
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
    
    // Build list of canidates and parties
    candidates.forEach(function(candidate, i) {
        if (!regions[candidate.region])
            regions[candidate.region] = { _id: candidate.region, name: candidate.region, candidates: [], articles: [] };

        if (!parties[candidate.party])
            parties[candidate.party] = { _id: candidate.party, name: candidate.party, candidates: [], articles: [] };

        regions[candidate.region].candidates.push( candidate );
        parties[candidate.party].candidates.push( candidate );
        
        // Save each canidate to DB
        promises.push( savetoDb('candidates', candidate) );
    });

    // Save all regions to db
    Object.keys(regions).forEach(function(region) {
        promises.push( savetoDb('regions', regions[region]) );
    });
    
    // Save all parties to db
    Object.keys(parties).forEach(function(party) {
        promises.push( savetoDb('parties', parties[party]) );
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
    var csvFileName = "./data/candidates.csv";
    var fileStream = fs.createReadStream(csvFileName);
    var csvConverter = new csvtojson();
    csvConverter.on("end_parsed", function(candidates) {
        //party,region,Candidate,Twitter
        deferred.resolve(candidates);
    });
    fileStream.pipe(csvConverter);
    return deferred.promise;
}

function savetoDb(collection, record) {
    var deferred = Q.defer();
    db[collection].save(record, function(err, saved) {
        if (err || !saved)
            console.log("Could not save to collection '"+collection+"': "+err);

        deferred.resolve(record);
    });
    return deferred.promise;
}