const http = require("http");
const app = require("./app");
const path = require("path");
const express = require("express");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
app.set("port", port);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

server.listen(port);
