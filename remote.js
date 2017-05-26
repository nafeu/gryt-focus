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

if (config && process.argv.length > 2) {

  appUrl = config.remote_app_url;

  if (appUrl) {

    requestUrl = appUrl + "/api/interact";
    propertiesObject = {};

    propertiesObject.action = process.argv[2];
    if (process.argv[3]) propertiesObject.data = process.argv[3];

    request({url:requestUrl, qs:propertiesObject}, function(err, response, body) {
      if(err) { console.log(err); return; }
    });

  } else {
    console.log("Missing appUrl in config.js");
  }

} else {
  console.log("Invalid arguments");
}