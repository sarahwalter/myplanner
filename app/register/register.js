'use strict';
angular.module('myApp.register', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'RegisterCtrl'
  });
}])
.controller('RegisterCtrl', ['$scope', '$http', '$location', '$rootScope', '$cookies', function($scope, $http, $location, $rootScope, $cookies) {
    if($scope.errorMessage){ $scope.errorMessage = undefined}
    ClearCredentials();
    
    $scope.submitRegister = function(){
        if ($scope.first === undefined || $scope.first === ""){$scope.errorMessage = "First name required"}
        else if ($scope.last === undefined || $scope.last === ""){$scope.errorMessage = "Last name required"}
        else if ($scope.email === undefined || $scope.email=== ""){ $scope.errorMessage = "Valid email required"}
        else if ($scope.password === undefined || $scope.password === ""){$scope.errorMessage = "Password required"}
        else if ($scope.password.length < 5){$scope.errorMessage = "Password must be at least 5 characters"}
		else {
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
    
    /* The following code is from http://jasonwatmore.com/post/2015/03/10/angularjs-user-registration-and-login-example-tutorial#logincontroller */
    function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
}]);