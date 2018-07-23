'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'RegisterCtrl'
  });
}])
.controller('RegisterCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.submitForm = function(isValid){
		if (isValid) {
		    var toSend = {
              first_name : $scope.first,
              last_name : $scope.last,
              email_address : $scope.email,
              password : $scope.password
              };
             
            $http.post("/users", toSend)
            .then(function successful(response){
                console.log(response);
                }, function failure(response){
                    $scope.errorMessage = response.data;
                });
		}
	};

}]);