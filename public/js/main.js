var regions = [ "east-midlands",
                "eastern",
                "london",
                "north-east",
                "north-west",
                "northern-ireland",
                "scotland",
                "south-east",
                "south-west",
                "wales",
                "west-midlands",
                "yorkshire-and-the-humber"];

var bbcNewsLabs = new function() {

        /**
         * @example getNumberOfConceptMentionsInArticles("http://dbpedia.org/resource/Nigel_Farage", 'http://dbpedia.org/ontology/Person', 7);
         */
        this.getNumberOfConceptMentionsInArticles = function(conceptUri, conceptTypeUri, numberOfDays) {
            var conceptMentionsByDate = [];

            // We track mentions so far and subject them as we go back in time
            var totalMentionsSoFar = 0;

            for (var i = 0; i <= numberOfDays; i++) {
                var date = moment().subtract('days', i).format('YYYY-MM-DD');
                try {
                    var response = newslabsApi.findConceptCoOccurrences(conceptUri, conceptTypeUri, 1, date);
                    var numberOfMentions = parseInt(response["co-occurrences"][0].occurrence) - totalMentionsSoFar;
                    conceptMentionsByDate[date] = numberOfMentions;
                    totalMentionsSoFar = totalMentionsSoFar + numberOfMentions;
                    conceptMentionsByDate.push({
                        'date': date,
                        'value': numberOfMentions
                    });
                } catch (e) {
                    conceptMentionsByDate.push({
                        'date': date,
                        'value': 0
                    });
                }
            }
            // Reverse array so is oldest to newest (most logical)
            conceptMentionsByDate.reverse();

            return conceptMentionsByDate;
        };

        /**
         * Get related concepts
         * @example getRelatedConcepts("http://dbpedia.org/resource/Nigel_Farage", 'http://dbpedia.org/ontology/Person', 7);
         */
        this.getRelatedConcepts = function(conceptUri, conceptTypeUri, numberOfDays) {
            var concepts = [];
            var date = moment().subtract('days', numberOfDays).format('YYYY-MM-DD');
            try {
                var response = newslabsApi.findConceptCoOccurrences(conceptUri, conceptTypeUri, 15, date);
                concepts = response["co-occurrences"];
            } catch (e) {}
            return concepts;
        };

        /**
         * Turn an an array of date + value pairs into a graph
         * @param   canvasId    The ID for a canvas object
         * @param   graphData   An array of objects [{date: 'YYYY-MM-DD', value: 10}, {date: 'YYYY-MM-DD', value: 25}, ... ]
         * @param   hideXaxis   Optional boolean. If true hides the X-Axis on the graph.
         */
        this.plotGraphByDate = function(canvasId, graphData, hideXaxis) {

            var canvas = document.getElementById(canvasId);

            // Hack to stop Chart.js incorrectly resizing graph on subsquent
            // redraws on some displays (a known bug).
            if (!$('#' + canvasId).attr('origionalHeight')) {
                $('#' + canvasId).attr('origionalHeight', canvas.height);
                $('#' + canvasId).attr('origionalWidth', canvas.width);
            }

            var labels = [];
            var data = [];
            var maxValue = 0;
            for (var i = 0; i < graphData.length; i++) {
                var label = graphData[i].date;
                var value = graphData[i].value;

                if (value > maxValue)
                    maxValue = value;

                data.push(value);

                if (hideXaxis == true) {
                    labels.push("");
                } else {
                    labels.push(label);
                }
            }

            var ctx = canvas.getContext("2d");
            var plotData = {
                labels: labels,
                datasets: [{
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    data: data
                }]
            }

            // Hack to force the graph to draw nicely when displaying a small number
            // of things (so it doesn't use floats!)
            // Note if there are a large number of things I let it do it's own thing
            // otherwise the graph looks bunched up. Can fix this better later.
            // Chart.js doesn't have a 'use integer values only' option :(
            var chartOptions = {};
            if (maxValue < 20) {
                var steps = maxValue;
                var max = maxValue;
                chartOptions = {
                    scaleOverride: true,
                    scaleSteps: steps,
                    scaleStepWidth: Math.ceil(max / steps),
                    scaleStartValue: 0
                };
            }

            ctx.canvas.height = $('#' + canvasId).attr('origionalHeight');
            ctx.canvas.width = $('#' + canvasId).attr('origionalWidth');
            var myNewChart = new Chart(ctx).Line(plotData, chartOptions);
        };

    };



