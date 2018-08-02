'use strict';

angular.module('myApp.event', ['ngRoute', 'ngMaterial'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/eventForm', {
            templateUrl: 'event/eventForm.html',
            controller: 'EventCtrl'
        });
    }])

    .controller('EventCtrl', ['$http', '$scope', '$rootScope', '$location', '$window', '$route', function($http, $scope, $rootScope, $location, $window, $route) {
        if(!$rootScope.globals.currentUser){$location.path('/login')}
        else{
            $scope.user_id = $rootScope.globals.currentUser.user_id
            $scope.eventTitle = "";
            $scope.eventDate = new Date();
            $scope.eventTime = new Date(new Date().toDateString() + ' ' + '08:00');
            $scope.eventNote = "";
            $scope.eventType = "";
    
            $scope.submitEvent = function(){
                
                if ($scope.eventTitle == ""){ $scope.errorMessage = "Event title required"}
                else {
                var eventSubmit = {
                    user_id : $rootScope.globals.currentUser.user_id,
                    start_datetime : datetimeFormatter($scope.eventDate, $scope.eventTime),
                    end_datetime: null,
                    title : $scope.eventTitle,
                    notes : $scope.eventNote,
                    isFullDay : false,  //this value currently not passed through server to database
                    rep_stop_date : null,
                    rep_day_month : null,
                    rep_day_week : null,
                    event_type : $scope.eventType,
                    amount : null,
                    job_id : null
                };
                $http.post('/calendar_events', eventSubmit, null)
                .then(function successful(response){
                    /* If successful redirect to calendar page*/
                    $location.path('/calendar');
                }, function failure(response){
                        /* If not successful */
                        /*server returns error, display message */
                        $scope.errorMessage = response.data;
                    });
                }
            };
    
            /*Formats JS datetime for MySQL*/
            function datetimeFormatter(date, time){
                var newDate = (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                var hours = (time.getHours() < 10) ? ("0" + time.getHours()) : time.getHours();
                var minutes = (time.getMinutes() < 10) ? ("0" + time.getMinutes()) : time.getMinutes();
                var newTime = hours + ":" + minutes + ":" + "00";
                return newDate + " " + newTime;
            }
        }
    }]);