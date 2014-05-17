/**
 * @name	newslabsApi
 * @date	May 16th 2014, 11:03:30 am
 *
 * Note: This library requires jQuery
 *
 * @example
 *
 * This library provides the following methods:
 *
 *	newslabsApi.findCreativeWorksGeoMultiHop(aboutTagType, aboutTagPredicate, aboutTagObject, point, radius, limit, offset)
 *	newslabsApi.getConcept(uri, limit)
 *	newslabsApi.findCreativeWorks(tag, product, tagop, limit, offset)
 *	newslabsApi.findCreativeWorksGeospatial(point, radius, limit, offset)
 *	newslabsApi.getTheGraphOfAStorylineOrEvent(uri)
 *	newslabsApi.getFacetsForFullTextSearch(q, faceton, limit)
 *	newslabsApi.findCreativeWorksUsingSpecialisedTags(tag, after, limit, offset)
 *	newslabsApi.findTaggedConceptsFilteredByType(q, _class, limit)
 *	newslabsApi.getACreativeWork(uri)
 *	newslabsApi.findConceptOccurrences(limit, after, type)
 *	newslabsApi.findsThingsInTheKnowledgeBase(tag, limit)
 *	newslabsApi.findConceptCoOccurrences(uri, type, limit, after)
 *	newslabsApi.fullTextSearchCreativeWorks(q, highlightclass)
 *	newslabsApi.findTaggedConcepts(q, limit)
 *	newslabsApi.findsThingsByTypeInTheKnowledgeBase(tag, _class, limit, after)
 *	newslabsApi.findCreativeWorksMultiHop(aboutTagType, aboutTagPredicate, aboutTagObject, limit, offset)
 *
 */