// @todo refactor all of this!
$(document).on("click touch", "svg path", function(e) {
    var element = this;
    var region = $(element).attr('id').replace(/\-/g, ' ');
    var cssClass = $(element).attr('class');

    $('#select-region').hide();

    // NB: Can't use addClass() and removeClass as they don't work with SVGs!
    $('.map .active').attr('class', '');
    $(element).attr('class', cssClass + ' active');

    $('#region-name').html(region.capitalize());

    var response = juicerApi.getArticles('("european elections" | "european parliament" | "eu elections")' + region, null, null, null, null, "2014-04-01", null);
    $('#region-articles ul').html('');
    var articlesDisplayed = 0;
    if (response && response.articles.length > 0) {
        response.articles.forEach(function(article) {
            if (articlesDisplayed > 5)
                return;

            var matches = article.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            var hostname = matches && matches[1];
            hostname = hostname.replace(/^www\./, '');
            hostname = hostname.replace(/^feeds\./, '');
            hostname = hostname.replace(/^rss\./, '');

            if (hostname == "twitter.com")
                return;

            $('#region-articles ul').append('<li><i class="fa fa-li fa-file-text-o fa-lg"></i><a href="' + article.url + '">' + article.title + '</a> <span class="text-muted">'+hostname+'</span></li>');
            articlesDisplayed++;
        });
    }

    $('#candidate-info').hide();
    var region = $(this).attr('id');
    $("#candidates ul").html('');
    $.getJSON("data/candidates.json", function (candidates) {
        // First, print all canidiates we have concept URIs for
        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            if (candidate.region === region && candidate.uri.length > 2)
                $('#candidates ul').append('<li><i class="fa fa-li fa-user fa-lg"></i><a href="#" data-uri="' + candidate.uri + '"><strong>' + candidate.name + '</strong></a> <span class="text-muted">'+candidate.party+'</span></li>');
        }
        // Print all candidates we don't have concept URIs for
        // @todo Free text search for these?
        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            /*
            if (candidate.region === region && candidate.uri.length <= 2)
                $('#candidates ul').append('<li><i class="fa fa-li fa-user fa-lg text-muted"></i><span class="text-muted">' + candidate.name + '</span> ('+candidate.party+')</li>');
            */
        }
    });

    function localPoll(region) {
      if (region === "london") {
        var data = $.getJSON("data/londonpolls.json", draw);
      } else if (region === "scotland") {
        var data = $.getJSON("data/scotlandpolls.json", draw);
      } else if (region === "east-midlands" || region === "west-midlands" || region === "wales") {
        var data = $.getJSON("data/midlandspolls.json", draw);
      } else if (region === "north-west" || region === "north-east" || region === "yorkshire-and-the-humber") {
        var data = $.getJSON("data/northpolls.json", draw);
      } else {
        var data = $.getJSON("data/southpolls.json", draw);
      }
      function draw(data) {
        var ctx = document.getElementById("regionalcanvas").getContext("2d");
        var options = { segmentStrokeWidth : 1,
                        segmentShowStroke : false  };
        var chart = new Chart(ctx).Doughnut(data, options);
          ctx.rotate(-90*Math.PI/180);
          ctx.translate(-300,0);
      }
    }
    localPoll(region);
    $('#region-info').removeClass('hidden');
    $('#votes').remove();
});

