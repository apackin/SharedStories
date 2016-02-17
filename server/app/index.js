'use strict'; 

var app = require('express')(),
	path = require('path'),
	session = require('express-session'),
	passport = require('passport');


app.use(session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: 'yoMamastongueiscooler'
}));

app.use(function (req, res, next) {
  console.log('session', req.session, req.user);
  next();
});

app.use(passport.initialize());

app.use(passport.session());

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));


app.use('/api', require('../api/api.router'));

app.use('/auth', require('../api/auth/auth.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;