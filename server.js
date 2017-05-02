var express = require('express');
var app = express();
var http = require('http');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var moment = require('moment');
moment().format();

try {
  var config = require('./config');
}
catch (err) {
  var config = {};
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Server
server.listen(process.env.PORT || 8000, function(){
  console.log('[ server.js ] Listening on port ' + server.address().port);
});

// Socket.io configs
io.set('heartbeat timeout', 4000);
io.set('heartbeat interval', 2000);

// Express server configs
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ---------------------------------------------------------------------------
// Socket Event Listeners
// ---------------------------------------------------------------------------

io.on('connection', function(socket){

  console.log(socket.id + " connected...");

  socket.on('disconnect', function(){
    console.log(socket.id + " disconnected...");
  });

  socket.on('interaction', function(data){
    console.log("Interaction: ", data);
    if (data.component == "timer") {
      handleTimerAction(data.action);
    }
  });

});

// ---------------------------------------------------------------------------
// Express API
// ---------------------------------------------------------------------------

app.get('/api/message', function(req, res){
  console.log(req.query);
  if (req.query.text) {
    var text = req.query.text;
    io.emit('message', text);
    res.status(200).send('Message has been updated to: ' + text);
  } else {
    res.status(400).send('Invalid query vars.');
  }
});

app.get('/api/background', function(req, res){
  console.log(req.query);
  if (req.query.color) {
    var color = req.query.color;
    io.emit('background', color);
    res.status(200).send('Background color has been updated to: ' + color);
  } else {
    res.status(400).send('Invalid query vars.');
  }
});

app.get('/api/interact', function(req, res){
  console.log("Interaction: ", req.query);
  if (req.query.component && req.query.action) {
    if (req.query.component == "timer") {
      handleTimerAction(req.query.action);
    }
    res.status(200).send('Handling interaction: "' + req.query + '"');
  } else {
    res.status(400).send('Invalid query vars.');
  }
});

// ---------------------------------------------------------------------------
// Application Logic
// ---------------------------------------------------------------------------

var timer,
    startingMoment,
    active = false,
    updateIntervalMs = config["update-interval-ms"] || 1000;

function incrementTimer() {
  var text = moment(startingMoment).fromNow();
  console.log("[ timer ] : ", text);
  updateUi([
    {
      "sel": "#timer",
      "props": {
        "text": text
      }
    }
  ]);
}

function startTimer() {
  startingMoment = moment();
  timer = setInterval(incrementTimer,
                      updateIntervalMs);
  updateUi([
    {
      "sel": "#toggle-btn",
      "props": {
        "text": "pause"
      }
    }
  ]);
  activateTimer();
}

function resetTimer() {
  updateUi([
    {
      "sel": "#timer",
      "props": {
        "text": "focus"
      }
    },
    {
      "sel": "#toggle-btn",
      "props": {
        "text": "start"
      }
    }
  ]);
  deactivateTimer(timer);
}

function pauseTimer() {
  updateUi([
    {
      "sel": "#toggle-btn",
      "props": {
        "text": "continue"
      }
    }
  ]);
  deactivateTimer(timer);
}

function activateTimer() {
  active = true;
}

function deactivateTimer(interval) {
  clearInterval(interval);
  active = false;
}

function handleTimerAction(action) {
  switch(action) {
    case "reset":
      resetTimer();
      break;
    case "toggle":
      if (active) {
        pauseTimer();
      } else {
        startTimer();
      }
      break;
    default:
      console.log("Unrecognized action: '" + action + "'");
      break;
  }
}

function updateUi(objects){
  io.emit('update-ui', objects);
}