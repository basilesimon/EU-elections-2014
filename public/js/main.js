
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
        $('#candidate-name').html(candidate.name+"</br/><small>"+candidate.party+"</small>");
        $('#candidate-articles').html('');
        $('#candidate-concepts').html('');
        
        // Display related concepts
        var conceptsHtml  = '';
        if (candidate.concepts && candidate.concepts.length > 0) {
            candidate.concepts.forEach(function(concept) {
                conceptsHtml += '<span class="label label-info pull-left">'+concept.name+'</span>';
            });
        } else {
            conceptsHtml = '<p class="text-muted">No concepts found</p>';
        }
        $('#candidate-concepts').html(conceptsHtml);
        
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