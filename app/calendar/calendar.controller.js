'use strict';

angular.module('myApp.calendar', ['ngRoute', 'ngMaterial'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/calendar', {
            templateUrl: 'calendar/calendar.html',
            controller: 'CalendarCtrl'
        });
    }])

    .controller('CalendarCtrl', ['$http', '$scope', '$rootScope', '$location', function($http, $scope, $rootScope, $location) {
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
                rep_stop_date : null,
                rep_day_month : null,
                rep_day_week : null,
                event_type : $scope.eventType,
                amount : null,
                job_id : null
            };

            $http.post('/calendar_events', eventSubmit, null)
            .then(function successful(response){
                /* If successful redirect to landing page*/
                console.log(response);
                $location.path('/');
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
    }]);