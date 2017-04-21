# gryt - focus

_***Early work in progress, currently in prototyping phase and being used to test Raspberry Pi api capabilities_

Socket.IO and jQuery based "deep focus" timer built to run as dedicated instance on a Raspberry Pi

### Requirements

OSX/Linux, Node.js, Raspberry Pi (optional) with Raspbian Jessie

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

Open `http://localhost:8000` in a web browser.

### Development

*Recommended* : Run `server.js` with [nodemon](https://nodemon.io/)

```
npm install -g nodemon
nodemon server.js
```

#### Testing the API

Run `cp sample-config.js config.js`
Modify the `local_app_url` and `remote_app_url` inside `config.js` accordingly.

- `local_app_url` should point to your app url running locally
- `remote_app_url` should point to your app running on your Raspberry Pi
  (Your remote\_app\_url must be accessible publicly or privately on LAN)

Test the api using `api-test.js` as follows:

```
node api-test.js <ENV> <ENDPOINT> <QUERY KEY> <QUERY VALUE>
```

For example:

```
node api-test.js local background color "red"
```

Use this to observe changes to the screen

### License

MIT