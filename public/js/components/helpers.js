// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function issueAlarmNotification(taskName) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications. Try Chromium.");
  }
  else if (Notification.permission === "granted") {
    var notification = new Notification(NOTIFICATION_TITLE, {
      icon: NOTIFICATION_IMG_URL,
      body: taskName,
    });
    notification.onclick = function () {
      app.stopAlarm();
      window.focus();
    };
  }
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        issueAlarmNotification(taskName);
      }
    });
  }
}

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

var themeColors = [
  "#d32f2f",
  "#7b1fa2",
  "#303f9f",
  "#0288d1",
  "#00796b",
  "#4caf50",
  "#f57c00",
  "#E66A39",
  "rgb(236, 100, 75)",
  "rgb(210, 77, 87)",
  "rgb(242, 38, 19)",
  "rgb(217, 30, 24)",
  "rgb(150, 40, 27)",
  "rgb(239, 72, 54)",
  "rgb(214, 69, 65)",
  "rgb(192, 57, 43)",
  "rgb(207, 0, 15)",
  "rgb(231, 76, 60)",
  "rgb(219, 10, 91)",
  "rgb(246, 71, 71)",
  "rgb(241, 169, 160)",
  "rgb(210, 82, 127)",
  "rgb(224, 130, 131)",
  "rgb(246, 36, 89)",
  "rgb(226, 106, 106)",
  "rgb(220, 198, 224)",
  "rgb(102, 51, 153)",
  "rgb(103, 65, 114)",
  "rgb(174, 168, 211)",
  "rgb(145, 61, 136)",
  "rgb(154, 18, 179)",
  "rgb(191, 85, 236)",
  "rgb(190, 144, 212)",
  "rgb(142, 68, 173)",
  "rgb(155, 89, 182)",
  "rgb(68,108,179)",
  "rgb(228, 241, 254)",
  "rgb(65, 131, 215)",
  "rgb(89, 171, 227)",
  "rgb(129, 207, 224)",
  "rgb(82, 179, 217)",
  "rgb(197, 239, 247)",
  "rgb(34, 167, 240)",
  "rgb(52, 152, 219)",
  "rgb(25, 181, 254)",
  "rgb(107, 185, 240)",
  "rgb(30, 139, 195)",
  "rgb(58, 83, 155)",
  "rgb(103, 128, 159)",
  "rgb(37, 116, 169)",
  "rgb(31, 58, 147)",
  "rgb(137, 196, 244)",
  "rgb(75, 119, 190)",
  "rgb(92, 151, 191)",
  "rgb(78,205,196)",
  "rgb(162, 222, 208)",
  "rgb(135, 211, 124)",
  "rgb(144, 198, 149)",
  "rgb(38, 166, 91)",
  "rgb(3, 201, 169)",
  "rgb(104, 195, 163)",
  "rgb(101, 198, 187)",
  "rgb(27, 188, 155)",
  "rgb(27, 163, 156)",
  "rgb(102, 204, 153)",
  "rgb(54, 215, 183)",
  "rgb(200, 247, 197)",
  "rgb(134, 226, 213)",
  "rgb(46, 204, 113)",
  "rgb(22, 160, 133)",
  "rgb(63, 195, 128)",
  "rgb(1, 152, 117)",
  "rgb(3, 166, 120)",
  "rgb(77, 175, 124)",
  "rgb(42, 187, 155)",
  "rgb(0, 177, 106)",
  "rgb(30, 130, 76)",
  "rgb(4, 147, 114)",
  "rgb(38, 194, 129)",
  "rgb(245, 215, 110)",
  "rgb(247, 202, 24)",
  "rgb(244, 208, 63)",
  "rgb((233,212,96))",
  "rgb(253, 227, 167)",
  "rgb(248, 148, 6)",
  "rgb(235, 149, 50)",
  "rgb(232, 126, 4)",
  "rgb(244, 179, 80)",
  "rgb(242, 120, 75)",
  "rgb(235, 151, 78)",
  "rgb(245, 171, 53)",
  "rgb(211, 84, 0)",
  "rgb(243, 156, 18)",
  "rgb(249, 105, 14)",
  "rgb(249, 191, 59)",
  "rgb(242, 121, 53)",
  "rgb(230, 126, 34)",
  "rgb(236,236,236)",
  "rgb(108, 122, 137)",
  "rgb(210, 215, 211)",
  "rgb(238, 238, 238)",
  "rgb(189, 195, 199)",
  "rgb(236, 240, 241)",
  "rgb(149, 165, 166)",
  "rgb(218, 223, 225)",
  "rgb(171, 183, 183)",
  "rgb(242, 241, 239)",
  "rgb(191, 191, 191)"
];