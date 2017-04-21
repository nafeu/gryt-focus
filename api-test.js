var request = require('request');

var config;

try {
  config = require("./config.js");
}
catch(err) {
  console.log("Missing config file, please create config.js following sample-config.js format");
}

var appUrl;

if (config) {

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

    var param = process.argv[4];
    var propertiesObject = {};
    propertiesObject[param] = process.argv[5];

    console.log("Making request to: " + requestUrl);
    console.log("With query vars: ", propertiesObject);

    request({url:requestUrl, qs:propertiesObject}, function(err, response, body) {
      if(err) { console.log(err); return; }
      console.log("Get response: " + response.statusCode);
    });

  } else {
    console.log("Missing appUrl for " + env + " in config.js");
  }

}
