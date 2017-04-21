var socket = io({
  'reconnection': false
});

$(document).ready(function(){

  // DOM Selectors
  main = $("#main");

  main.hide();
  main.fadeIn();

  // Socket Events
  socket.on("update", function(data){
    main.fadeOut();
    setTimeout(function () {
      main.text(data);
      main.fadeIn();
    }, 500);
  });

});