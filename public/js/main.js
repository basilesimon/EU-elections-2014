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
            // var chartOptions = {};
            // if (maxValue < 20) {
            var steps = 30;
            var max = 30;
            chartOptions = {
                scaleOverride: true,
                scaleSteps: steps,
                scaleStepWidth: Math.ceil(max / steps),
                scaleStartValue: 0
            };
            // }

            ctx.canvas.height = $('#' + canvasId).attr('origionalHeight');
            ctx.canvas.width = $('#' + canvasId).attr('origionalWidth');
            var myNewChart = new Chart(ctx).Line(plotData, chartOptions);
        };

    };



// @todo refactor all of this!
$(document).on("click touch", "svg path", function(e) {
    // NB: Can't use addClass() and removeClass as they don't work    
    // cross browser with SVG elements.
    var element = this;
    var region = $(element).attr('id').replace(/\-/g, ' ');
    var cssClass = $(element).attr('class');

    // Remove 'active' class from each active map element
    $('.map .active').each(function(index, el) {
        $(el).attr('class', $(el).attr('class').replace(' active', ''));
    });

    // If not selected, display it
    $(element).attr('class', cssClass + ' active');

    var response = juicerApi.getArticles('("european elections" | "european parliament" | "eu elections")' + region, null, null, null, null, "2014-04-01", null);
    $('#region-articles ul').html('');
    $('#region-articles h2').html('Articles about ' + region.capitalize());
    var articlesDisplayed = 0;
    if (response && response.articles.length > 0) {
        response.articles.forEach(function(article) {
            if (articlesDisplayed > 10)
                return;

            var matches = article.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            var hostname = matches && matches[1];
            hostname = hostname.replace(/^www\./, '');
            hostname = hostname.replace(/^feeds\./, '');
            
            $('#region-articles ul').append('<li><i class="fa fa-li fa-file-text-o fa-lg"></i><a href="' + article.url + '">' + article.title + '</a><br/><span class="text-muted">'+hostname+'</span></li>');
            articlesDisplayed++;
        });
    }

    $('#candidiates-for').html('Candidates for ' + region.capitalize());

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
});

// @todo Refactor!
$(document).on("click touch", "#candidates li a", function(e) {
    e.preventDefault();
    var parentObject = this;
    // The handling here is so that the graph is updated nicely
    $('#candidate-info').hide(0, function() {
        $('#candidate-name').html('Mentions of ' + $(parentObject).text() + ' in the media');
        var uri = $(parentObject).data('uri');
        var conceptTypeUri = 'http://dbpedia.org/ontology/Person';
        var numberOfDays = 30;
        var mentionsByDay = bbcNewsLabs.getNumberOfConceptMentionsInArticles(uri, conceptTypeUri, numberOfDays);
        bbcNewsLabs.plotGraphByDate('candidate-mentions', mentionsByDay, true);

        $('#related-concepts').html('');
        
        $("#candidates ul").html('');
        $.getJSON("data/candidates.json?v2", function(candidates) {
            // First, print all canidiates we have concept URIs for
            for (var i = 0; i < candidates.length; i++) {
                var candidate = candidates[i];
                if (candidate.uri == $(parentObject).data('uri')) {
                    for (var j = 0; j < candidate.relatedConcepts.length; j++) {
                        var concept = candidate.relatedConcepts[j];
                        $('#related-concepts').append('<span class="label label-info pull-left">' + concept.name + ' (' + concept.occurrences +')</span>');
                    }
                }
            }
        });
        $('#candidate-info').removeClass('hidden').show();
    });
});

String.prototype.capitalize = function() {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};