var socket = io({
  'reconnection': false
});

$(document).ready(function(){

  // DOM Selectors
  body = $("body");
  sectionA = $("#section-a");
  sectionB = $("#section-b");
  sectionC = $("#section-c");
  main = $("#main");
  timer = $("#timer");
  toggleBtn = $("#toggle-btn");
  resetBtn = $("#reset-btn");

  body.fadeIn();

  bg = {
    colors: [
      ['#d32f2f', '#ff6659', '#9a0007'],
      ['#7b1fa2', '#ae52d4', '#4a0072'],
      ['#303f9f', '#666ad1', '#001970'],
      ['#0288d1', '#5eb8ff', '#005b9f'],
      ['#00796b', '#48a999', '#004c40'],
      ['#689f38', '#99d066', '#387002'],
      ['#f57c00', '#ffad42', '#bb4d00'],
      ['#455a64', '#718792', '#1c313a'],
    ],
    currentColorIdx: 0,
    getColor: function(){
      if (this.currentColorIdx == this.colors.length) {
        this.currentColorIdx = 0;
        return this.colors[this.currentColorIdx];
      } else {
        return this.colors[this.currentColorIdx++];
      }
    },
    cycleColor: function() {
      var pallette = this.getColor();
      sectionA.css("background-color", pallette[0]);
      sectionB.css({"background-color": pallette[1], "color": pallette[2]});
      sectionC.css("background-color", pallette[2]);
    }
  };

  // Cycle background color
  bg.cycleColor();
  setInterval(function(){
    bg.cycleColor();
  }, 10000);

  // Click Events
  toggleBtn.on("click", function(){
    socket.emit('interaction', {
      component: "timer",
      action: "toggle"
    });
  });

  resetBtn.on("click", function(){
    socket.emit('interaction', {
      component: "timer",
      action: "reset"
    });
  });

  socket.on("update-ui", function(data){
    data.forEach(function(element){
      var props = Object.keys(element.props);
      props.forEach(function(prop){
        if (prop == "text") {
          $(element.sel).text(element.props[prop]);
        } else {
          $(element.sel).prop(prop, element.props[prop]);
        }
      });
    });
  });

});

var uiRenderer = {
  getWidget: function(data){
    return $("<div>")
      .append($("<div>", {class: "title"}).text(data.title))
      .append(function(){
        if (data.hr) return "<hr>";
        return "";
      })
      .append($("<div>", {class: "content"}).text(data.content));
  }
};

function testRenderer() {
  var testData = {
    "target": "#section-a",
    "title": "Test title:",
    "content": "Here is some content"
  };
  $(testData.target).html(uiRenderer.getWidget(testData).html());
}