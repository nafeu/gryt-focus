var socket, appState, bg, theme, defaultLengthInMin = 25;
moment().format();

var remoteStatus = false;
if ($.url().param("remote")) remoteStatus = true;
if ($.url().param("theme")) theme = $.url().param("theme").split(",");

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
    themeColors: [
      ['#455a64', '#718792', '#1c313a'], // Grey
      ['#d32f2f', '#ff6659', '#9a0007'], // Red
      ['#7b1fa2', '#ae52d4', '#4a0072'], // Purple
      ['#303f9f', '#666ad1', '#001970'], // Indigo
      ['#0288d1', '#5eb8ff', '#005b9f'], // Blue
      ['#00796b', '#48a999', '#004c40'], // Teal
      ['#4caf50', '#80e27e', '#087f23'], // Green
      ['#f57c00', '#ffad42', '#bb4d00'], // Orange
    ],
    currentColorIdx: 0,
    getNextColor: function(){
      if (this.currentColorIdx == this.themeColors.length) {
        this.currentColorIdx = 0;
        return this.themeColors[this.currentColorIdx];
      } else {
        return this.themeColors[this.currentColorIdx++];
      }
    },
    cycleColor: function() {
      var pallette;
      if (theme) {
        pallette = theme;
        var textColorIndex = 3;
        if (pallette[textColorIndex]) {
          body.css("color", pallette[textColorIndex]);
        }
      } else {
        pallette = this.getNextColor();
      }
      sectionA.css("background-color", pallette[0]);
      sectionB.css({"background-color": pallette[1], "color": pallette[2]});
      sectionC.css("background-color", pallette[2]);
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
    }
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