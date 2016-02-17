'use strict';

app.factory('Auth', function($http, $state){

	var objjj = {
		sendRequest : function(obj, method, path){
			return $http[method]('api/auth/' + path , obj)
			.then(function(res){
				console.log("Thank you.", res);
				objjj.admin = res.data?1:2;
				$state.go('stories');
			}, 
			function(err){
				console.log(err.status, " ", err.data,": ", "Email or password are not valid");
			});
		},

		signUp: function(obj){
			this.sendRequest(obj, 'put', 'signup');
		},

		login: function(obj){
			this.sendRequest(obj, 'post', 'login');
		},

		logout: function(){
			return $http.get('api/auth/logout')
			.then(function(res){
				console.log(res);
				objjj.admin=null;
				$state.go('home');
			});
		},

		isAdmin: function(){
			console.log("checking if admin", objjj.admin);
			return objjj.admin;
		},

		checkSession: function(){
			$http.get("api/auth/me")
			.then(function(res){
				objjj.admin = res.data?1:2;
			});
		}


	};

	return objjj;


});