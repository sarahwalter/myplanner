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
    let user_id = $rootScope.globals.currentUser.user_id;
    $scope.changedPass = "";

    $http.get('/users/' + user_id, null).then(function(response){
        $scope.user = response.data[0];
    });

    $scope.update = function(){
        let newProfile = {
            user_id : user_id,
            first_name : $scope.user.first_name,
            last_name : $scope.user.last_name,
            email_address : $scope.user.email_address,
            password : $scope.changedPass
        };

        console.log(newProfile);

        $http.patch('/users/', newProfile).then(function(response){
            if (response.status !== 204){
                alert("Your credentials were not saved");
                $rootScope.globals.currentUser.name = $scope.user.first_name + " " + $scope.user.last_name;
            }
            else alert("Credentials successfully saved");
        });
    }
}]);