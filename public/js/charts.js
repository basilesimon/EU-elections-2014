
function showRegionalPollPieChart(region) {
    var url = "";
    var canvasId = "";
    
    if (region) {
        url = "json/results/"+region.toLowerCase().replace(/ /g, '')+".json";
        canvasId = "regional-poll";
    } else {
        url = "json/results/national.json";
        canvasId = "national-poll";
    }
    
    // @todo No results for N.I. yet
    if (region == "Northern Ireland") {
        url = "json/results/national.json";
    }
    
    $('#' + canvasId).hide();
    
    $.getJSON(gServer+url, function(pollData) {
        $('#' + canvasId).show();

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
    drawPieChart("candidates-by-party", gServer+"json/candidates-by-party.json");
    drawPieChart("mentions-by-party", gServer+"json/mentions-by-party.json");

    showRegionalPollPieChart();
});