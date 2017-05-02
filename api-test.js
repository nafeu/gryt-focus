var request = require('request');

var config;

try {
  config = require("./config.js");
}
catch(err) {
  console.log("Missing config file, please create config.js following sample-config.js format");
}

var appUrl;

if (config && process.argv.length > 5) {

  var env = process.argv[2];

  if (env == 'local') {
    appUrl = config.local_app_url;
  }

  if (env == 'remote') {
    appUrl = config.remote_app_url;
  }

  if (appUrl) {

    var apiPath = "/api";
    var endpoint = "/" + process.argv[3];

    var requestUrl = appUrl + apiPath + endpoint;

    var propertiesObject = {};

    for (var i = 4; i < process.argv.length; i++) {
      try {
        var arg = process.argv[i];
        propertiesObject[arg.split('=', 1)[0]] = arg.slice(arg.indexOf('=') + 1);
      }
      catch(err) {
        console.log("Invalid arguments");
      }
    }

    console.log("Making request to: " + requestUrl);
    console.log("With query vars: ", propertiesObject);

    request({url:requestUrl, qs:propertiesObject}, function(err, response, body) {
      if(err) { console.log(err); return; }
      console.log("Get response: " + response.statusCode);
    });

  } else {
    console.log("Missing appUrl for " + env + " in config.js");
  }

} else {
  console.log("Invalid arguments");
}
