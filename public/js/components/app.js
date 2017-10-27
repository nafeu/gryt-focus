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
    setDataRange(timerLength * 60);
    renderChart();
    ui.stopCycle();
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
    var totalWorkTime = self.taskTime + self.elapsedTime;
    var focus = (1 - (self.interrupts / (totalWorkTime/60)));

    contentTime.text(moment.utc(totalWorkTime*1000).format(STATUS_TIME_FORMAT));
    contentLength.text(Math.ceil(timeLeft / 60));
    contentFocus.text(function(){
      var focusPercentage = Math.round(focus*100);
      if ((focusPercentage < 0) || self.elapsedTime < 60) {
        if ((self.elapsedTime / 60) < 1) {
          updateData(self.elapsedTime / 60);
        } else {
          updateData(1);
        }
        return NUMBER_PLACEHOLDER;
      } else {
        updateData(focus);
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

});