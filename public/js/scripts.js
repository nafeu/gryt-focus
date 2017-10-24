// -----------------------------------------------------------------------------
// Globals
// -----------------------------------------------------------------------------

var DEFAULT_LENGTH_IN_MIN = 25,
    DEFAULT_ACCENT_COLOR = "#1C2021",
    DEFAULT_LIGHTING_MODE = "night",
    DEFAULT_TRANSITION_TIME_IN_SECS = "4s",
    DEFAULT_DOCUMENT_TITLE = "GRYT Focus | Deep focus logger",
    DEFAULT_TEXTAREA_FONT_SIZE = "10vmin",
    TEXT_PLACEHOLDER = "...",
    NUMBER_PLACEHOLDER = "---",
    ALARM_DOCUMENT_TITLE = "Session Complete! | GRYT Focus",
    LENGTH_OPTIONS = [25, 20, 15, 10, 5, 4, 3, 2, 1,
                      60, 55, 50, 45, 40, 35, 30],
    NOTIFICATION_IMG_URL = "http://nafeu.github.io/gryt-focus/assets/" +
                            "gryt-focus_notification.png",
    NOTIFICATION_TITLE = "Session Complete!",
    ICON_ACTIVE = "fa-hourglass-start",
    ICON_PAUSED = "fa-hourglass-end",
    ICON_LIGHTING_MODE_NIGHT = "fa-moon-o",
    ICON_LIGHTING_MODE_DAY = "fa-sun-o",
    ICON_FULLSCREEN_EXPAND = "fa-expand",
    ICON_FULLSCREEN_COMPRESS = "fa-compress",
    COLOR_BLACK = "#000000",
    COLOR_WHITE = "#FFFFFF",
    LIGHTING_MODE_NIGHT = "night",
    LIGHTING_MODE_DAY = "day",
    KEYCODE_ENTER = 13,
    STATUS_TIME_FORMAT = "HH:mm:ss",
    ACTIVITY_LOG_DATETIME_FORMAT = "MM/DD/YYYY, h:mm A",
    TEXTAREA_RESIZE_RULES = [{"limit": 210, "size": "3vmin"},
                             {"limit": 100, "size": "5vmin"},
                             {"limit": 50, "size": "7vmin"}];

var socket,
    app,
    ui,
    customTheme,
    lightingMode,
    timerLength = DEFAULT_LENGTH_IN_MIN,
    alarmChord = new Audio("assets/alarm-chord.wav"),
    remoteStatus = false;

// Activity Log Data Format: [date, time (min), interrupts, focus, task name]
var activityLogData = [];

// -----------------------------------------------------------------------------
// Configurations
// -----------------------------------------------------------------------------

moment().format();