// @todo Refactor!
$(document).on("click touch", "a[data-uri]", function(e) {
    $('a[data-uri]').removeClass('active');
    $('a[data-uri="'+ $(this).data('uri')+'"]').addClass('active');
    e.preventDefault();
    var parentObject = this;

    $.getJSON("data/candidates.json?v2", function(candidates) {
        var candidate = {};
        for (var i = 0; i < candidates.length; i++) {
            if ($(parentObject).data('uri') == candidates[i].uri) {
                candidate = candidates[i];
            }
        }

        // The handling here is so that the graph is updated nicely
        $('#candidate-info').hide(0, function() {
            $('#candidate-name').html(candidate.name+" ("+candidate.party+")");
            var uri = $(parentObject).data('uri');
            var conceptTypeUri = 'http://dbpedia.org/ontology/Person';
            var numberOfDays = 7;
            var mentionsByDay = bbcNewsLabs.getNumberOfConceptMentionsInArticles(uri, conceptTypeUri, numberOfDays);
            bbcNewsLabs.plotGraphByDate('candidate-mentions', mentionsByDay, true);

            $('#related-concepts').html('');
            $.getJSON("data/candidates.json?v2", function(candidates) {
                // First, print all canidiates we have concept URIs for
                for (var i = 0; i < candidates.length; i++) {
                    var candidate = candidates[i];
                    if (candidate.uri == $(parentObject).data('uri')) {

                        var conceptsByType = {};

                        for (var j = 0; j < candidate.relatedConcepts.length; j++) {
                            var concept = getConcept( candidate.relatedConcepts[j].uri );
                            concept.name = candidate.relatedConcepts[j].name;
                            concept.occurrences = candidate.relatedConcepts[j].occurrences;
                            var conceptType = new String(concept.typeUri);

                            if (conceptType == 'undefined')
                                conceptType = "Other";

                            // @todo Add spaces in convert camel names
                            conceptType = conceptType.replace(/http:\/\/dbpedia.org\/ontology\//, '').replace(/_/, '');

                            // @todo Normalize concept types
                            if (!conceptsByType[conceptType])
                                conceptsByType[conceptType] = [];
                            conceptsByType[conceptType].push(concept);
                        }

                        for (var conceptType in conceptsByType) {
                            $('#related-concepts').append('<strong span class="label label-default pull-left">'+conceptType+'</strong>');
                            for (var j = 0; j < conceptsByType[conceptType].length; j++) {
                                var concept = conceptsByType[conceptType][j];
                                console.log(concept);
                                $('#related-concepts').append('<span class="label label-info pull-left">' + concept.name + ' (' + concept.occurrences +')</span>');
                            }
                        }
                    }
                }
            });
            $('#candidate-info').show();
        });
    });
});

String.prototype.capitalize = function() {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

$(window).scroll(function(){
  $('.fade-in').each( function(i) {
      var bottomOfWindow = $(window).scrollTop() + $(window).height();
      if (bottomOfWindow > ($(this).position().top + 100))
          $(this).animate({'opacity':'1'},500);
  });
});

/**
 * Pie charts
 */
var candidatesPie = $.getJSON("data/candidatesbyparty.json", candidatesDraw);
function candidatesDraw(candidatesPie) {
    var ctxCandidates = document.getElementById("candidates").getContext("2d");
    var options = { segmentStrokeWidth : 1 };
    var candidatesChart = new Chart(ctxCandidates).Doughnut(candidatesPie, options);
}

var mentionsPie = $.getJSON("data/partymentions.json", mentionsDraw);
function mentionsDraw(mentionsPie) {
    var ctxMentions = document.getElementById("mentions").getContext("2d");
    var options = { segmentStrokeWidth : 1 };
    var mentionsChart = new Chart(ctxMentions).Doughnut(mentionsPie, options);
}

$(function() {
    addCandidatesByRegion();
});


function addCandidatesByRegion() {
    $.getJSON("data/candidates.json", function (candidates) {
        $('#tab-explore-candidates').html('<div class="panel-group" id="candiates-by-region-accordion"></div>');
        for (var r = 0; r < regions.length; r++) {
            var region = regions[r];

            var html = '';
            for (var i = 0; i < candidates.length; i++) {
                var candidate = candidates[i];
                if (candidate.region == region && candidate.uri.length > 2) {
                   html += '<a href="#" data-uri="' + candidate.uri + '" class="list-group-item"><i class="fa fa-user fa-lg pull-left" style="margin-top: 10px; margin-right: 10px; margin-bottom: 20px;"></i> <strong>' + candidate.name + '</strong><br/><span class="text-muted">'+candidate.party+'</span></a>';
                }
            }
            $('#candiates-by-region-accordion').append('<div class="panel panel-default panel-accordian">'
                                                       +'  <div class="panel-heading">'
                                                       +'    <h4 class="panel-title">'
                                                       +'      <a data-toggle="collapse" data-parent="#candiates-by-region-accordion" data-target="#candidates-by-region-'+region+'">'
                                                       + region.replace(/-/g, ' ').capitalize()
                                                       +'      </a>'
                                                       +'    </h4>'
                                                       +'  </div>'
                                                       +'  <div id="candidates-by-region-'+region+'" class="panel-collapse collapse">'
                                                       +'    <div #candidates-by-region-'+region+'-group" class="list-group">'
                                                       + html
                                                       +'    </div>'
                                                       +'  </div>'
                                                       +'</div>'
                                                   );
        }
    });
}

$('.nav.nav-tabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
});

//$('#candiates-by-region-accordion').collapse();


$('#candiates-by-region-accordion').on('show hide', function() {
    $(this).css('height', 'auto');
});

function getConcept(uri, callback) {
    console.log(uri);
    var result = {};
    async = false;
    if (typeof(callback) === 'function')
        async = true;

    $.ajax({
      url: "data/concepts.json",
      dataType: 'json',
      async: false,
      success: function(concepts) {
          for (var i = 0; i < concepts.length; i++) {
              var concept = concepts[i];
              if (concept.uri == uri) {
                  if (typeof(callback) === 'function') {
                      callback(concept);
                  } else {
                      result = concept;
                  }
              }
          }
      }
    });
    return result;
}

//Projected votes - always visible
$("#votes ul").html('');
var nationalPoll = $.getJSON("data/globalspolls.json", chartDraw);
function chartDraw(nationalPoll) {
  var ctx = document.getElementById("nationalpoll").getContext("2d");
  var options = { segmentStrokeWidth : 1,
                  segmentShowStroke : false };
  var pollsChart = new Chart(ctx).Doughnut(nationalPoll, options);
    ctx.rotate(-90*Math.PI/180);
    ctx.translate(-250,0);
}
