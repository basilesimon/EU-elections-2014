
var server = "http://localhost:3001";

$(function() {
    
    $.getJSON("json/candidatesbyparty.json", function(candidatesByParty) {
        var ctxCandidates = document.getElementById("candidates-by-party").getContext("2d");
        var options = { segmentStrokeWidth : 1 };
        var candidatesChart = new Chart(ctxCandidates).Doughnut(candidatesByParty, options);
    });

    $.getJSON("json/partymentions.json", function(mentionsByParty) {
        var ctxMentions = document.getElementById("mentions-by-party").getContext("2d");
        var options = { segmentStrokeWidth : 1 };
        var mentionsChart = new Chart(ctxMentions).Doughnut(mentionsByParty, options);
    });
    
    // Get all regions
    $.getJSON(server+"/United_Kingdom/regions", function(regions) {
        // Add accordion wtih regions + candidates
        $('#tab-explore-candidates').html('<div class="panel-group" id="candiates-by-region-accordion"></div>');
        regions.forEach(function(region, regionIndex) {

            var listGroupHtml = '';
            region.candidates.forEach(function(candidate) {
                if (!candidate.uri)
                    return;
                
                listGroupHtml += '<a href="#" data-candidate-id="'+candidate._id+'" class="list-group-item">'
                                +'<i class="fa fa-user fa-lg pull-left" style="margin-top: 10px; margin-right: 10px; margin-bottom: 20px;"></i> '
                                +'<strong>'+ candidate.name+'</strong><br/><span class="text-muted">'+candidate.party+'</span>'
                                +'</a>';
            });
            
            var targetId = 'candidates-by-region-'+regionIndex;
            $('#candiates-by-region-accordion').append('<div class="panel panel-default panel-accordian">'
                                                       +'  <div class="panel-heading">'
                                                       +'    <h4 class="panel-title">'
                                                       +'      <a data-toggle="collapse" data-parent="#candiates-by-region-accordion" data-target="#'+targetId+'">'+region.name+'</a>'
                                                       +'    </h4>'
                                                       +'  </div>'
                                                       +'  <div id="'+targetId+'" class="panel-collapse collapse">'
                                                       +'    <div class="list-group">'+listGroupHtml+'</div>'
                                                       +'  </div>'
                                                       +'</div>'
                                                   );

       });
    });
});

$(document).on("click touch", "a[data-candidate-id]", function(e) {
    e.preventDefault();
    var parent = this;
    var candidateId = $(this).data('candidateId');
    
    $('#candidate-info').removeClass('hidden').hide();
    
    $('a[data-candidate-id]').removeClass('active');
    $('a[data-candidate-id="'+candidateId+'"]').addClass('active');
    $('#candidate-info').removeClass('hidden').show();
    
    $.getJSON(server+"/candidate/"+candidateId, function(candidate) {
        var candidateUrl = server+'/candidate/'+candidateId;
        $('#candidate-name').html('<a href="'+candidateUrl+'">'+candidate.name+'</a><br/><small>'+candidate.party+'</small>');
        $('#candidate-articles').html('');
        $('#candidate-concepts').html('');
        
        // Display related concepts
        $('#candidate-concepts').html('<div id="candidate-concepts-people" class="clearfix"></div>'
                                     +'<div id="candidate-concepts-organisations" class="clearfix"></div>'
                                     +'<div id="candidate-concepts-places" class="clearfix"></div>'
                                     +'<div id="candidate-concepts-other" class="clearfix"></div>');


        if (candidate.concepts && candidate.concepts.length > 0) {
            candidate.concepts.forEach(function(concept) {
                if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Person') != -1) {
                    var html = '<span class="label label-person pull-left"><i class="fa fa-user"></i> '+concept.name+' <span class="badge">'+concept.occurrences+'</span></span>';
                    if ($('#candidate-concepts-people').html() == '')
                        $('#candidate-concepts-people').append('<span class="label label-default pull-left">People</span>');
                    $('#candidate-concepts-people').append(html);
                } else if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Organisation') != -1) {
                    var html = '<span class="label label-organisation pull-left"><i class="fa fa-sitemap"></i> '+concept.name+' <span class="badge">'+concept.occurrences+'</span></span>';
                    if ($('#candidate-concepts-organisations').html() == '')
                        $('#candidate-concepts-organisations').append('<span class="label label-default pull-left">Organisations</span>');
                    $('#candidate-concepts-organisations').append(html);
                } else if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Place') != -1) {
                    var html = '<span class="label label-place pull-left"><i class="fa fa-globe"></i> '+concept.name+' <span class="badge">'+concept.occurrences+'</span></span>';
                    if ($('#candidate-concepts-places').html() == '')
                        $('#candidate-concepts-places').append('<span class="label label-default pull-left">Places</span>');
                    $('#candidate-concepts-places').append(html);
                } else {
                    var html = '<span class="label label-info pull-left"><i class="fa fa-tag"></i> '+concept.name+' <span class="badge">'+concept.occurrences+'</span></span>';
                    if ($('#candidate-concepts-other').html() == '')
                        $('#candidate-concepts-other').append('<span class="label label-default pull-left">Other Tags</span>');
                    $('#candidate-concepts-other').append(html);
                }
            });
        }
        
        if ($('#candidate-concepts-people').html() == '' &&
            $('#candidate-concepts-organisations').html() == '' &&
            $('#candidate-concepts-places').html() == '' &&
            $('#candidate-concepts-other').html() == '')
            conceptsHtml = '<p class="text-muted">No concepts found</p>';
        
        // Display articles about the candidate
        var articlesHtml  = '';
        if (candidate.articles && candidate.articles.length > 0) {
            articlesHtml += '<ul class="list-unstyled">';
            candidate.articles.forEach(function(article, index) {
                
                //if (article.source == "http://www.bbc.co.uk/ontologies/bbc/Twitter")
                //    return;
                    
                if (index > 10)
                    return;
                    
                var domain = article.url.replace(/^http:\/\//, '').replace(/\/(.*)?/, '');
                domain = domain.replace(/(www|rss|feeds)\./, '');
                articlesHtml += '<li>'
                               +' <p>'
                               +'  <a href="'+article.url+'">'+article.title+'</a>'
                               +'  <br/><span class="text-muted">'+domain+'</span>'
                               +' </p>';
                               +'</li>';
            });
            articlesHtml += '</ul>';
        } else {
            articlesHtml = '<p class="text-muted">No articles found</p>';
        }
        $('#candidate-articles').html(articlesHtml);
        
    });
    $('#candidate-info').show();
});

$(window).scroll(function(){
  $('.fade-in').each( function(i) {
      var bottomOfWindow = $(window).scrollTop() + $(window).height();
      if (bottomOfWindow > ($(this).position().top + 100))
          $(this).animate({'opacity':'1'},500);
  });
});