'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http', '$scope', function($http, $scope) {
    $http.get('/users/1', null).then(function(response){
        console.log(response);
        $scope.users = response.data;
    });
    $http.get('/calendar_events/event/1', null).then(function(response){
        console.log(response);
        $scope.rules = response.data;
    });
}]);