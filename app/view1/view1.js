'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http', '$scope', '$rootScope', '$location', '$route', function($http, $scope, $rootScope, $location, $route) {
     if(!$rootScope.globals.currentUser){$location.path('/login')}
     else{
        $http.get('/users/' + $rootScope.globals.currentUser.user_id, null).then(function(response){
            console.log(response);
            $scope.users = response.data;
        });
      
        $http.get('/calendar_events/user/' + $rootScope.globals.currentUser.user_id, null).then(function(response){
            $scope.rules = response.data;
        });
        
        $scope.DeleteEvent = function(event_id){
            console.log("in delete function");
            console.log(event_id);
            $http.delete('/calendar_events/' + event_id, null).then(function(response){
                console.log("in delete function");
                        /* Redirect to view1 page */
                        $route.reload();
            });
        };
            
     }
}]);