/*
 *   Primary file for API
 */
// HTTP Server for listening requests
const http = require("http");
// HTTPS Server for listening requests
const https = require("https");
// For Parsing request path from URL
const url = require("url");
// For decoding Strings of payloads
const StringDecoder = require("string_decoder").StringDecoder;
// For accessing files smoothly
const fs = require('fs');
// importing lib data library
/*
const libData = require('./lib/data');
libData.create('test','users',{'foo':'bar'},function(err){
  console.log('error is ',err);
})
libData.update('test','users',{'fizz':'bzz'},function(err){
  console.log('error is ',err);
})
libData.read('test','users',function(err,data){
  console.log('error is ',err,' and data is ',data);
})
libData.delete('test','users',function(err){
  console.log('error is ',err);
})
*/
// importing environment configuration
const config = require('./config');
const HTTP_PORT = config.httpPort;
const HTTPS_PORT = config.httpsPort;
const CURRENT_ENV = config.envName;
// Instantiating HTTP Server
var httpServer = http.createServer(function(req, res) {
  unifiedServer(req,res);
});
// Starting HTTP Server
httpServer.listen(HTTP_PORT, function(params) {
  console.log("Server is listening requests on Port " + HTTP_PORT);
});
// Instantiating HTTPS Server
// For Https, you also have to pass https key and certificates.
var httpsOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert:fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsOptions,function(req, res) {
  unifiedServer(req,res);
});
// Starting HTTP Server
httpsServer.listen(HTTPS_PORT, function(params) {
  console.log("Server is listening requests on Port " + HTTPS_PORT);
});
// For generating ssl certificates via openssl
//openssl req -x509 -config "C:\openssl\openssl.cnf" -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900
var unifiedServer = function (req,res) {
    // Getting the request url
  var parsedUrl = url.parse(req.url, true);
  // Getting the queryString Object
  var queryStringAsObject = parsedUrl.query;
  // Getting the request path
  var path = parsedUrl.pathname;
  // Trimming the unnecessary / or spaces
  const trimmedPath = path.replace("/^\/+|\/+$/g", "").slice(1);
  // Getting Request type
  const requestType = req.method.toLowerCase();
  // Getting Headers from request
  const headers = req.headers;
  // Parsing payloads if any
  const decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function(data) {
    buffer += decoder.write(data);
  });
  req.on("end", function() {
    buffer += decoder.end();
    var requestHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers["notFound"];
    var data = {
      method: requestType,
      queryStringObject: queryStringAsObject,
      url: trimmedPath,
      payload: buffer
    };
    requestHandler(data, function(statusCode, payload) {
      var validStatusCode = typeof statusCode == "number" ? statusCode : 404;
      var responseData = typeof payload == "object" ? payload : {};
      var stringifiedData = JSON.stringify(responseData);
      // Adding Header to let user know, we are sending JSON, So that they can parse it.
      res.setHeader('Content-type','application/json');
      res.writeHead(validStatusCode);
      res.end(stringifiedData);
      console.log(
        "Returned response by server",
        trimmedPath,
        statusCode,
        responseData
      );
    });
    //res.end("Hello World");
    // logging the path on request received
    // console.log(
    //   "User requested on",
    //   trimmedPath,
    //   " with request type",
    //   requestType,
    //   " with queryString Object ",
    //   queryStringObject
    // );
    //console.log("Request Headers ", headers);
    //console.log("Request Payload :", buffer);
  });
}
// Step:2 Adding RouterHandlers
var handlers = {};
// handlers.sample = function(data, callback) {
//   callback(406, { name: "sample handler" });
// };
handlers.ping = function (data, callback) {
  callback(200);
}
handlers.notFound = function(data, callback) {
  callback(404);
};
// Step 1: Adding Routing for app
var router = {
  ping: handlers.ping
};
