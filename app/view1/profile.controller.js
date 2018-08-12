'use strict';

angular.module('myApp.profile', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'view1/profile.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http', '$scope', '$rootScope', '$location', function($http, $scope, $rootScope, $location) {
     if(!$rootScope.globals.currentUser){$location.path('/login')}
     else{
        $http.get('/users/' + $rootScope.globals.currentUser.user_id, null).then(function(response){
            console.log(response);
            $scope.users = response.data;
        });
      
        $http.get('/calendar_events/user/' + $rootScope.globals.currentUser.user_id, null).then(function(response){
            console.log(response);
            $scope.rules = response.data;
        });
     }
}]);