'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])
.controller('LoginCtrl', ['$scope', '$http', '$rootScope', '$cookies', '$location', function($scope, $http, $rootScope, $cookies, $location) {
    
    ClearCredentials();
    $scope.submitLogin = function(){
        console.log("in submit");
        var isValid = true;
		if (isValid) {
		    /* Structure JSON to send to database */
		    var toSend = {
              email_address : $scope.email,
              password : $scope.password
              };
              console.log("in login controller" + toSend);
            /* Send post request to server */  
            $http.post("/users", toSend)
            .then(function successful(response){
                /* If successful */
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
                    /* If not successful */
                    /*server returns error, display message */
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