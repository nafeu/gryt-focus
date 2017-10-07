var request = require('request');

var appUrl,
  data,
  requestUrl,
  propertiesObject,
  config;

try {
  config = require("./config.js");
}
catch(err) {
  console.log("Missing config file, please create config.js following sample-config.js format");
}

if (config && process.argv.length > 3) {

  if (process.argv[2] === 'local') {
    appUrl = config.local_app_url;
  } else {
    appUrl = config.remote_app_url;
  }

  if (appUrl) {

    requestUrl = appUrl + "/api/interact";
    propertiesObject = {};

    propertiesObject.action = process.argv[3];
    if (process.argv[4]) propertiesObject.data = process.argv[4];

    request({url:requestUrl, qs:propertiesObject}, function(err, response, body) {
      if(err) { console.log(err); return; }
    });

  } else {
    console.log("Missing appUrl in config.js");
  }

} else {
  console.log("Invalid arguments");
}