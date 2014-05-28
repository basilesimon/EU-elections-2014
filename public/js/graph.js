/**
 * Turn an an array of date + value pairs into a graph
 * @param   canvasId    The ID for a canvas object
 * @param   graphData   An array of objects [{date: 'YYYY-MM-DD', value: 10}, {date: 'YYYY-MM-DD', value: 25}, ... ]
 * @param   hideXaxis   Optional boolean. If true hides the X-Axis on the graph.
 */
function plotGraphByDate(canvasId, graphData, hideXaxis) {
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

    var chartOptions = {};
    var steps = 5;
    var max = 5;
    if (maxValue > 50) {
        var steps = 10;
        var max = 100;
    } else if (maxValue > 20) {
        var steps = 10;
        var max = 50;
    } else if (maxValue > 5) {
        var steps = 10;
        var max = 10;
    }
    
    chartOptions = {
        scaleOverride: true,
        scaleSteps: steps,
        scaleStepWidth: Math.ceil(max / steps),
        scaleStartValue: 0
    };

    ctx.canvas.height = $('#' + canvasId).attr('origionalHeight');
    ctx.canvas.width = $('#' + canvasId).attr('origionalWidth');
    var myNewChart = new Chart(ctx).Line(plotData, chartOptions);

};