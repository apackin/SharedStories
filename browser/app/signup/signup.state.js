'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('signup', {
		url: '/signup',
		templateUrl: '/browser/app/signup/signup.html',
		controller: function($scope, Auth) {
			$scope.submitSignUp = function(){
				var obj = {
					email: $scope.signupForm.email.$viewValue,
					password: $scope.signupForm.password.$viewValue
				};
				return Auth.signUp(obj);
			};
		},
	});
});