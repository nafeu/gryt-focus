var socket = io({
  'reconnection': false
});

$(document).ready(function(){

  // DOM Selectors
  main = $("#main");
  body = $("body");

  main.hide();
  main.fadeIn();

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

});