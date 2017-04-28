var express = require('express');
var app = express();
var http = require('http');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);

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

  socket.on('timer', function(data){
    console.log("Timer event triggered: ", data);
    if (data.action) {
      executeTimerAction(data.action);
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

app.get('/api/timer', function(req, res){
  console.log(req.query);
  if (req.query.action) {
    executeTimerAction(req.query.action);
    res.status(200).send('Performing action: "' + req.query.action + '"');
  } else {
    res.status(400).send('Invalid query vars.');
  }
});

// ---------------------------------------------------------------------------
// Application Logic
// ---------------------------------------------------------------------------

var t, seconds = 0;

function incrementTimer() {
  seconds++;
  io.emit('seconds', seconds);
}

function startTimer() {
  t = setInterval(incrementTimer, 1000);
  io.emit('timer-status', { status: true });
}

function resetTimer() {
  seconds = 0;
  io.emit('seconds', seconds);
}

function stopTimer() {
  clearInterval(t);
  io.emit('timer-status', { status: false });
}

function executeTimerAction(action) {
  switch(action) {
    case "start":
      startTimer();
      break;
    case "stop":
      stopTimer();
      break;
    case "reset":
      resetTimer();
      break;
    default:
      console.log("Unrecognized action: '" + action + "'");
      break;
  }
}