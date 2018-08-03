'use strict';

angular.module('myApp.navigation', ['ngRoute'])
.controller('navigationCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.isLoggedIn = false;
    if($rootScope.globals.currentUser){ $scope.isLoggedIn = true}
}]);