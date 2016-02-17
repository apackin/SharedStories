'use strict';

var router = require('express').Router(),
	User = require('./users/user.model'),
	chance = require('chance')(123);

router.use('/users', require('./users/user.router'));
router.use('/stories', require('./stories/story.router'));

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
	if(req.session.user) 
		res.status(200).json(req.session.user.isAdmin);
	else
		res.sendStatus(401);
});

function randUser (obj) {
		obj.name = [chance.first(), chance.last()].join(' ');
		obj.photo = 'http://api.randomuser.me/portraits/thumb/women/' + Math.floor(Math.random()*96) + '.jpg';
		obj.phone = chance.phone();
		obj.isAdmin = chance.weighted([true, false], [5, 95]);
		return obj;
}


module.exports = router;