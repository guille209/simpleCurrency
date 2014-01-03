

var router = require("./router");
var urlResponseHandlers = require("./urlResponseHandlers");

// Load the express library, which we installed using npm
var express = require("express");
var app = express();

// Tell Express we want to serve static files from a 
// particular directory, in this case `./public`. In 
// this app, we're serving the CSS files from `./public/css`
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
	console.log("redireccionando");
	//var _url = url.parse(req.url).pathname;
	// If "/" is requested we have to make a redirect to app.html
	res.redirect("plantilla.html");
	//router.rutear(urlResponseHandlers.fetch, req, res);
});

app.get('/convertQuantity', function(req, res) {
	router.rutear(urlResponseHandlers.convertQuantity, req, res);
});

app.get('/sendEmail', function(req, res) {
	router.rutear(urlResponseHandlers.sendEmail, req, res);
});

app.get('/pedirListaConversiones', function(req, res) {
	router.rutear(urlResponseHandlers.pedirListaConversiones, req, res);
});

app.get('/pedirNumeroConversiones', function(req, res) {
	router.rutear(urlResponseHandlers.pedirNumeroConversiones, req, res);
});


// This is where we actually get the server started. We
// default to port 3000, unless the process has another
// port defined, and we log that we are up and running.
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});



