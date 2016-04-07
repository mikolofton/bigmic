var express = require('express');
var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
//Models
var User = require('./server/models/User')(app, passport);

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var questions = [];
var attendees = [];
var currentguest = null;
var currentuser;

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(logger());
app.use(bodyParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.get('/', function (req, res) {
	res.render('login', {
		app: 'bigmic',
		style: 'global-login'
	});
});

app.get('/home', function(req, res) {
	currentuser = req.user;
	res.render('index', {
		user: req.user,
		app: 'bigmic',
		style: 'global-home',
		ctrl: 'LoginCtrl'
	});
});

app.get('/api/user', ensureAuthenticated, function(req, res) {
	res.json(req.user);
});

app.get('/api/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }), function(req, res){
	// The request will be redirected to Linkedin for authentication, so this
	// function will not be called.
});

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
	res.redirect('/home');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

io.on('connection', function(socket) {
	console.log(socket.id + ' | new connection');

	var adminID = ['pMA8i362_s', 'T_NgtsJu2J'];
	var admin;

	socket.on('qa:new-user', function(attendee) {
		if (adminID.indexOf(attendee.guest) !== -1) {
			admin = socket.id;
			socket.join('admin');
		}
		else {
			attendees.push(socket.id);
			socket.join('guest');
		}
		io.in('admin').emit('qa:view', 'admin');
		io.in('guest').emit('qa:view', 'guest');
		console.log(socket.id + ' | Received: New User Event | ' + admin);
	});

	socket.on('qa:start', function() {
		io.in('admin').emit('qa:inprogress', 'admin');
		io.in('guest').emit('qa:inprogress', 'guest');
		console.log(socket.id + ' | Received: Start Event | ' + admin);
	});

	socket.on('qa:end', function() {
		io.in('admin').emit('qa:end', 'admin');
		io.in('guest').emit('qa:end', 'guest');
		questions = [];
		io.sockets.emit('qa:updatequeue', {
			queue: questions
		});
		currentguest = null;
		console.log(socket.id + ' | Received: End Event | ');
	});

	socket.on('qa:enterqueue', function(user) {
		questions.push(user);
		console.log('\n\n\n');
		console.log('questions length ', questions);
		console.log('current guest', currentguest);

		// If this is the first person to enter the queue, make them the current guest
		if (questions.length === 1 && !currentguest) {
			currentguest = user;
			io.sockets.emit('qa:currentguest', {
				user: user
			});
		}

		io.sockets.emit('qa:updatequeue', {
			queue: questions
		});
		console.log('Received: Enter Queue' + ' | ' + questions.length);
	});

	socket.on('qa:leavequeue', function(user) {
		var userIndex = questions.map(function(x) {return x._id; }).indexOf(user._id);
		var foundUser = questions.splice(userIndex, 1);
		io.sockets.emit('qa:updatequeue', {
			queue: questions
		});
		console.log('Received: Leave Queue' + ' | ' + questions.length);
	});

	socket.on('qa:donespeaking', function() {
		// remove user from speakers array
		var userIndex = questions.map(function(x) {return x._id; }).indexOf(currentguest._id);
		var foundUser = questions.splice(userIndex, 1);
		currentguest = null;

		io.sockets.emit('qa:updatequeue', {
			queue: questions
		});

		if (questions.length) {
			currentguest = questions[0];
			io.sockets.emit('qa:currentguest', {
				user: questions[0]
			});
		}

	});

});


var port = 3000;
server.listen(port);
console.log('Listening to port ' + port);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
