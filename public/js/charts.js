
function showRegionalPollPieChart(region) {
    var url = "";
    var canvasId = "regional-poll";
    if (region === "London") {
        url = "/json/polls/london.json";
    } else if (region === "Scotland") {
        url = "/json/polls/scotland.json";
    } else if (region === "East Midlands" || region === "West Midlands" || region === "Wales") {
        url = "/json/polls/midlands.json";
    } else if (region === "North West England" || region === "North East England" || region === "Yorkshire and the Humber") {
        url = "/json/polls/north.json";
    } else if (region === "South West England" || region === "South East England" || region === "East of England") {
        url = "/json/polls/south.json";
    } else {
        url = "/json/polls/national.json";
        canvasId = "national-poll";
    }
    $.getJSON(url, function(pollData) {
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext("2d");

        // Hack to stop Chart.js incorrectly resizing graph on subsquent
        // rerenderPolls on some displays (a known bug).
        if (!$('#' + canvasId).attr('origionalHeight')) {
            $('#' + canvasId).attr('origionalHeight', canvas.height);
            $('#' + canvasId).attr('origionalWidth', canvas.width);
        }

        var options = { segmentStrokeWidth : 1,
                        segmentShowStroke : false,
                        showTooltips: false };

        ctx.canvas.height = $('#' + canvasId).attr('origionalHeight');
        ctx.canvas.width = $('#' + canvasId).attr('origionalWidth');

        var chart = new Chart(ctx).Doughnut(pollData, options);
        ctx.rotate(-90*Math.PI/180);
        ctx.translate(-300,0);
    });
}

function drawPieChart(canvasId, url) {
    var canvas = document.getElementById(canvasId);
    
    $.getJSON(url, function(pollData) {
        var ctx = canvas.getContext("2d");
    
        if (!$('#' + canvasId).attr('origionalHeight')) {
            $('#' + canvasId).attr('origionalHeight', canvas.height);
            $('#' + canvasId).attr('origionalWidth', canvas.width);
        }
    
        ctx.canvas.height = $('#' + canvasId).attr('origionalHeight');
        ctx.canvas.width = $('#' + canvasId).attr('origionalWidth');

        var ctx = canvas.getContext("2d");
        var candidatesChart = new Chart(ctx).Doughnut(pollData, { segmentStrokeWidth : 1 });
    });
}

$(function() {
    drawPieChart("candidates-by-party", "json/candidates-by-party.json");
    drawPieChart("mentions-by-party", "json/mentions-by-party.json");

    showRegionalPollPieChart();
});