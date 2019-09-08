/*
 *   Primary file for API
 */
// Server Dependency for listening requests
const http = require("http");
// For Parsing request path from URL
const url = require("url");
// For decoding Strings of payloads
const StringDecoder = require("string_decoder").StringDecoder;
const PORT = 4500;
var server = http.createServer(function(req, res) {
  // Getting the request url
  var parsedUrl = url.parse(req.url, true);
  // Getting the queryString Object
  var queryStringAsObject = parsedUrl.query;
  // Getting the request path
  var path = parsedUrl.pathname;
  // Trimming the unnecessary / or spaces
  const trimmedPath = path.replace("/^\/+|\/+$/g", "");
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
});

server.listen(PORT, function(params) {
  console.log("Server is listening requests on Port " + PORT);
});
// Step:2 Adding RouterHandlers
var handlers = {};
handlers.sample = function(data, callback) {
  callback(406, { name: "sample handler" });
};
handlers.notFound = function(data, callback) {
  callback(404);
};
// Step 1: Adding Routing for app
var router = {
  sample: handlers.sample
};
