# gryt - focus

Socket.IO and jQuery based "deep focus" timer built to run as dedicated instance on a Raspberry Pi

[![Build Status](https://travis-ci.org/nafeu/gryt-focus.svg?branch=master)](https://travis-ci.org/nafeu/gryt-focus)

### Requirements

OSX/Linux, Node.js (v7), Raspberry Pi (optional) with Raspbian Jessie

### Installation

```
git clone https://github.com/nafeu/gryt-focus.git
cd gryt-focus
npm install
```

#### Updgrading Node.js on Raspberry Pi

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Basic Usage

```
node server.js
```

- Open `http://localhost:8000` in a web browser.
- Open `http://localhost:8000?remote=true` in a web browser to allow remote interaction commands.

### Raspberry Pi Kiosk Usage

On your rpi, install the app accordingly and navigate to project directory. Then use:

```
sh runkiosk.sh
```

* Note that `chromium-browser` must be properly installed on your rpi

If you want to run the script on startup login, open your `~/.bashrc` file in your home directory using your preferred text editor and append the following line at the bottom:

```
sh /home/pi/Development/gryt-focus/runkiosk.sh
```

### Control Raspberry Pi Kiosk Remotely

On your local machine, run `cp sample-config.js config.js`

Modify the `local_app_url` and `remote_app_url` inside `config.js` accordingly.

- `local_app_url` should point to your app url running locally
- `remote_app_url` should point to your app running on your Raspberry Pi
  (Your remote\_app\_url must be accessible publicly or privately on LAN)

Use `remote.js` to administer commands to the app running remotely:

```
node remote.js task "Work on a specific task"
node remote.js toggle
node remote.js interrupt
node remote.js reset
```

### Development

*Recommended* : Run `server.js` with [nodemon](https://nodemon.io/)

```
npm install -g nodemon
nodemon server.js
```

#### Running Tests

Use `npm test`

### License

MIT