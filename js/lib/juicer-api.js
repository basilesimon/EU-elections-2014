/**
 * @name	juicerApi
 * @date	May 16th 2014, 10:48:35 am
 *
 * Note: This library requires jQuery
 *
 * @example
 *
 * This library provides the following methods:
 *
 *	juicerApi.listProducts()
 *	juicerApi.listSections()
 *	juicerApi.listSites()
 *	juicerApi.getArticles(text, product, content_format, section, site, published_after, published_before)
 *	juicerApi.getArticle()
 *	juicerApi.listFormats()
 *
 */
var juicerApi = new function() {

  /**
   * You need to configure these options to use this library
   */
  this.options = {
    "host":	"http://data.bbc.co.uk/bbcrd-juicer",
    "apikey":	"9OHbOpZpVh9tQZBDjwTlTmsCF2Ce0yGQ"
  };

  /**
   * @version	2
   * @date	April 28th 2014, 9:58:41 am
   *
   * @description
   *
   * List available Products.
   *
   */
  this.listProducts = function() {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/products.json",
      data:	{
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
   * @date	April 28th 2014, 9:58:57 am
   *
   * @description
   *
   * List available Sections.
   *
   */
  this.listSections = function() {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/sections.json",
      data:	{
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
   * @date	April 28th 2014, 9:59:03 am
   *
   * @description
   *
   * List available Sites.
   *
   */
  this.listSites = function() {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/sites.json",
      data:	{
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
   * @date	April 30th 2014, 11:55:13 am
   *
   * @description
   *
   * Filter Articles according to some parameters. Parameters can be
   * provided in the query string.
   *
   * Available parameters:
   *
   * All parameters are optional. If omitted, the endpoint will return the
   * latest articles.
   *
   * List of available products, formats, sections and sites, is available
   * at `{{host}}/products.json`, `{{host}}/formats.json`,
   * `{{host}}/sections.json` and `{{host}}/sites.json`, respectively.
   *
   * @param	{string}	text	keywords to search for. Searches in title, description and body of the article.
   * @param	{string}	product	scopes the results to certain products. Multiple products can be specified by adding multiple product[] keys and values.
   * @param	{string}	content_format	scopes the results to certain formats. Multiple formats can be specified by adding multiple content_format[] keys and values.
   * @param	{string}	section	scopes the results to certain sections. Multiple sections can be specified by adding multiple section[] keys and values.
   * @param	{string}	site	scopes the results to certain sites. Multiple sites can be specified by adding multiple site[] keys and values.
   * @param	{string}	published_after	fetch articles published after published_after. The date format is yyyy-mm-yy.
   * @param	{string}	published_before	fetch articles published before published_before. The date format is yyyy-mm-yy.
   */
  this.getArticles = function(text, product, content_format, section, site, published_after, published_before) {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/articles.json",
      data:	{
        "text": text,
        "product[]": product,
        "content_format[]": content_format,
        "section[]": section,
        "site[]": site,
        "published_after": published_after,
        "published_before": published_before,
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
   * @date	April 30th 2014, 2:36:52 pm
   *
   * @description
   *
   * Get a single Article by its ID.
   *
   * The endpoint URL format is `/articles/:cps_id.json`.
   *
   * The `:cps_id` in the URL is an Article's `cps_id`.
   *
   */
  this.getArticle = function() {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/articles/24923993.json",
      data:	{
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
   * @date	April 28th 2014, 9:58:48 am
   *
   * @description
   *
   * List available Formats.
   *
   */
  this.listFormats = function() {
    var result;
    $.ajax({
      async:	false,
      type:	"GET",
      url:	this.options["host"]+"/formats.json",
      data:	{
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