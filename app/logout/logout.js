'use strict';

angular.module('myApp.logout', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/logout', {
      templateUrl: 'logout/logout.html',
    controller: 'LogoutCtrl'
  });
}])

.controller('LogoutCtrl', ['$scope', '$http', '$rootScope', '$cookies', '$location', function($scope, $http, $rootScope, $cookies, $location) {
  
  console.log("current user" + $rootScope.globals.currentUser);
  console.log("in logout function");
  if($rootScope.globals.currentUser) {
    ClearCredentials();
  
    /* The following code is from http://jasonwatmore.com/post/2015/03/10/angularjs-user-registration-and-login-example-tutorial#logincontroller */
    function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
        
          /* Redirect to login page */
                $location.path('/login');
  }
}]);