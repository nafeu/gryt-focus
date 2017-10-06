var socket,
    appState,
    bg,
    theme,
    mode,
    defaultLengthInMin = 25,
    defaultDarkTone = '#1C2021',
    defaultMode = 'night';

moment().format();

var remoteStatus = false;
if ($.url().param("remote")) remoteStatus = true;
if ($.url().param("theme")) theme = $.url().param("theme");
if ($.url().param("mode")) {
  mode = $.url().param("mode");
} else {
  mode = defaultMode;
}

if (remoteStatus) {

  console.log("Remote status is active...");

  socket = io({
    'reconnection': false
  });

  socket.on("task", function(data){
    console.log("[ socket ] set-task : ", data);
    appState.setTask(data);
    appState.stopAlarm();
  });

  socket.on("toggle", function(){
    console.log("[ socket ] toggle-timer");
    appState.toggleTimer();
    appState.stopAlarm();
  });

  socket.on("reset", function() {
    console.log("[ socket ] reset");
    appState.reset();
    appState.stopAlarm();
  });

  socket.on("interrupt", function() {
    console.log("[ socket ] interrupt");
    appState.interrupt();
    appState.stopAlarm();
  });

  socket.on("length", function(data) {
    console.log("[ socket ] length");
    appState.setLength(parseInt(data) || 0);
    appState.stopAlarm();
  });

  socket.on("snooze", function(data) {
    console.log("[ socket ] snooze");
    appState.stopAlarm();
  });

  socket.on("mode", function() {
    console.log("[ socket ] mode");
    appState.toggleMode();
  });

}

$(document).ready(function(){

  // DOM Selectors
  body = $("body");
  sectionA = $("#section-a");
  sectionB = $("#section-b");
  sectionC = $("#section-c");
  alarm = $("#alarm");
  contentSession = $("#content-session");
  contentLength = $("#content-length");
  contentTime = $("#content-time");
  contentInterrupts = $("#content-interrupts");
  contentFocus = $("#content-focus");
  contentTask = $("#content-task");
  contentActive = $("#content-active");
  contentLog = $("#content-log");
  contentLogContainer = $("#content-log table");
  logTable = $("#log-table");
  toggle = $("#toggle");

  appState = {
    interrupts: 0,
    seconds: 0,
    length: defaultLengthInMin * 60,
    active: false,
    stopwatchInterval: null,
    alarmStatus: false,
    alarmFlashStatus: false,
    alarmInterval: null,
    mode: mode,

    reset: function(){

      var tr = $("<tr>")
        .append('<td class="table-col-small">' + Math.round(appState.seconds/60) + '</td>')
        .append('<td class="table-col-small">' + contentInterrupts.text() + '</td>')
        .append('<td class="table-col-small">' + contentFocus.text() + '</td>')
        .append('<td class="table-desc">' + contentTask.text() + '</td>');

      if (contentSession.text() === "1") {
        logTable.empty();
      }
      logTable.append(tr);

      appState.interrupts = 0;
      appState.seconds = 0;
      appState.incrementSession();
      clearInterval(appState.stopwatchInterval);
      contentActive.text("Inactive");
      contentTime.text("...");
      contentTask.text("...");
      contentFocus.text("...");
      contentInterrupts.text("0");
      bg.stopCycle();
    },

    toggleTimer: function() {
      if (!appState.active) {
        bg.startCycle();
        appState.active = true;
        contentActive.text("Active");
        appState.stopwatchInterval = setInterval(function(){
          appState.seconds++;
          appState.length--;
          contentTime.text(moment.utc(appState.seconds*1000).format('HH:mm:ss'));
          contentLength.text(Math.ceil(appState.length / 60));
          contentFocus.text(function(){
            var focus = Math.round((1 - (appState.interrupts / (appState.seconds/60)))*100);
            if ((focus < 0) || appState.seconds < 60) {
              return "---";
            } else {
              return focus + "%";
            }
          });
          if (appState.length < 1) {
            appState.toggleTimer();
            appState.startAlarm();
          }
        }, 1000);
      } else {
        bg.stopCycle();
        clearInterval(appState.stopwatchInterval);
        appState.active = false;
        contentActive.text("Paused");
      }
    },

    interrupt: function() {
      contentInterrupts.text(parseInt(contentInterrupts.text()) + 1);
      appState.interrupts++;
    },

    incrementSession: function() {
      contentSession.text(parseInt(contentSession.text()) + 1);
    },

    setTask: function(task) {
      contentTask.text(task);
    },

    setLength: function(length) {
      if (appState.active) {
        appState.toggleTimer();
      }
      contentLength.text(length);
      appState.length = length * 60;
      defaultLengthInMin = length;
    },

    startAlarm: function(){
      alarm.show();
      appState.alarmInterval = setInterval(function(){
        if (appState.alarmFlashStatus) {
          alarm.css({
            "color": "black",
            "background-color": "white"
          });
        } else {
          alarm.css({
            "color": "white",
            "background-color": "black"
          });
        }
        appState.alarmFlashStatus = !appState.alarmFlashStatus;
      }, 500);
    },

    stopAlarm: function() {
      clearInterval(appState.alarmInterval);
      appState.length = defaultLengthInMin * 60;
      contentLength.text(defaultLengthInMin);
      alarm.hide();
    },

    toggleMode: function() {
      if (appState.mode === 'night') {
        appState.mode = 'day';
      } else {
        appState.mode = 'night';
      }
    }

  };

  body.fadeIn();
  contentLength.text(defaultLengthInMin);
  alarm.css('height', $(window).height());

  $(window).resize(function(){
    alarm.css('height', $(window).height());
  });

  bg = {
    interval: null,
    getNextColor: function(){
      return themeColors[Math.floor(Math.random()*themeColors.length)];
    },
    cycleColor: function() {
      var pallette, primary, secondary;
      if (theme) {
        chosenColor = theme;
      } else {
        chosenColor = this.getNextColor();
      }
      if (appState.mode === 'night') {
        primary = chosenColor;
        secondary = defaultDarkTone;
      } else {
        primary = defaultDarkTone;
        secondary = chosenColor;
      }
      sectionA.css({"background-color": secondary, "color": primary});
      sectionB.css({"background-color": primary, "color": secondary});
      sectionC.css({"background-color": secondary, "color": primary});
      contentLogContainer.css("border-color", primary);
    },
    startCycle: function() {
      bg.cycleColor();
      this.interval = setInterval(function(){
        bg.cycleColor();
      }, 10000);
    },
    stopCycle: function() {
      this.currentColorIdx = 0;
      bg.cycleColor();
      clearInterval(this.interval);
    },
  };

  // Cycle background color
  bg.cycleColor();

  // Keyboard/Click Events
  toggle.dblclick(function(){
    appState.toggleTimer();
  });

  toggle.longpress(function(){
    appState.reset();
  });

  contentTask.keypress(function(e) {
    if(e.which == 13) {
      appState.toggleTimer();
    }
  });

  contentSession.on("click", function(){
    appState.incrementSession();
  });

  contentInterrupts.on("click", function(){
    appState.interrupt();
  });

  body.mousemove(function(){
    appState.stopAlarm();
  });

});

var themeColors = [
  "#455a64",
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
  "rgb(44, 62, 80)",
  "rgb(25, 181, 254)",
  "rgb(51, 110, 123)",
  "rgb(34, 49, 63)",
  "rgb(107, 185, 240)",
  "rgb(30, 139, 195)",
  "rgb(58, 83, 155)",
  "rgb(52, 73, 94)",
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