var newslabsApi = new function() {

  /**
   * You need to configure these options to use this library
   */
  this.options = {
    "host":	"http://data.bbc.co.uk/v1/bbcrd-newslabs",
    "apikey":	"9OHbOpZpVh9tQZBDjwTlTmsCF2Ce0yGQ"
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * A geospatial multi-hop semantic search for creative work via the
   * graph of tagged concepts with a radius of some location.
   *
   * Combining geospatial with graph search.
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>about-tag-type</b>: Ontology class URI, find creative works by
   * the type (class) of thing they are tagged with, eg
   * http://dbpedia.org/ontology/Person</li>
   *
   * <li><b>about-tag-predicate</b>: Ontology predicate URI - find
   * creative works tagged with concepts that have wider associations with
   * this predicate. eg http://dbpedia.org/ontology/party</li>
   *
   * <li><b>about-tag-object</b>: Concept URI - find creative works tagged
   * with concepts that have wider associations where the
   * about-tag-predicate is associated with this object/concept. eg
   * http://dbpedia.org/resource/Conservative_Party_(UK)</li>
   *
   * <li><b>point</b>: {lat,long}, eg:  51.5,-1.0</li>
   *
   * <li><b>radius</b>: {Nmi|km}, eg 10mi , 20km</li>
   *
   * <li><b>limit</b> : integer - max number of articles to return,
   * default 10</li>
   *
   * <li><b>offset</b> : integer - offset to start results from to allow
   * for paging / infinite scroll</li>
   *
   * <li><b>before</b>: optional date in YYYY-MM-DD format defining the
   * date before which articles were published</li>
   *
   * <li><b>after</b>: optional date in YYYY-MM-DD format defining the
   * date after which articles were published</li>
   *
   * <li><b>product</b> : optional filter by bbc:product URI</li>
   *
   * </ul>
   *
   * <p>Headers are:<p>
   *
   * <ul>
   *
   * <li>Accept: application/json | application/ld+json</li>
   *
   * @param	{string}	aboutTagType	
   * @param	{string}	aboutTagPredicate	
   * @param	{string}	aboutTagObject	
   * @param	{string}	point	
   * @param	{string}	radius	
   * @param	{string}	limit	
   * @param	{string}	offset	
   */
  this.findCreativeWorksGeoMultiHop = function(aboutTagType, aboutTagPredicate, aboutTagObject, point, radius, limit, offset) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/creative-works",
      data:	{
        "about-tag-type": aboutTagType,
        "about-tag-predicate": aboutTagPredicate,
        "about-tag-object": aboutTagObject,
        "point": point,
        "radius": radius,
        "limit": limit,
        "offset": offset,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * Gets a concept from the knowledge base, and the most recent creative
   * works tagged with it.
   *
   * <br/>Parameters :
   *
   * <ul>
   *
   * <li><b>uri</b> : The URI of the concept to retrieve</li>
   *
   * <li><b>limit</b> : integer - max number of creative works to
   * return</li>
   *
   * <li><b>product</b> : filter creative works by bbc:product URI</li>
   *
   * </ul>
   *
   * @param	{string}	uri	
   * @param	{string}	limit	
   */
  this.getConcept = function(uri, limit) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/concepts",
      data:	{
        "uri": uri,
        "limit": limit,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * A semantic search for creative work using tagged concepts
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>tag</b>: URI of a concept - multiple tag parameters can be
   * used</li>
   *
   * <li><b>tagop</b> : {and | or | fingerprint} The operations to apply
   * to the supplied tags. Default is 'and'. 'fingerprint' returns
   * creative works best matching the set of tags supplied. (Warning
   * fingerprint search is not fast!)</li>
   *
   * <li><b>limit</b> : integer - max number of articles to return,
   * default 10</li>
   *
   * <li><b>offset</b> : integer - offset to start results from to allow
   * for paging / infinite scroll</li>
   *
   * <li><b>before</b>: optional date in YYYY-MM-DD format defining the
   * date before which articles were published</li>
   *
   * <li><b>after</b>: optional date in YYYY-MM-DD format defining the
   * date after which articles were published</li>
   *
   * <li><b>product</b> : optional filter by bbc:product URI</li>
   *
   * </ul>
   *
   * <p>Headers are:<p>
   *
   * <ul>
   *
   * <li>Accept: application/json | application/ld+json</li>
   *
   * @param	{string}	tag	
   * @param	{string}	product	
   * @param	{string}	tagop	
   * @param	{string}	limit	
   * @param	{string}	offset	
   */
  this.findCreativeWorks = function(tag, product, tagop, limit, offset) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/creative-works",
      data:	{
        "tag": tag,
        "product": product,
        "tagop": tagop,
        "limit": limit,
        "offset": offset,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * A geospatial semantic search for creative work. Finds creative works
   * tagged with places with a radius of a supplied latitude and
   * longitude.
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>point</b>: {lat,long}, eg:  51.5,-1.0</li>
   *
   * <li><b>radius</b>: {Nmi|km}, eg 10mi , 20km</li>
   *
   * <li><b>limit</b> : integer - max number of articles to return,
   * default 10</li>
   *
   * <li><b>offset</b> : integer - offset to start results from to allow
   * for paging / infinite scroll</li>
   *
   * <li><b>before</b>: optional date in YYYY-MM-DD format defining the
   * date before which articles were published</li>
   *
   * <li><b>after</b>: optional date in YYYY-MM-DD format defining the
   * date after which articles were published</li>
   *
   * <li><b>product</b> : optional filter by bbc:product URI</li>
   *
   * </ul>
   *
   * <p>Headers are:<p>
   *
   * <ul>
   *
   * <li>Accept: application/json | application/ld+json</li>
   *
   * @param	{string}	point	
   * @param	{string}	radius	
   * @param	{string}	limit	
   * @param	{string}	offset	
   */
  this.findCreativeWorksGeospatial = function(point, radius, limit, offset) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/creative-works",
      data:	{
        "point": point,
        "radius": radius,
        "limit": limit,
        "offset": offset,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	April 30th 2014, 5:46:43 pm
   *
   * @description
   *
   * Retrieves the wider graph of any given storyline or event, pulling
   * together all the slots and arrangements of the associated events and
   * storylines to the supplied one, along with concepts and associated
   * creative works<br/>
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>uri</b>: URI of a storyline or event</li>
   *
   * </ul>
   *
   * @param	{string}	uri	
   */
  this.getTheGraphOfAStorylineOrEvent = function(uri) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/storylines/graphs",
      data:	{
        "uri": uri,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * Retrieve a set of facets for a search projection. Pass in the same
   * search phrase and filters as for a full text search request, and a
   * property to facet on, and get a list of the most frequently occurring
   * facets for that facet type.
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>facetOn</b>: A facet type property,options are <br/>
   *
   * http://www.bbc.co.uk/ontologies/creativework/facetPerson<br/>
   *
   * http://www.bbc.co.uk/ontologies/creativework/facetPlace<br/>
   *
   * http://www.bbc.co.uk/ontologies/creativework/facetOrganisation<br/>
   *
   * http://www.bbc.co.uk/ontologies/creativework/primaryFormat<br/>
   *
   * http://www.bbc.co.uk/ontologies/bbc/product
   *
   * </li>
   *
   * <li><b>q</b>: A full text search phrase</li>
   *
   * <li><b>facetFilter</b>: optional URI of a facet to filter a results
   * projection on (multiple can be
   *
   * applied), e.g. http://www.bbc.co.uk/ontologies/bbc/NewsWeb or
   * http://dbpedia.org/resource/David_Cameron</li>
   *
   * <li><b>highlightClass</b>: optional CSS class name applied to the
   * search results 'snippet' span element</li>
   *
   * <li><b>before</b>: optional date in YYYY-MM-DD format defining the
   * date before which articles were published</li>
   *
   * <li><b>after</b>: optional date in YYYY-MM-DD format defining the
   * date after which articles were published</li>
   *
   * <li><b>limit</b> : integer - max number of facet instances to return,
   * default 10</li>
   *
   * </ul>
   *
   * @param	{string}	q	
   * @param	{string}	faceton	
   * @param	{string}	limit	
   */
  this.getFacetsForFullTextSearch = function(q, faceton, limit) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/creative-works/search/facets",
      data:	{
        "q": q,
        "facetOn": faceton,
        "limit": limit,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * A semantic search for creative work using specialised tagged concepts
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>tag</b>: {predicate},{URI} a specialised tag predicate and the
   * tag URI- multiple tag parameters can be used, eg
   * explains,http://www.bbc.co.uk/things/3240b605-c2dd-41ac-95f1-5ae6c28a2ecb</li>
   *
   * <li><b>tagop</b> : {and | or | fingerprint} The operations to apply
   * to the supplied tags. Default is 'and'. 'fingerprint' returns
   * creative works best matching the set of tags supplied. (Warning
   * fingerprint search is not fast!)</li>
   *
   * <li><b>limit</b> : integer - max number of articles to return,
   * default 10</li>
   *
   * <li><b>offset</b> : integer - offset to start results from to allow
   * for paging / infinite scroll</li>
   *
   * <li><b>before</b>: optional date in YYYY-MM-DD format defining the
   * date before which articles were published</li>
   *
   * <li><b>after</b>: optional date in YYYY-MM-DD format defining the
   * date after which articles were published</li>
   *
   * <li><b>product</b> : optional filter by bbc:product URI</li>
   *
   * </ul>
   *
   * <p>The possible specialised tag predicates are :<br/>
   *
   * about, mentions, explains, factAbout, questionAbout, answerAbout,
   * profileOf, attributableTo, analysisOf, opinionOn, commentOn</p>
   *
   * <p>Headers are:<p>
   *
   * <ul>
   *
   * <li>Accept: application/json | application/ld+json</li>
   *
   * @param	{string}	tag	
   * @param	{string}	after	
   * @param	{string}	limit	
   * @param	{string}	offset	
   */
  this.findCreativeWorksUsingSpecialisedTags = function(tag, after, limit, offset) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/creative-works",
      data:	{
        "tag": tag,
        "after": after,
        "limit": limit,
        "offset": offset,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * Finds tagged concepts in the knowledge base filtered by type. Typical
   * use-case is type-ahead search
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>q</b> : string - a full text search term</li>
   *
   * <li><b>limit</b> : integer - max num of concepts to return</li>
   *
   * <li><b>class</b>: optional URI defining the ontology class to filter
   * concepts on</li>
   *
   * </ul>
   *
   * <p>Response is in OpenSearch Suggestions 1.1 JSON format</p>
   *
   * 
   *
   * @param	{string}	q	
   * @param	{string}	_class	
   * @param	{string}	limit	
   */
  this.findTaggedConceptsFilteredByType = function(q, _class, limit) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/concepts/tagged",
      data:	{
        "q": q,
        "class": _class,
        "limit": limit,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * Gets a creative work by its URI
   *
   * @param	{string}	uri	
   */
  this.getACreativeWork = function(uri) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/creative-works",
      data:	{
        "uri": uri,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	April 30th 2014, 5:43:34 pm
   *
   * @description
   *
   * Finds most frequently tagged concepts in the knowledge base.
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>limit</b> : integer - max num of concepts to return</li>
   *
   * <li><b>type</b>: optional URI defining the ontology class to filter
   * concepts on</li>
   *
   * <li><b>before</b>: date in YYYY-MM-DD format defining the date before
   * which tag frequencies should be calculated</li>
   *
   * <li><b>after</b>: date in YYYY-MM-DD format defining the date after
   * which tag frequencies should be calculated</li>
   *
   * </ul>
   *
   * NOTE, quite a heavy weight query so don't expect this to be rocket
   * fast, please keep date ranges narrow.
   *
   * @param	{string}	limit	
   * @param	{string}	after	
   * @param	{string}	type	
   */
  this.findConceptOccurrences = function(limit, after, type) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/concepts/occurrences",
      data:	{
        "limit": limit,
        "after": after,
        "type": type,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * Polymoprhic Search, finds Creative Works, Storylines and Events in
   * the KB.<br/>
   *
   * Storylines and Events a returned with associated concepts, and the
   * Creative Works tagged with them<br/>
   *
   * Creative Works are returned with the concepts they are tagged
   * with.<br/>
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>tag</b>: URI of a concept that things might be tagged with -
   * multiple tags can be specified</li>
   *
   * <li><b>tagop</b>: boolean operand {and | or} applied to specified
   * tags (AND is default)</li>
   *
   * <li><b>limit</b> : integer - max num of things to return</li>
   *
   * <li><b>before</b>: date in YYYY-MM-DD format defining the date before
   * which articles were published</li>
   *
   * <li><b>after</b>: date in YYYY-MM-DD format defining the date after
   * which articles were published</li>
   *
   * <li><b>product</b> : filter by bbc:product URI</li>
   *
   * </ul>
   *
   * <p>Warning !!- stick to relatively tight date ranges (1 to 2 months),
   * as this is heavyweight and could perform poorly over long time
   * periods</p>
   *
   * @param	{string}	tag	
   * @param	{string}	limit	
   */
  this.findsThingsInTheKnowledgeBase = function(tag, limit) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/things",
      data:	{
        "tag": tag,
        "limit": limit,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * Finds most frequently tagged concepts in the knowledge-base
   * co-occurring with a supplied source concept
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>uri</b>: URI of source concept</li>
   *
   * <li><b>limit</b> : integer - max number of co-occurring concepts to
   * return</li>
   *
   * <li><b>type</b>: optional URI defining the ontology class to filter
   * concepts by</li>
   *
   * <li><b>before</b>: date in YYYY-MM-DD format defining the date before
   * which tag frequencies should be calculated</li>
   *
   * <li><b>after</b>: date in YYYY-MM-DD format defining the date after
   * which tag frequencies should be calculated</li>
   *
   * </ul>
   *
   * @param	{string}	uri	
   * @param	{string}	type	
   * @param	{string}	limit	
   * @param	{string}	after	
   */
  this.findConceptCoOccurrences = function(uri, type, limit, after) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/concepts/co-occurrences",
      data:	{
        "uri": uri,
        "type": type,
        "limit": limit,
        "after": after,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
          return null;
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * A full text semantic search with faceting on people, places,
   * organisations, format, and publication (product) for creative works.
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>q</b>: A full text search phrase</li>
   *
   * <li><b>facet</b>: optional URI of a facet to filter a results
   * projection on (multiple can be applied), e.g.
   * http://www.bbc.co.uk/ontologies/bbc/NewsWeb or
   * http://dbpedia.org/resource/David_Cameron</li>
   *
   * <li><b>highlightClass</b>: optional CSS class name applied to the
   * search results 'snippet' span element</li>
   *
   * <li><b>limit</b> : integer - max number of articles to return in a
   * page, default 10</li>
   *
   * <li><b>offset</b> : integer - offset to start results from to allow
   * for paging / infinite scroll</li>
   *
   * <li><b>before</b>: optional date in YYYY-MM-DD format defining the
   * date before which articles were published</li>
   *
   * <li><b>after</b>: optional date in YYYY-MM-DD format defining the
   * date after which articles were published</li>
   *
   * </ul>
   *
   * <p>Headers are:<p>
   *
   * <ul>
   *
   * <li>Accept: application/json | application/ld+json</li>
   *
   * @param	{string}	q	
   * @param	{string}	highlightclass	
   */
  this.fullTextSearchCreativeWorks = function(q, highlightclass, limit) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/creative-works/search",
      data:	{
        "q": q,
        "highlightClass": highlightclass,
        "limit": limit,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * Finds concepts in the knowledge base using a full text search term.
   * Useful for building type ahead fields to find things. Returns only
   * concepts that have been tagged on things.
   *
   * <p>
   *
   * Response is in OpenSearch Suggestions 1.1 JSON format
   *
   * </p>
   *
   * <p>Typical use-case is for type-ahead find widgets</p>
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>q</b> : string - a full text search term</li>
   *
   * <li><b>limit</b> : integer - max num of suggestions to return</li>
   *
   * <li><b>class</b>: optional URI defining the ontology class to filter
   * concepts on - multiple can be specified</li>
   *
   * </ul>
   *
   * @param	{string}	q	
   * @param	{string}	limit	
   */
  this.findTaggedConcepts = function(q, limit) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/concepts/tagged",
      data:	{
        "q": q,
        "limit": limit,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	April 30th 2014, 5:45:49 pm
   *
   * @description
   *
   * Polymorphic search, finds Creative Works, Storylines and Events in
   * the KB.<br/>
   *
   * Storylines and Events a returned with associated concepts, and the
   * Creative Works tagged with them<br/>
   *
   * Creative Works are returned with the concepts they are tagged
   * with.<br/>
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>tag</b>: URI of a concept that things might be tagged with -
   * multiple tags can be specified</li>
   *
   * <li><b>tagop</b>: boolean operand {and | or} applied to specified
   * tags (AND is default)</li>
   *
   * <li><b>class</b>: URI of ontology type of thing to return</li>
   *
   * <li><b>limit</b> : integer - max num of things to return</li>
   *
   * <li><b>before</b>: date in YYYY-MM-DD format defining the date before
   * which articles were published</li>
   *
   * <li><b>after</b>: date in YYYY-MM-DD format defining the date after
   * which articles were published</li>
   *
   * <li><b>product</b> : filter by bbc:product URI</li>
   *
   * </ul>
   *
   * <p>Warning !!- stick to relatively tight date ranges (1 to 2 months),
   * as this is heavyweight and could perform poorly over long time
   * periods</p>
   *
   * <p>Class types of thing are:<p>
   *
   * <ul>
   *
   * <li>http://purl.org/ontology/storyline/Storyline</li>
   *
   * <li>http://www.bbc.co.uk/ontologies/news/Event</li>
   *
   * <li>http://www.bbc.co.uk/ontologies/creativework/CreativeWork</li>
   *
   * <li>http://www.bbc.co.uk/ontologies/creativework/NewsItem</li>
   *
   * </ul>
   *
   * @param	{string}	tag	
   * @param	{string}	_class	
   * @param	{string}	limit	
   * @param	{string}	after	
   */
  this.findsThingsByTypeInTheKnowledgeBase = function(tag, _class, limit, after) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/things",
      data:	{
        "tag": tag,
        "class": _class,
        "limit": limit,
        "after": after,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

  /**
   * @version	2
   * @date	May 16th 2014, 11:03:30 am
   *
   * @description
   *
   * A multi-hop semantic search for creative work via the graph of tagged
   * concepts
   *
   * <p>Parameters are:<p>
   *
   * <ul>
   *
   * <li><b>about-tag-type</b>: Ontology class URI, find creative works by
   * the type (class) of thing they are tagged with, eg
   * http://dbpedia.org/ontology/Person</li>
   *
   * <li><b>about-tag-predicate</b>: Ontology predicate URI - find
   * creative works tagged with concepts that have wider associations with
   * this predicate. eg http://dbpedia.org/ontology/party</li>
   *
   * <li><b>about-tag-object</b>: Concept URI - find creative works tagged
   * with concepts that have wider associations where the
   * about-tag-predicate is associated with this object/concept. eg
   * http://dbpedia.org/resource/Conservative_Party_(UK)</li>
   *
   * <li><b>limit</b> : integer - max number of articles to return,
   * default 10</li>
   *
   * <li><b>offset</b> : integer - offset to start results from to allow
   * for paging / infinite scroll</li>
   *
   * <li><b>before</b>: optional date in YYYY-MM-DD format defining the
   * date before which articles were published</li>
   *
   * <li><b>after</b>: optional date in YYYY-MM-DD format defining the
   * date after which articles were published</li>
   *
   * <li><b>product</b> : optional filter by bbc:product URI</li>
   *
   * </ul>
   *
   * <p>Headers are:<p>
   *
   * <ul>
   *
   * <li>Accept: application/json | application/ld+json</li>
   *
   * @param	{string}	aboutTagType	
   * @param	{string}	aboutTagPredicate	
   * @param	{string}	aboutTagObject	
   * @param	{string}	limit	
   * @param	{string}	offset	
   */
  this.findCreativeWorksMultiHop = function(aboutTagType, aboutTagPredicate, aboutTagObject, limit, offset) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/creative-works",
      data:	{
        "about-tag-type": aboutTagType,
        "about-tag-predicate": aboutTagPredicate,
        "about-tag-object": aboutTagObject,
        "limit": limit,
        "offset": offset,
        "apikey": this.options["apikey"]
      },
      success:	function(response) {
          result = response;
      },
      'error':	function(jqXHR, textStatus, errorThrown) {
          /* @todo add error handling here */
      }
    });
    return result;
  };

};