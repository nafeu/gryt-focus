// -----------------------------------------------------------------------------
// Socket Events
// -----------------------------------------------------------------------------

if (remoteStatus) {

  socket = io({
    'reconnection': false
  });

  socket.on("lan", function(data){
    app.showLanAddress(data.addresses[0] + ":" + data.port);
  });

  socket.on("task", function(data){
    app.setTask(data);
    app.stopAlarm();
  });

  socket.on("toggle", function(){
    app.toggleTimer();
    app.stopAlarm();
  });

  socket.on("save", function() {
    app.save();
    app.reset();
    app.stopAlarm();
  });

  socket.on("undo", function() {
    app.reset();
    app.stopAlarm();
  });

  socket.on("interrupt", function() {
    app.interrupt();
    app.stopAlarm();
  });

  socket.on("length", function(data) {
    app.setLength(data);
    app.stopAlarm();
  });

  socket.on("snooze", function(data) {
    app.stopAlarm();
  });

  socket.on("mode", function() {
    app.toggleLightingMode();
  });

  socket.on("reload", function() {
    location.reload();
  });

  socket.on('log', function(data){
    app.toggleActivityLog();
  });

}

// -----------------------------------------------------------------------------
// Event Handlers
// -----------------------------------------------------------------------------

$(document).ready(function(){

$(window).resize(function(){
  alarm.css('height', $(window).height());
  activityLogContainer.css('height', $(window).height());
  $("#perf-chart svg").remove();
  draw();
  $(".line").css({"stroke": ui.currentThemeColor});
  $(".grid line, .grid path").css({"stroke": ui.currentThemeColor});
});

activeButton.click(function(){
  app.toggleTimer();
});

saveButton.dblclick(function(){
  app.save();
  app.reset();
});

undoButton.dblclick(function(){
  app.reset();
});

contentTask.keypress(function(e) {
  if(e.which == KEYCODE_ENTER && !e.shiftKey) {
    $(this).blur();
  }
});

contentTask.on('focus', function(){
  if ($(this).text() === TEXT_PLACEHOLDER) {
    $(this).text("");
  }
});

contentSession.on("click", function(){
  app.incrementSession();
});

interruptButton.on("click", function(){
  app.interrupt();
});

lightingModeButton.on("click", function(){
  ui.updateAppColorTransition("500ms");
  app.toggleLightingMode();
  setTimeout(function(){
      ui.resetAppColorTransition();
  }, 500);
});

randomButton.on('click', function(){
  ui.updateAppColorTransition("500ms");
  if (!ui.allowCycling) {
    colorPicker.click();
  } else {
    ui.cycleColor();
    setTimeout(function(){
      ui.resetAppColorTransition();
    }, 500);
  }
});

randomButton.longpress(function(){
  ui.toggleColorMode();
});

colorPicker.on('change', function(){
  ui.setPickedColor($(this).val());
});

body.mousemove(function(){
  app.stopAlarm();
});

clockButton.dblclick('click', function(){
  app.pauseTimer();
  app.toggleLength();
});

clockButton.longpress(function(){
  app.manuallySetTimerLength();
});

contentLength.on('click', function(){
  app.manuallySetTimerLength(true);
});

contentLength.on('blur', function(){
  $(this).attr('contenteditable', 'false');
  app.setLength($(this).text());
  setDataRange(timerLength * 60);
  $("#perf-chart svg").remove();
  draw(ui.currentThemeColor);
});

contentLength.keypress(function(e){
  if (e.which == 13) {
    $(this).blur();
  }
});

fullscreenButton.on('click', function(){
  console.log("CLICKED...");
  app.toggleFullscreen();
});

showActivityLogButton.on('click', function(){
  app.showActivityLog();
});

hideActivityLogButton.on('click', function(){
  app.hideActivityLog();
});

resetActivityLogButton.dblclick(function(){
  app.resetActivityLog();
});

actionTips.forEach(function(action){
  action.element.on('mouseenter', function(){
    app.setActionTip(action.text);
  });
  action.element.on('mouseleave', function(){
    app.resetActionTip();
  });
});

contentTask.on('keydown change', function(){
  app.adjustTaskFontSize();
});

});