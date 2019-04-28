// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get("/views/parsedHeader", function (req, res) {
     let headerObject = req.headers
     //the x-forwarded-for property of the header does not appear for local host so add an alternative or will
     //error out locally on split to get the ip address the rest of the requests are common to loacl and remote
     let ip = (headerObject['x-forwarded-for']||req.socket.remoteAddress).split(",")[0];
     let language = headerObject['accept-language'].split(",")[0];
     let software = headerObject['user-agent'].split('(')[1].split(')')[0]
     //console.log([ip,language,software])
     let result = {"ipaddress":ip,"language":language,"software":software}
     res.end(JSON.stringify(result))
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
