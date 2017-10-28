// -----------------------------------------------------------------------------
// Application Logic
// -----------------------------------------------------------------------------

$(document).ready(function(){

app = {
  interrupts: 0,
  elapsedTime: 0,
  startTime: null,
  endTime: null,
  taskTime: 0,
  focus: 0,
  timeSinceLastInterruption: 0,
  recoveryStep: 0,
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
    this.interrupts = 0;
    this.elapsedTime = 0;
    this.taskTime = 0;
    this.active = false;
    this.focus = 0;
    this.recoveryStep = 0;
    this.timeSinceLastInterruption = 0;
    clearInterval(this.stopwatchInterval);
    contentActive.text("Inactive");
    contentTime.text(TEXT_PLACEHOLDER);
    contentTask.val("");
    contentFocus.text(TEXT_PLACEHOLDER);
    contentInterrupts.text(INTERRUPTS_PLACEHOLDER);
    this.setLength(timerLength);
    activeButton.removeClass(ICON_ACTIVE).addClass(ICON_PAUSED);
    setDataRange(timerLength * 60);
    renderChart();
    ui.stopCycle();
  },

  save: function() {
    var efficiency;
    if (this.interrupts > 0) {
      efficiency = (Math.max(1 - (this.interrupts / Math.round(this.elapsedTime / 60)), 0) * 100) + "%";
    } else {
      efficiency = "100%";
    }
    this.saveToActivityLog([moment().format(ACTIVITY_LOG_DATETIME_FORMAT),
                            Math.round(this.elapsedTime / 60),
                            contentInterrupts.text(),
                            efficiency,
                            contentTask.val()]);
    this.incrementSession();
  },

  toggleTimer: function() {
    var self = this;

    if (!self.active) {
      renderChart();
      ui.startCycle();
      self.setLength(timerLength);
      self.active = true;
      contentActive.text("Active");

      self.startTime = new moment();
      self.endTime = new moment();
      self.endTime.add(self.length, "minutes");

      self.stopwatchInterval = setInterval(function(){
        self.incrementTimer();
      }, INTERVAL_TIME_IN_MS);

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
      self.focus = 0;
      self.recoveryStep = 0;
      self.timeSinceLastInterruption = 0;
      self.taskTime += self.elapsedTime;
      contentActive.text("Paused");
      activeButton
        .removeClass(ICON_ACTIVE)
        .addClass(ICON_PAUSED);
    }
  },

  incrementTimer: function() {
    var self = this;

    var now = moment().subtract(TIMER_OFFSET_IN_MS, "milliseconds");
    var timeLeft = self.endTime.diff(now, "seconds");
    self.elapsedTime = (self.length * 60) - timeLeft;
    self.timeSinceLastInterruption++;
    var totalWorkTime = self.taskTime + self.elapsedTime;

    if (self.timeSinceLastInterruption == 60) {
      self.recoveryStep = (1 - self.focus) / 60;
    }

    if (self.timeSinceLastInterruption > 60) {
      self.focus += self.recoveryStep;
      self.focus = Math.min(self.focus, 1);
    } else if (self.interrupts > Math.round(totalWorkTime/60)) {
      self.focus = 0;
    } else {
      self.focus = Math.max((1 - (self.interrupts / (totalWorkTime/60))), 0);
    }

    contentTime.text(moment.utc(totalWorkTime*1000).format(STATUS_TIME_FORMAT));
    contentLength.text(Math.ceil(timeLeft / 60));
    contentFocus.text(function(){
      var focusPercentage = Math.round(self.focus*100);
      if (self.elapsedTime < 60) {
        updateData(self.elapsedTime / 60);
        return NUMBER_PLACEHOLDER;
      } else {
        updateData(self.focus);
        return focusPercentage + "%";
      }
    });

    renderChart();

    if (timeLeft < 1) {
      contentLength.text(timerLength);
      self.toggleTimer();
      self.startAlarm();
    }
  },

  interrupt: function() {
    contentInterrupts.text(parseInt(contentInterrupts.text()) + 1);
    this.interrupts++;
    this.timeSinceLastInterruption = 0;
  },

  incrementSession: function() {
    contentSession.text(parseInt(contentSession.text()) + 1);
  },

  setTask: function(task) {
    contentTask.val(task);
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
    setDataRange(timerLength * 60);
    $("#perf-chart svg").remove();
    draw(ui.currentThemeColor);
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
    if (typeof(Storage) !== "undefined") {
      var logData = { data: activityLogData };
      localStorage.setItem("gryt-focus", JSON.stringify(logData));
    }
    this.insertActivityLogEntry(data);
  },

  showActivityLog: function() {
    activityLogContainer.show();
  },

  hideActivityLog: function() {
    activityLogContainer.hide();
  },

  insertActivityLogEntry: function(data) {
    var tr = $("<tr>");
    data.forEach(function(cell){
      tr.append($("<td>").text(cell));
    });
    activityLogTable.append(tr);
  },

  toggleActivityLog: function() {
    if (activityLogTable.is(":visible")) {
      this.hideActivityLog();
    } else {
      this.showActivityLog();
    }
  },

  resetActivityLog: function() {
    activityLogTable.empty();
    if (typeof(Storage) !== "undefined") {
      localStorage.removeItem("gryt-focus");
    }
    activityLogData = [];
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

});