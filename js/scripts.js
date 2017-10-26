$(document).ready(function(){
  function main() {
    contentTask.css('font-size', DEFAULT_TEXTAREA_FONT_SIZE);
    body.fadeIn();
    contentLength.text(timerLength);
    alarm.css('height', $(window).height());
    activityLogContainer.css('height', $(window).height());
    ui.cycleColor();
  }

  draw();
  renderChart();
  main();
});
