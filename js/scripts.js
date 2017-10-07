var socket,
    appState,
    bg,
    theme,
    mode,
    defaultLengthInMin = 25,
    defaultDarkTone = '#1C2021',
    defaultMode = 'night',
    defaultTransition = '4s';
    alarmChord = new Audio('assets/alarm-chord.wav');

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
    appState.setLength(data);
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
  sectionAContainer = $("#section-a-container");
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
  actionButtons = $("#action-buttons");
  activeButton = $("#active-button");
  resetButton = $("#reset-button");
  interruptButton = $("#interrupt-button");
  modeButton = $("#mode-button");
  randomButton = $("#random-button");
  colorPicker = $("#color-picker");

  appState = {
    interrupts: 0,
    seconds: 0,
    length: defaultLengthInMin * 60,
    origLength: null,
    active: false,
    stopwatchInterval: null,
    alarmStatus: false,
    alarmFlashStatus: false,
    alarmInterval: null,
    mode: mode,
    lengthOptionIndex: 0,

    reset: function(){
      var tr = $("<tr>")
        .append('<td class="table-col-small">' + Math.round(appState.seconds/60) + '</td>')
        .append('<td class="table-col-small">' + contentInterrupts.text() + '</td>')
        .append('<td class="table-col-small">' + contentFocus.text() + '</td>')
        .append('<td class="table-desc">' + contentTask.text() + '</td>');

      if (contentSession.text() === "1") {
        logTable.empty();
      }
      logTable.prepend(tr);

      appState.interrupts = 0;
      appState.seconds = 0;
      appState.active = false;
      appState.incrementSession();
      clearInterval(appState.stopwatchInterval);
      contentActive.text("Inactive");
      contentTime.text("...");
      contentTask.text("...");
      contentFocus.text("...");
      contentInterrupts.text("0");
      appState.setLength(defaultLengthInMin);
      activeButton.removeClass("fa-hourglass-start").addClass("fa-hourglass-end");
      bg.stopCycle();
    },

    toggleTimer: function() {
      if (!appState.active) {
        bg.startCycle();
        appState.setLength(defaultLengthInMin);
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
        activeButton.removeClass("fa-hourglass-end").addClass("fa-hourglass-start");
      } else {
        bg.stopCycle();
        clearInterval(appState.stopwatchInterval);
        appState.active = false;
        contentActive.text("Paused");
        activeButton.removeClass("fa-hourglass-start").addClass("fa-hourglass-end");
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
      confirmedLength = parseInt(length) || defaultLengthInMin;
      if (confirmedLength < 1) {
        confirmedLength = 1;
      }
      if (appState.active) {
        appState.toggleTimer();
      }
      contentLength.text(confirmedLength);
      appState.length = confirmedLength * 60;
      defaultLengthInMin = confirmedLength;
    },

    startAlarm: function(){
      alarm.show();
      alarmChord.play();
      appState.alarmInterval = setInterval(function(){
        if (appState.alarmFlashStatus) {
          alarm.css({
            "color": "black",
            "background-color": "white"
          });
          alarmChord.play();
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
      alarm.hide();
    },

    toggleMode: function() {
      if (appState.mode === 'night') {
        modeButton.removeClass("fa-moon-o").addClass("fa-sun-o");
        appState.mode = 'day';
      } else {
        modeButton.removeClass("fa-sun-o").addClass("fa-moon-o");
        appState.mode = 'night';
      }
      bg.invertColor();
    },

    toggleLength: function() {
      var options = [25, 20, 15, 10, 5, 4, 3, 2, 1];
      if (appState.lengthOptionIndex === options.length - 1) {
        appState.lengthOptionIndex = 0;
      } else {
        appState.lengthOptionIndex++;
      }
      appState.setLength(options[appState.lengthOptionIndex]);
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
    allowCycling: true,
    currentThemeColor: null,
    currentAccentColor: null,
    getNextColor: function(){
      return themeColors[Math.floor(Math.random()*themeColors.length)];
    },
    cycleColor: function() {
      if (this.allowCycling) {
        if (appState.mode === 'night') {
          this.currentThemeColor = theme || this.getNextColor();
          this.currentAccentColor = defaultDarkTone;
        } else {
          this.currentThemeColor = defaultDarkTone;
          this.currentAccentColor = theme || this.getNextColor();
        }
        bg.setAppColors(this.currentThemeColor, this.currentAccentColor);
      }
    },
    invertColor: function() {
      var origThemeColor = this.currentThemeColor;
      this.currentThemeColor = this.currentAccentColor;
      this.currentAccentColor = origThemeColor;
      bg.setAppColors(this.currentThemeColor, this.currentAccentColor);
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
    setAppColors: function(theme, accent) {
      sectionA.css({"color": theme});
      sectionAContainer.css("background-color", accent);
      sectionB.css({"background-color": theme, "color": accent});
      sectionC.css({"background-color": accent, "color": theme});
      contentLogContainer.css("border-color", theme);
      actionButtons.css({"color": theme});
    },
    setPickedColor: function(color) {
      if (appState.mode === 'night') {
        this.currentThemeColor = color;
      } else {
        this.currentAccentColor = color;
      }
      this.setAppColors(this.currentThemeColor, this.currentAccentColor);
    },
    toggleColorMode: function(){
      this.allowCycling = !this.allowCycling;
      if (this.allowCycling) {
        randomButton.removeClass("fa-eyedropper").addClass("fa-random");
      } else {
        randomButton.removeClass("fa-random").addClass("fa-eyedropper");
      }
    },
    updateAppColorTransition: function(transition) {
      sectionA.css('transition', transition + " all ease-in-out");
      sectionAContainer.css('transition', transition + " all ease-in-out");
      sectionB.css('transition', transition + " all ease-in-out");
      sectionC.css('transition', transition + " all ease-in-out");
      contentLogContainer.css('transition', transition + " border ease-in-out");
      actionButtons.css('transition', transition + " all ease-in-out");
    },
    resetAppColorTransition: function(){
      this.updateAppColorTransition(defaultTransition);
    }
  };

  // Cycle background color
  bg.cycleColor();

  // Keyboard/Click Events
  activeButton.click(function(){
    appState.toggleTimer();
  });

  resetButton.longpress(function(){
    appState.reset();
  });

  contentTask.keypress(function(e) {
    if(e.which == 13 && !e.shiftKey) {
      appState.toggleTimer();
      $(this).blur();
    }
  });

  contentSession.on("click", function(){
    appState.incrementSession();
  });

  interruptButton.on("click", function(){
    appState.interrupt();
  });

  modeButton.on("click", function(){
    bg.updateAppColorTransition("500ms");
    appState.toggleMode();
    setTimeout(function(){
        bg.resetAppColorTransition();
    }, 500);
  });

  randomButton.on('click', function(){
    bg.updateAppColorTransition("500ms");
    if (!bg.allowCycling) {
      colorPicker.click();
    } else {
      bg.cycleColor();
      setTimeout(function(){
        bg.resetAppColorTransition();
      }, 500);
    }
  });

  randomButton.longpress(function(){
    bg.toggleColorMode();
  });

  colorPicker.on('change', function(){
    bg.setPickedColor($(this).val());
  });

  body.mousemove(function(){
    appState.stopAlarm();
  });

  contentLength.dblclick(function(){
    appState.toggleLength();
  });

  contentLength.longpress(function(){
    $(this).attr('contenteditable', 'true');
    $(this).focus();
  });

  contentLength.on('blur', function(){
    $(this).attr('contenteditable', 'false');
    appState.setLength($(this).text());
  });

  contentLength.keypress(function(e){
    if (e.which == 13) {
      $(this).blur();
    }
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