
var express = require('express');

/* APP CONFIG */

var app = express.createServer();

app.configure(function() {
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
	app.use(express.static(__dirname + '/static'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExpections: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/* ROUTES */

/* -- Home -- */

app.get('/', function (req, res) {
  	res.render('home');
});


/* START */

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});