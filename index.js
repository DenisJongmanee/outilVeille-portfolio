const express = require("express"); 
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser")
const http = require("http");
const app = require("./app");

app.set("port", 3000);
const server = http.createServer(app);//options,


// httpRequest()
server.listen(
  process.env.PORT || 3000,
  console.log("Serveur listening in port : 3000")
);