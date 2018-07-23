'use strict';

angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'RegisterCtrl'
  });
}])
.controller('RegisterCtrl', ['$scope', '$http', '$location', '$rootScope', '$cookies', function($scope, $http, $location, $rootScope, $cookies) {
    $scope.submitForm = function(isValid){
		if (isValid) {
		    /* Structure JSON to send to database */
		    var toSend = {
              first_name : $scope.first,
              last_name : $scope.last,
              email_address : $scope.email,
              password : $scope.password
              };
             
             /* POST to database */
            $http.post("/users", toSend)
            .then(function successful(response){
                /* Create global variable for currentUser */
                $rootScope.globals = {
                    currentUser : {
                        username: response.data.username,
                        user_id: response.data.user_id
                    }
                };
                
                /* The following code is from http://jasonwatmore.com/post/2015/03/10/angularjs-user-registration-and-login-example-tutorial#logincontroller */
                // set default auth header for http requests
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.user_id;
                // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
                var cookieExp = new Date();
                cookieExp.setDate(cookieExp.getDate() + 7);
                $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
                
                /* Redirect to landing page */
                $location.path('/');
                }, function failure(response){
                    /* If server returns error, display message */
                    $scope.errorMessage = response.data;
                });
		}
	};

}]);