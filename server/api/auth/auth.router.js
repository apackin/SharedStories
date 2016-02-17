'use strict';

var router = require('express').Router(),
 	HttpError = require('../../utils/HttpError'),
	User = require('../users/user.model'),
	chance = require('chance')(123),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


router.post('/login', function(req, res, next){
	User.findOne(req.body)
	.then(function(user){
		if(!user){res.sendStatus(401);}
		else {
			req.session.user = user;
			req.session.cookie.maxAge = 5 * 60 * 1000;
			res.status(200).json(user.isAdmin);
		}
	})
	.then(null, next);
});

router.put('/signup', function(req, res, next){
	User.create(randUser(req.body))
	.then(function(user){
		if(!user){res.sendStatus(401);}
		else {
			req.session.user = user;
			req.session.cookie.maxAge = 5 * 60 * 1000;
			res.sendStatus(200);
		}
	})
	.then(null, next);
});

router.get('/logout', function(req, res, next){
	req.session.user = null;
	res.status(200).json("Come back soon!");
});

router.get('/me', function(req, res, next){
	if(req.session.user) {
		res.status(200).json(req.session.user.isAdmin);
	} else if (req.session.passport) {
		res.status(200).json(req.session.passport.user.isAdmin);
	} else {
		res.sendStatus(401);
	}
});

function randUser (obj) {
		obj.name = [chance.first(), chance.last()].join(' ');
		obj.photo = 'http://api.randomuser.me/portraits/thumb/women/' + Math.floor(Math.random()*96) + '.jpg';
		obj.phone = chance.phone();
		obj.isAdmin = chance.weighted([true, false], [5, 95]);
		return obj;
}

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

router.get('/google', passport.authenticate('google', { scope : 'email' }));

router.get('/google/callback',
  passport.authenticate('google', {

    successRedirect : '/',
    failureRedirect : '/'

  }));



passport.use(
    new GoogleStrategy({
        clientID: '3743757717-3qkp1edg6aecp9l9uuechhtldv4gul28.apps.googleusercontent.com',
        clientSecret: '2EGvXzsgUAWShssdBwZxg26w',
        callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
    },
    // google will send back the token and profile
    function (token, refreshToken, profile, done) {
        //the callback will pass back user profilie information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
        /*
        --- fill this part in ---
        */
        // console.log('---', 'in verification callback', profile, '---', token, '---', refreshToken);
        profile.token = token;
        profile.name = profile.displayName;
        profile.email = profile.emails[0].value;

        var userObj = {
        	google: profile,
        	name: profile.displayName,
        	email: profile.emails[0].value,
        	photo: profile.photos[0].value,
        };

  		User.findOrCreate(userObj)
		.then(function(user){
			done(null, user);
		});

    })
);



module.exports = router;