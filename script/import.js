/**
 * Script to do initial import of candidates, parties and regions to mongodb
 */

var Q = require('q');
var mongoJs = require('mongojs');
var csvtojson = require("csvtojson").core.Converter;
var crypto = require('crypto');
var fs = require("fs");

GLOBAL.db = mongoJs.connect("127.0.0.1/eu-election-coverage", ["candidates", "parties", "regions", "concepts"]);
GLOBAL.gParties = {};

db.candidates.drop();
db.regions.drop();
db.parties.drop();

loadCsv("../data/candidates.csv")
.then(function(candidates) {
    console.log("Importing candidiates...");
    var promises = [];
    
    var regions = {};
    
    // Build list of candidates and parties
    candidates.forEach(function(candidate, i) {
        console.log("Importing "+candidate.name+"...");
        
        candidate._id = crypto.createHash('sha1').update( candidate.name+candidate.party+candidate.region ).digest("hex");
        var partyId = crypto.createHash('sha1').update( candidate.party ).digest("hex");;
        
        if (!regions[candidate.region])
            regions[candidate.region] = { name: candidate.region, country: "United Kingdom", candidates: [], articles: [] };
        
        if (!gParties[candidate.party])
            gParties[candidate.party] = { _id: partyId, name: candidate.party, candidates: [], articles: [] };

        regions[candidate.region].candidates.push( candidate );
        gParties[candidate.party].candidates.push( candidate );
        
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
    Object.keys(gParties).forEach(function(party) {
        promises.push( save('parties', gParties[party]) );
    });
    
    return Q.all(promises);
})
.then(function() {
    return loadCsv("../data/parties.csv");
})
.then(function(parties) {
    console.log("Importing parties...");
    var promises = [];
    // Build list of candidates and parties
    parties.forEach(function(party, i) {
        if (gParties[party.name]) {;
            console.log("Importing info for "+party.name+"...");
            gParties[party.name].uri = party.uri;
            promises.push( save('parties', gParties[party.name]) );
        }
    });
    return Q.all(promises);
})
.then(function() {
    db.parties.ensureIndex( { "name": 1 } );
    db.candidates.ensureIndex( { "name": 1 } );
    db.regions.ensureIndex( { "name": 1 } );
    db.close();
})
    
function loadCsv(filename) {
    var deferred = Q.defer();
    var fileStream = fs.createReadStream(filename);
    var csvConverter = new csvtojson();
    csvConverter.on("end_parsed", function(candidates) {
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