var Q = require('q');
var request = require('request');
var newsquery = require('newsquery');
var moment = require('moment');

module.exports = new function() {

    /**
     * 
     */
    this.getParties = function(country, region) {
        var deferred = Q.defer();
        var query = {};
        if (country)
            query.country = country;
        if (region)
            query.region = region;
        db.parties.find({ '$query': query, '$orderby': { name: 1 } }, function(err, parties) {
            deferred.resolve(parties);
        });
        return deferred.promise;
    }

    /**
     *
     */
    this.getCandidates = function(country, region) {
        var deferred = Q.defer();
        var query = {};
        if (country)
            query.country = country;
        if (region)
            query.region = region;
        db.candidates.find({ '$query': query, '$orderby': { name: 1 } }, function(err, candidates) {
            deferred.resolve(candidates);
        });
        return deferred.promise;
    }
    
    /**
     *
     */
    this.getRegions = function(country) {
        var deferred = Q.defer();
        if (country)
            query.country = country;
        db.regions.find({ '$query': {}, '$orderby': { name: 1 } }, function(err, regions) {
            deferred.resolve(regions);
        });
        return deferred.promise;
    }

    /**
     *
     */
    this.getArticlesByConcept = function(conceptUri, startDate, endDate) {
        var deferred = Q.defer();
        newsquery.getArticlesByConcept(conceptUri, startDate, endDate)
        then(function(articles) {
            deferred.resolve(articles);
        });
        return deferred.promise;
    }

    /**
     *
     */
    this.getArticlesByKeyword = function(keywords, startDate, endDate) {
        var deferred = Q.defer();
        newsquery.getArticlesByKeyword(keywords, startDate, endDate)
        then(function(articles) {
            deferred.resolve(articles);
        });
        return deferred.promise;
    }

    /**
     *
     */
    this.getConceptByName = function(conceptName, conceptType) {
        var deferred = Q.defer();
        newsquery.getConceptByUri(conceptName, conceptType)
        then(function(concept) {
            deferred.resolve(concept);
        });
        return deferred.promise;
    }

    /**
     *
     */
    this.getConceptByUri = function(conceptUri) {
        var deferred = Q.defer();
        newsquery.getConceptByUri(conceptUri)
        then(function(concept) {
            deferred.resolve(concept);
        });
        return deferred.promise;
    }
    
    /**
      * Possible response is object of concept URIs, each of which is an array
      * of objects containing a date and the number of occurences for that tag
      * on that date, for every date in the date range.
      * (Only possible format - TBD)
      * concepts[conceptUri] = [ { date: "YYY-MM-DD", occurrences: 5 },
                                 { date: "YYY-MM-DD", occurrences: 10 }]
      */
    this.getRelatedConceptsMentionsOverTime = function(conceptUri, startDate, endDate) {
        var promises = [];
        // @todo Populate array with date range using moment
        var dates = [];
        dates.forEach(function(date) {
            var date = dates[i];
            // @todo Get mentions of concept on every day in date
        });
        return Q.all(promises);
    }

};