'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {
    $http.get('/users/' + $rootScope.globals.currentUser.user_id, null).then(function(response){
        console.log(response);
        $scope.users = response.data;
    });
  
    $http.get('/calendar_events/user/' + $rootScope.globals.currentUser.user_id, null).then(function(response){
        console.log(response);
        $scope.rules = response.data;
    });
}]);