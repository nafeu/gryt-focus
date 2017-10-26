// -----------------------------------------------------------------------------
// D3 Configurations
// -----------------------------------------------------------------------------

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
});
