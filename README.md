<h1><img src="http://phrakture.com/images/github/gryt-focus-icon.png" width="72" height="72" valign="middle"/>GRYT Focus</h1>

Socket.IO and jQuery based "deep focus" timer built to run in a browser tab or as a dedicated instance on a Raspberry Pi

Check it out at: [nafeu.com/gryt-focus](http://nafeu.com/gryt-focus)

### How to use it

- Enter your task name
- Set the length of your interruption free work session
- Press the `hourglass` icon to start/stop the timer
- Press the `exclamation` icon any time you get interrupted by external distractions unrelated to your work
- Double click the `reset` button to save your completed work session

[![Build Status](https://travis-ci.org/nafeu/gryt-focus.svg?branch=master)](https://travis-ci.org/nafeu/gryt-focus)

<img alt="GRYT Focus Screenshot" src="http://phrakture.com/images/github/gryt-focus-screenshot-updated.png" width="500" valign="middle"/>

### Compatibility

- Works on most modern web browsers including android device web browsers
- Does NOT work on iOS devices

### Requirements to a local server

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

If you want to run the script on startup login, open your `~/.bashrc` file in your home directory using your preferred text editor and append the following lines at the bottom:

```
sh /home/pi/Development/gryt-focus/runkiosk.sh
```

#### Prevent your Raspberry Pi from sleeping

Open the `lightdm.conf` file at `/etc/lightdm/lightdm.conf` in your preferred text editor (you may have to prepend `sudo` to the command) and append the following line in the `[SeatDefaults]` section

```
xserver-command=X -s 0 -dpms
```

### Control Raspberry Pi Kiosk Remotely

On your local machine, run `cp sample-config.js config.js`

Modify the `local_app_url` and `remote_app_url` inside `config.js` accordingly.

- `local_app_url` should point to your app url if you run it locally
- `remote_app_url` should point to your app running anywhere else (ideally your Raspberry Pi)
  (Your remote\_app\_url must be accessible publicly or privately on LAN)

Use `send-command.js` to administer commands to the app running remotely or locally in the format:

`node send-command.js [local | remote] [action] [argument]`

```
node send-command.js remote task "Work on a specific task"
node send-command.js remote toggle
node send-command.js remote interrupt
node send-command.js remote reset
node send-command.js remote snooze
node send-command.js remote mode
```

I suggest creating an alias like so:

```
alias gryt="node [PATH TO PROJECT DIRECTORY]/send-command.js remote"
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