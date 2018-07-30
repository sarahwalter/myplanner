'use strict';

angular.module('myApp.landing', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/landing', {
    templateUrl: 'landing/landing.html',
    controller: 'LandingCtrl'
  });
}])

.controller('LandingCtrl', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {
    
}]);