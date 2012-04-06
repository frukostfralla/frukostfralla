
var express = require('express');

/* DB CONFIG */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var db = mongoose.connect('mongodb://dev:dev@ds031567.mongolab.com:31567/frukostfralla_karl_development', function(err){
	console.log("Connection callback: "+ err)
});


console.log('connection done')

var UserSchema = new Schema({
    firstname  :  { type: String, default: '' }
    ,lastname  :  { type: String, default: '' }
    ,address  :  { type: String, default: '' }
    ,city  :  { type: String, default: '' }
    ,postalcode  :  { type: String, default: '' }
    ,email  :  { type: String, default: '' }
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

app.get('/members', function (req, res){
	User.find({}, function (err, docs) {
		var members = docs
		res.render("members/list", {
    		locals: {
      		  members: members
    		}
			}
		);
	});
});

/* Användar formulär*/
app.get('/members/new', function (req, res) {
	res.render('members/new', {
    title: 'Register user'
  });
});

/* Spara användare*/
app.post('/members/new', function (req, res) {
  var record = new User();
		member = req.body.member
  	record.firstname = member.firstname;
		record.lastname = member.lastname;
		record.address = member.address;
		record.postalcode = member.postalcode;
		record.city = member.city;
		record.email = member.email
    record.save(function(err, record) {
        if (err) {
    		throw err;
    	}
				res.redirect('/members');
    }); 
});


/* START */

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

