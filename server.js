const os = require('os');
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
const ifaces = os.networkInterfaces();

try {
  let config = require('./config');
}
catch (err) {
  let config = {};
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const port = process.env.PORT || 8000;

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
app.use(express.static(path.join(__dirname, 'client/build')));

const lanAddressInfo = getLanAddressInfo(port);

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
          res.status(400).send('Invalid query consts.');
        }
        break;
      case "length":
        if (req.query.data) {
          io.emit("length", req.query.data);
        } else {
          res.status(400).send('Invalid query consts.');
        }
        break;
      case "toggle":
        io.emit("toggle");
        break;
      case "save":
        io.emit("save");
        break;
      case "undo":
        io.emit("undo");
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
      case "log":
        io.emit("log");
        break;
      case "random":
        io.emit("random");
        break;
      default:
        break;
    }
    res.status(200).send('Handling interaction: ' + JSON.stringify(req.query));
  } else {
    res.status(400).send('Invalid query consts.');
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLanAddressInfo(port){
  let out = {
    addresses: [],
    port: port
  };

  Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0;

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
