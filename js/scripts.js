var socket = io({
  'reconnection': false
});

var timerStatus = false;

$(document).ready(function(){

  // DOM Selectors
  body = $("body");
  main = $("#main");
  timer = $("#timer");
  startBtn = $("#start-btn");
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
  startBtn.on("click", function(){
    if (timerStatus) {
      socket.emit('timer', { action: "stop" });
      startBtn.text("start");
    } else {
      socket.emit('timer', { action: "start" });
      startBtn.text("stop");
    }
  });

  resetBtn.on("click", function(){
    socket.emit('timer', { action: "reset" });
  });

  // Socket Events
  socket.on("message", function(data){
    main.fadeOut();
    setTimeout(function () {
      main.text(data);
      main.fadeIn();
    }, 500);
  });

  socket.on("background", function(data){
    body.css("background-color", data);
  });

  socket.on("timer-status", function(data){
    timerStatus = data.status;
  });

  socket.on("seconds", function(data){
    timer.text(data);
  });

});