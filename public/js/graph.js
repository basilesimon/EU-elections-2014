/**
 * Turn an an array of date + value pairs into a graph
 * @param   canvasId    The ID for a canvas object
 * @param   datasets    An array of datasets for chart.js
 * @param   hideXaxis   Optional boolean. If true hides the X-Axis on the graph.
 *
 * @todo This needs some refactoring (it's a little obtuse)
 */
function plotGraphByDate(canvasId, datasets, hideXaxis) {
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

    for (var i = 0; i < datasets[0].data.length; i++) {
        var label = datasets[0].data[i].date;
        
        if (hideXaxis == true) {
            labels.push("");
        } else {
            labels.push(label);
        }
    }

    for (var j = 0; j < datasets.length; j++) {
        data[j] = [];
        for (var i = 0; i < datasets[j].data.length; i++) {
            var value = datasets[j].data[i].value;
            if (value > maxValue)
                maxValue = value;

            data[j].push(value);
        }
        datasets[j].data = data[j];
    }

    var ctx = canvas.getContext("2d");
    var plotData = {
        labels: labels,
        datasets: datasets
    };

    var chartOptions = {};
    var steps = 5;
    var max = 5;
    // @todo Refactor to scale sensibly automatically
    if (maxValue > 300) {
        var steps = 10;
        var max = 400;
    } else if (maxValue > 100) {
        var steps = 10;
        var max = 200;
    } else if (maxValue > 50) {
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
        scaleStartValue: 0,
        datasetStrokeWidth: 3
    };

    ctx.canvas.height = $('#' + canvasId).attr('origionalHeight');
    ctx.canvas.width = $('#' + canvasId).attr('origionalWidth');
    var myNewChart = new Chart(ctx).Line(plotData, chartOptions);

};