if ($.url().param("remote")) remoteStatus = true;
if ($.url().param("theme")) customTheme = $.url().param("theme");
if ($.url().param("mode")) {
  lightingMode = $.url().param("mode");
} else {
  lightingMode = DEFAULT_LIGHTING_MODE;
}

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

  socket.on("reset", function() {
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
$(document).ready(function(){ // Document Ready - Start
// -----------------------------------------------------------------------------

if (Notification.permission !== "denied")
  Notification.requestPermission();

// -----------------------------------------------------------------------------
// DOM Selections
// -----------------------------------------------------------------------------

var body = $("body"),
    sectionA = $("#section-a"),
    sectionB = $("#section-b"),
    sectionC = $("#section-c"),
    sectionAContainer = $("#section-a-container"),
    alarm = $("#alarm"),
    contentSession = $("#content-session"),
    contentLength = $("#content-length"),
    contentTime = $("#content-time"),
    contentInterrupts = $("#content-interrupts"),
    contentFocus = $("#content-focus"),
    contentTask = $("#content-task"),
    contentActive = $("#content-active"),
    logTable = $("#log-table"),
    toggle = $("#toggle"),
    actionButtons = $("#action-buttons"),
    actionTip = $("#action-tip"),
    activeButton = $("#active-button"),
    resetButton = $("#reset-button"),
    interruptButton = $("#interrupt-button"),
    lightingModeButton = $("#lighting-mode-button"),
    fullscreenButton = $("#fullscreen-button"),
    randomButton = $("#random-button"),
    showActivityLogButton = $("#show-activity-log-button"),
    hideActivityLogButton = $("#hide-activity-log-button"),
    clockButton = $("#clock-button"),
    colorPicker = $("#color-picker"),
    footer = $("#footer"),
    lanInfo = $("#lan-info"),
    activityLogContainer = $("#activity-log-container"),
    activityLogPanel = $("#activity-log-panel"),
    activityLogTable = $("#activity-log-table");

var actionTips = [
  {"element": contentTask, "text": "Enter or edit the task to work on."},
  {"element": activeButton, "text": "Click to start or stop the timer."},
  {"element": clockButton, "text": "Double-click to change the timer length. Hold to set manually."},
  {"element": interruptButton, "text": "Click to log an interruption."},
  {"element": resetButton, "text": "Hold to save this task in activity log and reset."},
  {"element": randomButton, "text": "Click to switch color. Hold to set specific color."},
  {"element": showActivityLogButton, "text": "Click to show activity log."},
  {"element": lightingModeButton, "text": "Click to change lighting mode (night or day)."},
  {"element": fullscreenButton, "text": "Click to toggle full-screen mode."}
];

// -----------------------------------------------------------------------------
// Application Logic
// -----------------------------------------------------------------------------

app = {
  interrupts: 0,
  elapsedTime: 0,
  startTime: null,
  endTime: null,
  taskTime: 0,
  length: timerLength * 60,
  lengthOptions: LENGTH_OPTIONS,
  lengthOptionIndex: 0,
  active: false,
  stopwatchInterval: null,
  alarmStatus: false,
  alarmFlashStatus: false,
  alarmInterval: null,
  lightingMode: lightingMode,

  reset: function(){
    var self = this;
    this.saveToActivityLog([moment().format(ACTIVITY_LOG_DATETIME_FORMAT),
                            Math.round(self.elapsedTime/60),
                            contentInterrupts.text(),
                            contentFocus.text(),
                            contentTask.val()]);
    this.interrupts = 0;
    this.elapsedTime = 0;
    this.taskTime = 0;
    this.active = false;
    this.incrementSession();
    clearInterval(this.stopwatchInterval);
    contentActive.text("Inactive");
    contentTime.text(TEXT_PLACEHOLDER);
    contentTask.val("");
    contentFocus.text(TEXT_PLACEHOLDER);
    contentInterrupts.text("0");
    this.setLength(timerLength);
    activeButton.removeClass(ICON_ACTIVE).addClass(ICON_PAUSED);
    ui.stopCycle();
  },

  toggleTimer: function() {
    var self = this;

    if (!self.active) {
      ui.startCycle();
      self.setLength(timerLength);
      self.active = true;
      contentActive.text("Active");

      self.startTime = new moment();
      self.endTime = new moment();
      self.endTime.add(self.length, "minutes");

      self.incrementTimer();
      self.stopwatchInterval = setInterval(function(){
        self.incrementTimer();
      }, 1000);

      activeButton
        .removeClass(ICON_PAUSED)
        .addClass(ICON_ACTIVE);
    } else {
      ui.stopCycle();
      contentLength.text(timerLength);
      clearInterval(self.stopwatchInterval);
      self.active = false;
      self.startTime = null;
      self.endTime = null;
      contentActive.text("Paused");
      activeButton
        .removeClass(ICON_ACTIVE)
        .addClass(ICON_PAUSED);
    }
  },

  incrementTimer: function() {
    var self = this;

    var now = moment();
    var timeLeft = self.endTime.diff(now, "seconds");
    self.elapsedTime = (self.length * 60) - timeLeft;

    contentTime.text(moment.utc((self.taskTime + self.elapsedTime)*1000).format(STATUS_TIME_FORMAT));
    contentLength.text(Math.ceil(self.length / 60));
    contentFocus.text(function(){
      var focus = Math.round((1 - (self.interrupts / (self.elapsedTime/60)))*100);
      if ((focus < 0) || self.elapsedTime < 60) {
        return NUMBER_PLACEHOLDER;
      } else {
        return focus + "%";
      }
    });

    if (timeLeft < 1) {
      contentLength.text(timerLength);
      self.taskTime += self.elapsedTime;
      self.toggleTimer();
      self.startAlarm();
    }
  },

  interrupt: function() {
    contentInterrupts.text(parseInt(contentInterrupts.text()) + 1);
    this.interrupts++;
  },

  incrementSession: function() {
    contentSession.text(parseInt(contentSession.text()) + 1);
  },

  setTask: function(task) {
    contentTask.text(task);
    this.adjustTaskFontSize();
  },

  setLength: function(length) {
    timerLength = parseInt(length) || timerLength;

    if (timerLength < 1) {
      timerLength = 1;
    }
    if (this.active) {
      this.toggleTimer();
    }
    this.length = timerLength;
    contentLength.text(timerLength);
  },

  startAlarm: function(){
    var self = this;

    alarm.show();
    alarmChord.play();
    self.alarmInterval = setInterval(function(){
      if (self.alarmFlashStatus) {
        alarm.css({
          "color": COLOR_BLACK,
          "background-color": COLOR_WHITE
        });
        alarmChord.play();
      } else {
        alarm.css({
          "color": COLOR_WHITE,
          "background-color": COLOR_BLACK
        });
      }
      self.alarmFlashStatus = !self.alarmFlashStatus;
    }, 500);
    issueAlarmNotification(contentTask.text());
    document.title = ALARM_DOCUMENT_TITLE;
  },

  stopAlarm: function() {
    clearInterval(this.alarmInterval);
    alarm.hide();
    document.title = DEFAULT_DOCUMENT_TITLE;
  },

  toggleLightingMode: function() {
    if (this.lightingMode === LIGHTING_MODE_NIGHT) {
      lightingModeButton
        .removeClass(ICON_LIGHTING_MODE_NIGHT)
        .addClass(ICON_LIGHTING_MODE_DAY);
      this.lightingMode = LIGHTING_MODE_DAY;
    } else {
      lightingModeButton
        .removeClass(ICON_LIGHTING_MODE_DAY)
        .addClass(ICON_LIGHTING_MODE_NIGHT);
      this.lightingMode = LIGHTING_MODE_NIGHT;
    }
    ui.invertColor();
  },

  toggleLength: function() {
    var self = this;
    if (self.lengthOptionIndex === self.lengthOptions.length - 1) {
      self.lengthOptionIndex = 0;
    } else {
      self.lengthOptionIndex++;
    }
    self.setLength(self.lengthOptions[self.lengthOptionIndex]);
  },

  pauseTimer: function() {
    if (this.active) {
      this.toggleTimer();
    }
  },

  showLanAddress: function(address) {
    lanInfo.text("Running at " + address + " | ");
  },

  setActionTip: function(text) {
    actionTip.text(text);
  },

  resetActionTip: function() {
    actionTip.text("");
  },

  manuallySetTimerLength: function() {
    this.pauseTimer();
    contentLength.attr('contenteditable', 'true');
    contentLength.focus();
  },

  toggleFullscreen: function() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document
          .documentElement
          .requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document
          .documentElement
          .mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document
          .documentElement
          .webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      fullscreenButton
        .removeClass(ICON_FULLSCREEN_EXPAND)
        .addClass(ICON_FULLSCREEN_COMPRESS);
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      fullscreenButton
        .removeClass(ICON_FULLSCREEN_COMPRESS)
        .addClass(ICON_FULLSCREEN_EXPAND);
    }
  },

  saveToActivityLog: function(data) {
    activityLogData.push(data);
    var tr = $("<tr>");
    data.forEach(function(cell){
      tr.append($("<td>").text(cell));
    });
    activityLogTable.append(tr);
  },

  showActivityLog: function() {
    activityLogContainer.show();
  },

  hideActivityLog: function() {
    activityLogContainer.hide();
  },

  toggleActivityLog: function() {
    if (activityLogTable.is(":visible")) {
      this.hideActivityLog();
    } else {
      this.showActivityLog();
    }
  },

  adjustTaskFontSize: function() {
    var charCount = contentTask.val().length;
    if (charCount > TEXTAREA_RESIZE_RULES[0].limit) {
      contentTask.css('font-size', TEXTAREA_RESIZE_RULES[0].size);
    }
    else if (charCount > TEXTAREA_RESIZE_RULES[1].limit) {
      contentTask.css('font-size', TEXTAREA_RESIZE_RULES[1].size);
    }
    else if (charCount > TEXTAREA_RESIZE_RULES[2].limit) {
      contentTask.css('font-size', TEXTAREA_RESIZE_RULES[2].size);
    }
    else {
      contentTask.css('font-size', DEFAULT_TEXTAREA_FONT_SIZE);
    }
  }
};

ui = {
  interval: null,
  allowCycling: true,
  currentThemeColor: null,
  currentAccentColor: null,

  getNextColor: function(){
    return themeColors[Math.floor(Math.random()*themeColors.length)];
  },

  cycleColor: function() {
    if (this.allowCycling) {
      if (app.lightingMode === LIGHTING_MODE_NIGHT) {
        this.currentThemeColor = customTheme || this.getNextColor();
        this.currentAccentColor = DEFAULT_ACCENT_COLOR;
      } else {
        this.currentThemeColor = DEFAULT_ACCENT_COLOR;
        this.currentAccentColor = customTheme || this.getNextColor();
      }
      ui.setAppColors(this.currentThemeColor, this.currentAccentColor);
    }
  },

  invertColor: function() {
    var origThemeColor = this.currentThemeColor;
    this.currentThemeColor = this.currentAccentColor;
    this.currentAccentColor = origThemeColor;
    ui.setAppColors(this.currentThemeColor, this.currentAccentColor);
  },

  startCycle: function() {
    ui.cycleColor();
    this.interval = setInterval(function(){
      ui.cycleColor();
    }, 10000);
  },

  stopCycle: function() {
    this.currentColorIdx = 0;
    ui.cycleColor();
    clearInterval(this.interval);
  },

  setAppColors: function(theme, accent) {
    sectionA.css({"color": theme});
    contentTask.css({"color": theme});
    sectionAContainer.css("background-color", accent);
    sectionB.css({"background-color": theme, "color": accent});
    sectionC.css({"background-color": accent, "color": theme});
    actionButtons.css({"color": theme});
    footer.css({"color": theme});
    activityLogContainer.css({"background-color": accent, "color": theme});
    activityLogPanel.css({"border-color": theme});
  },

  setPickedColor: function(color) {
    if (app.lightingMode === LIGHTING_MODE_NIGHT) {
      this.currentThemeColor = color;
    } else {
      this.currentAccentColor = color;
    }
    this.setAppColors(this.currentThemeColor, this.currentAccentColor);
  },

  toggleColorMode: function() {
    this.allowCycling = !this.allowCycling;
    if (this.allowCycling) {
      randomButton.removeClass("fa-eyedropper").addClass("fa-random");
    } else {
      randomButton.removeClass("fa-random").addClass("fa-eyedropper");
    }
  },

  updateAppColorTransition: function(transition) {
    var sectionTransition = transition + " all ease-in-out";
        borderTransition = transition + " border-color ease-in-out";
        colorTransition = transition + " color ease-in-out";

    sectionA.css('transition', sectionTransition);
    sectionAContainer.css('transition', sectionTransition);
    sectionB.css('transition', sectionTransition);
    sectionC.css('transition', sectionTransition);
    actionButtons.css('transition', sectionTransition);
    footer.css('transition', sectionTransition);
    activityLogContainer.css('transition', sectionTransition);
    activityLogPanel.css('transition', borderTransition);
    contentTask.css({'transition': colorTransition});
  },

  resetAppColorTransition: function() {
    this.updateAppColorTransition(DEFAULT_TRANSITION_TIME_IN_SECS);
  },

};

function main() {
  contentTask.css('font-size', DEFAULT_TEXTAREA_FONT_SIZE);
  body.fadeIn();
  contentLength.text(timerLength);
  alarm.css('height', $(window).height());
  activityLogContainer.css('height', $(window).height());
  ui.cycleColor();
}

main();

// -----------------------------------------------------------------------------
// Event Handlers
// -----------------------------------------------------------------------------

$(window).resize(function(){
  alarm.css('height', $(window).height());
  activityLogContainer.css('height', $(window).height());
});

activeButton.click(function(){
  app.toggleTimer();
});

resetButton.longpress(function(){
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

// -----------------------------------------------------------------------------
}); // Document Ready - End
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function issueAlarmNotification(taskName) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications. Try Chromium.");
  }
  else if (Notification.permission === "granted") {
    var notification = new Notification(NOTIFICATION_TITLE, {
      icon: NOTIFICATION_IMG_URL,
      body: taskName,
    });
    notification.onclick = function () {
      app.stopAlarm();
      window.focus();
    };
  }
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        issueAlarmNotification(taskName);
      }
    });
  }
}

var themeColors = [
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
  "rgb(25, 181, 254)",
  "rgb(107, 185, 240)",
  "rgb(30, 139, 195)",
  "rgb(58, 83, 155)",
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