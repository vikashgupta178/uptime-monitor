/*
 *   Primary file for API
 */
// Server Dependency for listening requests
const http = require("http");
const PORT = 4500;
var server = http.createServer(function(req, res) {
  res.end("Hello World");
});

server.listen(PORT, function(params) {
  console.log("Server is listening requests on Port " + PORT);
});
