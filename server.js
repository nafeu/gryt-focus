var os = require('os');
var express = require('express');
var app = express();
var http = require('http');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var ifaces = os.networkInterfaces();

try {
  var config = require('./config');
}
catch (err) {
  var config = {};
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

var port = process.env.PORT || 8000;

// Server
server.listen(port, function(){
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

var lanAddressInfo = getLanAddressInfo(port);

if (lanAddressInfo) {
  console.log("Accessible via LAN at: ", lanAddressInfo);
}

// ---------------------------------------------------------------------------
// Socket Event Listeners
// ---------------------------------------------------------------------------

io.on('connection', function(socket){

  console.log(socket.id + " connected...");

  socket.on('disconnect', function(){
    console.log(socket.id + " disconnected...");
  });

  if (lanAddressInfo) {
    io.emit('lan', lanAddressInfo);
  }

});

// ---------------------------------------------------------------------------
// Express API
// ---------------------------------------------------------------------------

app.get('/api/interact', function(req, res){
  console.log(req.query.action);
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
      case "snooze":
        io.emit("snooze");
        break;
      case "mode":
        io.emit("mode");
        break;
      case "reload":
        io.emit("reload");
        break;
      default:
        break;
    }
    res.status(200).send('Handling interaction: ' + JSON.stringify(req.query));
  } else {
    res.status(400).send('Invalid query vars.');
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLanAddressInfo(port){
  var out = {
    addresses: [],
    port: port
  };

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family ||
          iface.internal !== false) {
        return;
      }

      if (alias >= 1) {
        out.addresses.push(alias + " " + iface.address);
      } else {
        out.addresses.push(iface.address);
      }
      ++alias;
    });
  });

  return out;
}

module.exports = app;
