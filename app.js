
var express = require('express');

/* DB CONFIG */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var db = mongoose.connect('mongodb://dev:dev@ds031567.mongolab.com:31567/frukostfralla_karl_development', function(err){
	console.log("Connection callback: "+ err)
});


console.log('connection done')

var UserSchema = new Schema({
    firstname  :  { type: String, default: 'hahaha' }
    ,lastname  :  { type: String, default: 'hahaha' }
    ,age  :  { type: String, default: 'hahaha' }
    ,marriage_status:  { type: String, default: 'hahaha' }
    ,details:  { type: String, default: 'hahaha' }
    ,remark  :  { type: String, default: 'hahaha' }
});


mongoose.model('User', UserSchema );
var User = db.model('User', UserSchema);



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

/* -- Members -- */

app.get('/members', function (req, res) {
   var responseString = ""
    User.find({}, function (err, docs) {
        docs.forEach(function (doc){
		    responseString += " " + doc.firstname + " "+ doc.lastname+"<br/>"
        });
        res.send(responseString);
	});
    
});

app.get('/members/add', function (req, res) {
    var record = new User();
    record.firstname = 'Nisse';
		record.lastname = req.query.lastname
    record.age = '44';
    record.marriage_status = 'gift';
    record.details = 'Inte mycket';
    record.remarks = 'Fyller snart 45';
    record.save(function(err, record) {
        if (err) {
    		throw err;
    	}
        res.send("Sparad");
    }); 
});




/* START */

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
