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

});

// ---------------------------------------------------------------------------
// Express API
// ---------------------------------------------------------------------------

app.get('/api/interact', function(req, res){
  if (req.query.action) {
    switch(req.query.action) {
      case "task":
        if (req.query.data) {
          io.emit("task", req.query.data);
        } else {
          res.status(400).send('Invalid query vars.');
        }
        break;
      case "length":
        if (req.query.data) {
          io.emit("length", req.query.data);
        } else {
          res.status(400).send('Invalid query vars.');
        }
        break;
      case "toggle":
        io.emit("toggle");
        break;
      case "reset":
        io.emit("reset");
        break;
      case "interrupt":
        io.emit("interrupt");
        break;
      default:
        break;
    }
    res.status(200).send('Handling interaction: ' + JSON.stringify(req.query));
  } else {
    res.status(400).send('Invalid query vars.');
  }
});

module.exports = app;
