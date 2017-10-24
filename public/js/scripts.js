$(document).ready(function(){

// -----------------------------------------------------------------------------
// D3 Configurations
// -----------------------------------------------------------------------------

var margin = {top: 15, right: 2, bottom: 10, left: 0},
    width = $("#perf-chart").width() - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var dataset = d3.range(NUM_DATA_POINTS)
  .map(function(d) {
    return {"y": "0.0"};
  });

var xScale = d3.scaleLinear()
    .domain([0, NUM_DATA_POINTS - 1])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

var line = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d) { return yScale(d.y); });
    // .curve(d3.curveMonotoneX);

var svg = d3.select("#perf-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

if (SHOW_AXIS) {
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));
  svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));
}

function make_x_gridlines() {
    return d3.axisBottom(xScale)
        .ticks(10);
}

function make_y_gridlines() {
    return d3.axisLeft(yScale)
        .ticks(10);
}

svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat(""));

svg.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat(""));

svg.append("path")
    .datum(dataset)
    .attr("class", "line")
    .attr("d", line);

if (SHOW_DOTS) {
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", function(d, i) {
      return xScale(i);
    })
    .attr("cy", function(d) {
      return yScale(d.y);
    })
    .attr("r", 5);
}


function generateData() {
  dataset.shift();
  datapoint = {y: dataset[dataset.length - 1].y};
  if ((parseFloat(datapoint.y) + Y_DELTA) <= Y_TOP_LIMIT && Math.random() >= RANDOM_HIGH_DIVIDER) {
    datapoint.y = (parseFloat(datapoint.y) + Y_DELTA).toString();
  }
  else if ((parseFloat(datapoint.y) - Y_DELTA) >= Y_BOTTOM_LIMIT && Math.random() < RANDOM_LOW_DIVIDER) {
    datapoint.y = (parseFloat(datapoint.y) - Y_DELTA).toString();
  }
  dataset.push(datapoint);
  return dataset;
}

function update(data) {

  svg.select(".line")
    // .transition()
    .attr("d", line(data));

  svg.selectAll('circle')
    .data(data)
    // .transition()
    .attr("cx", function(d, i) {
      return xScale(i);
    })
    .attr("cy", function(d) {
      return yScale(d.y);
    });

}

document.addEventListener('keypress', function(event) {
  if (event.which == 114) update(generateData()); // r
});

function main() {
  contentTask.css('font-size', DEFAULT_TEXTAREA_FONT_SIZE);
  body.fadeIn();
  contentLength.text(timerLength);
  alarm.css('height', $(window).height());
  activityLogContainer.css('height', $(window).height());
  ui.cycleColor();
}

main();

});