'use strict';

angular.module('myApp.jobs', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/jobs', {
    templateUrl: 'jobs/jobs.html',
    controller: 'JobsCtrl'
  });
}])

.controller('JobsCtrl', ['$http', '$scope', '$rootScope', '$location', function($http, $scope, $rootScope, $location) {
     if(!$rootScope.globals.currentUser){$location.path('/login')}
     else{
       
      
       /* $http.get('/users/' + $rootScope.globals.currentUser.user_id, null).then(function(response){
            console.log(response);
            $scope.users = response.data;
        });
        */
      
       
     }
}]);