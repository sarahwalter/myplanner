'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])
.controller('LoginCtrl', ['$scope', function($scope) {
    $scope.submitForm = function(isValid){
		if (isValid) {
		    alert('login works');
		}
	};

}]);