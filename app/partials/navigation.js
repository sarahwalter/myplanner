'use strict';

angular.module('myApp.navigation', ['ngRoute'])
.controller('navigationCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.isLoggedIn = false;

    if($rootScope.globals.currentUser){
        $scope.first_last = $rootScope.globals.currentUser.name;
        $scope.isLoggedIn = true;
    }

}]);