'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	User.find({}).exec()
	.then(function (users) {
		res.json(users);
	})
	.then(null, next);
});

router.post('/', function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		res.status(201).json(user);
	})
	.then(null, next);
});

router.get('/:id', function (req, res, next) {
	req.requestedUser.getStories()
	.then(function (stories) {
		var obj = req.requestedUser.toObject();
		obj.stories = stories;
		res.json(obj);
	})
	.then(null, next);
});

router.put('/:id', function (req, res, next) {
	checkAdminFn(req, function(isAdm){
		if(isAdm){	
		_.extend(req.requestedUser, req.body);
		req.requestedUser.save()
		.then(function (user) {
			res.json(user);
		})
		.then(null, next);
	}
		else {
		res.sendStatus(401);
		}
	}, function(){
		res.sendStatus(401);
	});



});

router.delete('/:id', function (req, res, next) {
	
	checkAdminFn(req, function(isAdm){
		if(isAdm){	
			req.requestedUser.remove()
			.then(function () {
				res.status(204).end();
			})
			.then(null, next);
		}
		else {
		res.sendStatus(401);
		}
	}, function(){
		res.sendStatus(401);
	});

});

function checkAdminFn (req,cb,nucb) {
	if(req.session.user) { 
		cb(req.session.user.isAdmin);
	}
	else if(req.session.passport) {
		cb(req.session.passport.user.isAdmin);
	}
	else nucb();
}

function checkAdmin (req) {
	if(req.session.user) { return req.session.user.isAdmin;}
	if(req.session.passport) {return req.session.passport.user.isAdmin;}
	return "NotUser";
}


module.exports = router;