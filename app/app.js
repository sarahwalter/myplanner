'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMessages',
  'ngCookies',
  'myApp.profile',
  'myApp.view2',
  'myApp.landing',
  'myApp.register',
  'myApp.login',
  'myApp.calendar',
  'myApp.budget',
  'myApp.version',
  'myApp.logout',
  'myApp.navigation',
  'myApp.paycheck_estimator',
  'ui.calendar',
  'myApp.event',
  'myApp.jobs'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/calendar'});
}]).
run(['$rootScope', '$location', '$http', '$cookies', function($rootScope, $location, $http, $cookies) {
  $rootScope.globals = $cookies.getObject('globals') || {};
  if($rootScope.globals.currentUser) {
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.user_id;
  }
  
}]);
