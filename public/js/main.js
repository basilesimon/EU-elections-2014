
var server = "/";

$(function() {
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
    
    $('html,body').animate({scrollTop:$("#container-linked-data").offset().top}, 500);
    
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
        $('#candidate-concepts').html('<div class="media"><span class="col-md-2 pull-left text-right label label-default">People</span><div class="media-body"><div id="candidate-concepts-people" class="clearfix"></div></div></div>'
                                     +'<div class="media"><span class="col-md-2 pull-left text-right label label-default">Organisations</span><div class="media-body"><div id="candidate-concepts-organisations" class="clearfix"></div></div></div>'
                                     +'<div class="media"><span class="col-md-2 pull-left text-right label label-default">Places</span><div class="media-body"><div id="candidate-concepts-places" class="clearfix"></div></div></div>'
                                     +'<div class="media"><span class="col-md-2 pull-left text-right label label-default">Other</span><div class="media-body"><div id="candidate-concepts-things" class="clearfix"></div></div></div>');

        if (candidate.concepts && candidate.concepts.length > 0) {
            candidate.concepts.forEach(function(concept) {
                if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Person') != -1) {
                    var html = '<span class="label label-person pull-left"><i class="fa fa-user"></i> '+concept.name+' <span class="badge">'+concept.occurrences+'</span></span>';
                    $('#candidate-concepts-people').append(html);
                } else if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Organisation') != -1) {
                    var html = '<span class="label label-organisation pull-left"><i class="fa fa-sitemap"></i> '+concept.name+' <span class="badge">'+concept.occurrences+'</span></span>';
                    $('#candidate-concepts-organisations').append(html);
                } else if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Place') != -1) {
                    var html = '<span class="label label-place pull-left"><i class="fa fa-globe"></i> '+concept.name+' <span class="badge">'+concept.occurrences+'</span></span>';
                    $('#candidate-concepts-places').append(html);
                } else {
                    var html = '<span class="label label-info pull-left"><i class="fa fa-tag"></i> '+concept.name+' <span class="badge">'+concept.occurrences+'</span></span>';
                    $('#candidate-concepts-things').append(html);
                }
            });
        } else {
            $('#candidate-concepts').html('<p class="text-muted">No links to other subjects found</p>');
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
                
                // Some content may not contain URLs (e.g. images, videos)
                if (!article.url)
                    return;
                    
                var domain = article.url.replace(/^http:\/\//, '').replace(/\/(.*)?/, '');
                domain = domain.replace(/(www|rss|feeds)\./, '');
                articlesHtml += '<li>'
                               +'<h4><a href="'+article.url+'">'+article.title+'</a></h4>'
                               +'<p class="lead text-muted">'+domain+'</p>'
                               +'<h5 class="text-muted">Tagged with...</h5>'
                               +'<p class="clearfix">';

                var personTagsHtml = "", organisationTagsHtml = "", placeTagsHtml = "", otherTagsHtml = "";
                article.concepts.forEach(function(concept) {
                    if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Person') != -1) {
                        personTagsHtml += '<span class="label label-person pull-left"><i class="fa fa-user"></i> '+concept.name+'</span>';
                    } else if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Organisation') != -1) {
                        organisationTagsHtml += '<span class="label label-organisation pull-left"><i class="fa fa-sitemap"></i> '+concept.name+'</span>';
                    } else if (concept.type && concept.type.indexOf('http://dbpedia.org/ontology/Place') != -1) {
                        placeTagsHtml += '<span class="label label-place pull-left"><i class="fa fa-globe"></i> '+concept.name+'</span>';
                    } else {
                        otherTagsHtml += '<span class="label label-info pull-left"><i class="fa fa-tag"></i> '+concept.name+'</span>';
                    }
                });  
                articlesHtml += personTagsHtml+organisationTagsHtml+placeTagsHtml+otherTagsHtml;              
                articlesHtml +='</p><hr/></li>';
            });
            articlesHtml += '</ul>';
        } else {
            articlesHtml = '<p class="text-muted">No mentions in the media found</p>';
        }
        console.log(articlesHtml);
        $('#candidate-articles').html(articlesHtml);

        $('#candidate-info').show();
        
        plotGraphByDate('candidate-mentions', candidate.mentions, true);
        
    });

});

$(document).on("click touch", "#candidate-concepts .media", function(e) {
    $(this).toggleClass("expanded");
});

$(document).on("click touch", ".map path[data-region-name]", function(e) {
    var regionName = $(this).data('regionName');
    var cssClass = new String($(this).attr('class'));
    
    // NB: Can't use addClass() and removeClass as they don't work with SVGs!
    $('.map .active').attr('class', '');
    
    if (cssClass.match(/active/)) {
        $('#region-info').hide();
        $('#select-region').fadeIn();
        showRegionalPollPieChart();
    } else {
        $(this).attr('class', cssClass + ' active');
    
        $('#select-region').hide();
        $('#region-info').hide().removeClass('hidden');
    
        $.getJSON(server+"/United_Kingdom/"+encodeURIComponent(regionName), function(region) {
            $('#region-name').html(region.name);
            //$('#region-articles ul').html('');
            $("#region-candidates ul").html('');
            region.candidates.forEach(function(candidate) {
                if (candidate.uri)
                    $('#region-candidates ul').append('<li><i class="fa fa-li fa-user fa-lg"></i><a href="#" data-candidate-id="' + candidate._id + '"><strong>' + candidate.name + '</strong></a> <span class="text-muted">'+candidate.party+'</span></li>');
            });
            showRegionalPollPieChart(region.name);
            $('#region-info').slideDown();
        });
    }
});

$(window).scroll(function(){
  $('.fade-in').each( function(i) {
      var bottomOfWindow = $(window).scrollTop() + $(window).height();
      if (bottomOfWindow > ($(this).position().top + 100))
          $(this).animate({'opacity':'1'},500);
  });
});