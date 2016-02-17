'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('login', {
		url: '/login',
		templateUrl: '/browser/app/login/login.html',
		controller: function ($scope, Auth) {
			$scope.submitLogin = function(){
				var obj = {
					email: $scope.loginForm.email.$viewValue,
					password: $scope.loginForm.password.$viewValue
				};
				return Auth.login(obj);
			};
		},
	});
});