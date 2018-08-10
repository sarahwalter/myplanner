'use strict';

angular.module('myApp.navigation', ['ngRoute'])
.controller('navigationCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.isLoggedIn = false;
    if($rootScope.globals.currentUser){ 
        console.log("user logged in");
        $scope.isLoggedIn = true}
}]);