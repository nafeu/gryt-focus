var socket = io({
  'reconnection': false
});

$(document).ready(function(){

  // DOM Selectors
  body = $("body");
  main = $("#main");
  timer = $("#timer");
  toggleBtn = $("#toggle-btn");
  resetBtn = $("#reset-btn");

  body.fadeIn();

  backgroundStyleSettings = {
    colors: [
      '#2980b9',
      '#16a085',
      '#27ae60',
      '#f39c12',
      '#d35400',
      '#c0392b',
      '#8e44ad'
    ],
    currentColorIdx: 0,
    getColor: function(){
      if (this.currentColorIdx == this.colors.length - 1) {
        this.currentColorIdx = 0;
        return this.colors[this.currentColorIdx];
      } else {
        return this.colors[this.currentColorIdx++];
      }
    }
  };
  body.css("background-color", backgroundStyleSettings.getColor());
  backgroundCycle = setInterval(function(){
    body.css("background-color", backgroundStyleSettings.getColor());
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