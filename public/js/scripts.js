var socket, appState, bg;
moment().format();

var remoteStatus = false;
if ($.url().param("remote")) remoteStatus = true;

if (remoteStatus) {

  console.log("Remote status is active...");

  socket = io({
    'reconnection': false
  });

  socket.on("task", function(data){
    console.log("[ socket ] set-task : ", data);
    appState.setTask(data);
  });

  socket.on("toggle", function(){
    console.log("[ socket ] toggle-timer");
    appState.toggleTimer();
  });

  socket.on("reset", function() {
    console.log("[ socket ] reset");
    appState.reset();
  });

  socket.on("interrupt", function() {
    console.log("[ socket ] interrupt");
    appState.interrupt();
  });

}

$(document).ready(function(){

  // DOM Selectors
  body = $("body");
  sectionA = $("#section-a");
  sectionB = $("#section-b");
  sectionC = $("#section-c");
  contentSession = $("#content-session");
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
    active: false,
    interval: null,

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
      clearInterval(appState.interval);
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
        appState.interval = setInterval(function(){
          appState.seconds++;
          contentTime.text(moment.utc(appState.seconds*1000).format('HH:mm:ss'));
          contentFocus.text(function(){
            var focus = Math.round((1 - (appState.interrupts / (appState.seconds/60)))*100);
            if ((focus < 0) || appState.seconds < 60) {
              return "---";
            } else {
              return focus + "%";
            }
          });
        }, 1000);
      } else {
        bg.stopCycle();
        clearInterval(appState.interval);
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
    }

  };

  body.fadeIn();

  bg = {
    interval: null,
    colors: [
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
    getColor: function(){
      if (this.currentColorIdx == this.colors.length) {
        this.currentColorIdx = 0;
        return this.colors[this.currentColorIdx];
      } else {
        return this.colors[this.currentColorIdx++];
      }
    },
    cycleColor: function() {
      var pallette = this.getColor();
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

});