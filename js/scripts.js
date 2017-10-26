// -----------------------------------------------------------------------------
// D3 Configurations
// -----------------------------------------------------------------------------

var dataset = d3.range(NUM_DATA_POINTS)
  .map(function(d) {
    return {"y": "0.0"};
  });

function shuffleData() {
  dataset.shift();
  datapoint = {y: dataset[dataset.length - 1].y};
  if ((parseFloat(datapoint.y) + Y_DELTA) <= Y_TOP_LIMIT && Math.random() >= RANDOM_HIGH_DIVIDER) {
    datapoint.y = (parseFloat(datapoint.y) + Y_DELTA).toString();
  }
  else if ((parseFloat(datapoint.y) - Y_DELTA) >= Y_BOTTOM_LIMIT && Math.random() < RANDOM_LOW_DIVIDER) {
    datapoint.y = (parseFloat(datapoint.y) - Y_DELTA).toString();
  }
  dataset.push(datapoint);
}

function draw() {
  var elementWidth = $("#perf-chart").width();
  var elementHeight = $("#section-b-container").height() * 0.7;

  var width = elementWidth - margin.left - margin.right;
  var height = elementHeight - margin.top - margin.bottom;

  var xScale = d3.scaleLinear()
      .domain([0, NUM_DATA_POINTS - 1])
      .range([0, width]);

  var yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

  line = d3.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return yScale(d.y); });

  function makeXGridlines() {
      return d3.axisBottom(xScale)
          .ticks(10);
  }

  function makeYGridlines() {
      return d3.axisLeft(yScale)
          .ticks(10);
  }

  svgChart = d3.select("#perf-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svgChart.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(makeXGridlines()
          .tickSize(-height)
          .tickFormat(""));

  svgChart.append("g")
      .attr("class", "grid")
      .call(makeYGridlines()
          .tickSize(-width)
          .tickFormat(""));

  svgChart.append("path")
      .datum(dataset)
      .attr("class", "line")
      .attr("d", line);
}

function update() {
  svgChart.select(".line")
    .attr("d", line(dataset));

  svgChart.selectAll('circle')
    .data(dataset)
    .attr("cx", function(d, i) {
      return xScale(i);
    })
    .attr("cy", function(d) {
      return yScale(d.y);
    });
}

$(document).ready(function(){
  document.addEventListener('keypress', function(event) {
    if (event.which == 114) {
      shuffleData();
      update();
    }
  });

  function main() {
    contentTask.css('font-size', DEFAULT_TEXTAREA_FONT_SIZE);
    body.fadeIn();
    contentLength.text(timerLength);
    alarm.css('height', $(window).height());
    activityLogContainer.css('height', $(window).height());
    ui.cycleColor();
  }

  draw();
  update();
  main();

  $(window).resize(function(){
    $("#perf-chart svg").remove();
    draw();
    $(".line").css({"stroke": ui.currentThemeColor});
    $(".grid line, .grid path").css({"stroke": ui.currentThemeColor});
  });
});
