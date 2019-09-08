/*
 *   Primary file for API
 */
// Server Dependency for listening requests
const http = require("http");
// For Parsing request path from URL
const url = require("url");
const PORT = 4500;
var server = http.createServer(function(req, res) {
  // Getting the request url
  var parsedUrl = url.parse(req.url, true);
  // Getting the queryString Object
  var queryStringAsObject = parsedUrl.query;
  // Getting the request path
  var path = parsedUrl.pathname;
  // Trimming the unnecessary / or spaces
  const trimmedPath = path.replace("/^/+|/+$/g", "");
  // Getting Request type
  const requestType = req.method.toLowerCase();
  res.end("Hello World");
  // logging the path on request received
  console.log(
    "User requested on",
    trimmedPath,
    " with request type",
    requestType,
    " with queryString Object ",
    queryStringObject
  );
});

server.listen(PORT, function(params) {
  console.log("Server is listening requests on Port " + PORT);
});
