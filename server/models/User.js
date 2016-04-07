var session = require('express-session');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var LINKEDIN_CLIENT_ID = "773mvjrm9qheen";
var LINKEDIN_CLIENT_SECRET = "CoiQiytFCrCAztgG";
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var dburl = 'mongodb://localhost:27017/bigmic';

module.exports = function(app, passport) {

	app.use(session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});


	passport.use(new LinkedInStrategy(
		{
			clientID:     LINKEDIN_CLIENT_ID,
			clientSecret: LINKEDIN_CLIENT_SECRET,
			callbackURL:  "http://localhost:3000/auth/linkedin/callback",
			scope:        [ 'r_basicprofile', 'r_emailaddress'],
			passReqToCallback: true
		},

		function(req, accessToken, refreshToken, profile, done) {
			req.session.accessToken = accessToken;
			process.nextTick(function () {
				var userProfile = profile._json;

				MongoClient.connect(dburl, function (err, db) {
					if (err) {
						console.log('Unable to connect to the mongoDB server. Error:', err);
					}
					else {
						//HURRAY!! We are connected. :)
						console.log('Connection established to', dburl);

						assert.equal(null, err);

						var Users = db.collection('users');

						Users.findOne({id: userProfile.id}, function(err, doc) {
							if (doc === null) {
								var userData = {
									'id': userProfile.id,
									'name': userProfile.formattedName,
									'email': userProfile.emailAddress,
									'firstName': userProfile.firstName,
									'lastName': userProfile.lastName,
									'title': userProfile.headline,
									'location': userProfile.location.name,
									'image': userProfile.pictureUrl,
									'profile': userProfile.publicProfileUrl
								}
								Users.insert(userData);
								console.log('Added new user');
								return done(null, userData);
							}
							else {
								console.log('Found Existing user');
								return done(null, doc);
							}
						});

						console.log('Close Database');
					}
				});
			})
		})
	);
}
