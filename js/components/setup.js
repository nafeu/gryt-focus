// -----------------------------------------------------------------------------
// Globals
// -----------------------------------------------------------------------------

var DEFAULT_LENGTH_IN_MIN = 25,
    DEFAULT_ACCENT_COLOR = "#1C2021",
    DEFAULT_LIGHTING_MODE = "night",
    DEFAULT_TRANSITION_TIME_IN_SECS = "4s",
    DEFAULT_DOCUMENT_TITLE = "gryt-focus | deep focus logger",
    DEFAULT_TEXTAREA_FONT_SIZE = "10vmin",
    TEXT_PLACEHOLDER = "...",
    INTERRUPTS_PLACEHOLDER = "0",
    NUMBER_PLACEHOLDER = "---",
    ALARM_DOCUMENT_TITLE = "Session Complete! | gryt-focus",
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
                             {"limit": 50, "size": "7vmin"}],
    INTERVAL_TIME_IN_MS = 1000,
    TIMER_OFFSET_IN_MS = 10;

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

// Dom Elements
var body, sectionA, sectionB, sectionC, sectionAContainer, alarm,
    contentSession, contentLength, contentTime, contentInterrupts,
    contentFocus, contentTask, contentActive, logTable, toggle, actionButtons,
    actionTip, activeButton, saveButton, undoButton, interruptButton,
    lightingModeButton, fullscreenButton, randomButton, showActivityLogButton,
    hideActivityLogButton, resetActivityLogButton, clockButton, colorPicker,
    footer, lanInfo, activityLogContainer, activityLogPanel, activityLogTable;

var actionTips;

// D3 Chart Configs
var margin = {top: 25, right: 2, bottom: 25, left: 10},
    NUM_DATA_POINTS = 1500,
    Y_DELTA = 0.01,
    Y_STARTING_VAL = "0.0",
    Y_TOP_LIMIT = 1,
    Y_BOTTOM_LIMIT = 0,
    RANDOM_LOW_DIVIDER = 0.2,
    RANDOM_HIGH_DIVIDER = 0.8,
    svgChart,
    line;

var data = d3.range(timerLength * 60)
    .map(function(d) {
      return {"y": "0.0"};
    });

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

$(document).ready(function(){

  if (Notification.permission !== "denied")
    Notification.requestPermission();

  body = $("body");
  sectionA = $("#section-a");
  sectionB = $("#section-b");
  sectionC = $("#section-c");
  sectionAContainer = $("#section-a-container");
  sectionBContainer = $("#section-b-container");
  perfChart = $("#perf-chart");
  alarm = $("#alarm");
  contentSession = $("#content-session");
  contentLength = $("#content-length");
  contentTime = $("#content-time");
  contentInterrupts = $("#content-interrupts");
  contentFocus = $("#content-focus");
  contentTask = $("#content-task");
  contentActive = $("#content-active");
  logTable = $("#log-table");
  toggle = $("#toggle");
  actionButtons = $("#action-buttons");
  actionTip = $("#action-tip");
  activeButton = $("#active-button");
  saveButton = $("#save-button");
  undoButton = $("#undo-button");
  interruptButton = $("#interrupt-button");
  lightingModeButton = $("#lighting-mode-button");
  fullscreenButton = $("#fullscreen-button");
  randomButton = $("#random-button");
  showActivityLogButton = $("#show-activity-log-button");
  hideActivityLogButton = $("#hide-activity-log-button");
  resetActivityLogButton = $("#reset-activity-log-button");
  clockButton = $("#clock-button");
  colorPicker = $("#color-picker");
  footer = $("#footer");
  lanInfo = $("#lan-info");
  activityLogContainer = $("#activity-log-container");
  activityLogPanel = $("#activity-log-panel");
  activityLogTable = $("#activity-log-table");

  actionTips = [
      {"element": contentTask, "text": "Enter or edit the task to work on."},
      {"element": activeButton, "text": "Click to start or stop the timer."},
      {"element": clockButton, "text": "Double-click to change the timer length. Hold to set manually."},
      {"element": interruptButton, "text": "Click to log an interruption."},
      {"element": saveButton, "text": "Double-click to save this task in activity log and reset."},
      {"element": undoButton, "text": "Double-click to reset timer content."},
      {"element": randomButton, "text": "Click to switch color. Hold to set specific color."},
      {"element": showActivityLogButton, "text": "Click to show activity log."},
      {"element": lightingModeButton, "text": "Click to change lighting mode (night or day)."},
      {"element": fullscreenButton, "text": "Click to toggle full-screen mode."}
  ];

});