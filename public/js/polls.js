
function showLocalPoll(region) {
  if (region === "London") {
    var data = $.getJSON("json/polls/london.json", draw);
  } else if (region === "Scotland") {
    var data = $.getJSON("json/polls/scotland.json", draw);
  } else if (region === "East Midlands" || region === "West Midlands" || region === "Wales") {
    var data = $.getJSON("json/polls/midlands.json", draw);
  } else if (region === "North West England" || region === "North East England" || region === "Yorkshire and the Humber") {
    var data = $.getJSON("json/polls/north.json", draw);
  } else if (region === "South West England" || region === "South East England"
    var data = $.getJSON("json/polls/south.json", draw);
  } else {
      return;
  }
  function draw(data) {
      var canvasId = "regionalcanvas";
      var canvas = document.getElementById(canvasId);
      var ctx = canvas.getContext("2d");

        // Hack to stop Chart.js incorrectly resizing graph on subsquent
        // redraws on some displays (a known bug).
        if (!$('#' + canvasId).attr('origionalHeight')) {
            $('#' + canvasId).attr('origionalHeight', canvas.height);
            $('#' + canvasId).attr('origionalWidth', canvas.width);
        }

        var options = { segmentStrokeWidth : 1,
                        segmentShowStroke : false };

        ctx.canvas.height = $('#' + canvasId).attr('origionalHeight');
        ctx.canvas.width = $('#' + canvasId).attr('origionalWidth');

        var chart = new Chart(ctx).Doughnut(data, options);
          ctx.rotate(-90*Math.PI/180);
          ctx.translate(-300,0);
  }
}