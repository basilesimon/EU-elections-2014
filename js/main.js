
var bbcNewsLabs = new function(){
    
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
                conceptMentionsByDate.push({ 'date': date, 'value': numberOfMentions});
            } catch (e) {
                conceptMentionsByDate.push({ 'date': date, 'value': 0});
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
        if (!$('#'+canvasId).attr('origionalHeight')) {
            $('#'+canvasId).attr('origionalHeight', canvas.height);
            $('#'+canvasId).attr('origionalWidth', canvas.width);
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
            labels : labels,
                datasets : [
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    data : data
                }
            ]
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
            chartOptions = {    scaleOverride: true,
                                scaleSteps: steps,
                                scaleStepWidth: Math.ceil(max / steps),
                                scaleStartValue: 0
                            };
        }
        
        ctx.canvas.height = $('#'+canvasId).attr('origionalHeight');
        ctx.canvas.width = $('#'+canvasId).attr('origionalWidth');
        var myNewChart = new Chart(ctx).Line(plotData, chartOptions);
    };

};
