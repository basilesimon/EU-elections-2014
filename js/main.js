
var bbcNewsLabs = new function(){
    
    /** 
     * @example getNumberOfConceptMentionsInArticles("http://dbpedia.org/resource/Nigel_Farage", 7);
     */
    this.getNumberOfConceptMentionsInArticles = function(conceptUri, conceptTypeUri, numberOfDays) {
        
        var conceptMentionsByDate = {};
        for (var i = 0; i <= numberOfDays; i++) {
            var date = moment().subtract('days', i).format('YYYY-MM-DD');
            var response = newslabsApi.findConceptCoOccurrences(conceptUri, conceptTypeUri, 1, date);
            try {
                conceptMentionsByDate[date] = parseInt( response["co-occurrences"][0].occurrence );
            } catch (e) {
                conceptMentionsByDate[date] = 0;
            }            
        }
        return conceptMentionsByDate;
    };
    
    /** 
     * Turn an object of date + value pairs into a graph
     */
    this.plotGraphByDate = function(element, graphData, hideLabel) {
        var labels = [];
        var data = [];
        for (var label in graphData) {
            data.push(graphData[label]);
            if (hideLabel == true) {
                labels.push("");
            } else {
                labels.push(label);
            }
        }
        console.log(labels);
        console.log(data);
        var ctx = element.getContext("2d");
        var boudin = {
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
        var myNewChart = new Chart(ctx).Line(boudin);
    };

};
