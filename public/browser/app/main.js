'use strict';

var app = angular.module('auther', ['ui.router']);

app.run(function(Auth){
	Auth.checkSession();
});

app.config(function ($urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
});