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
    let user_id = $rootScope.globals.currentUser.user_id;
    $scope.eventTitle = "";
    $scope.eventDate = new Date();
    $scope.eventTime = new Date(new Date().toDateString() + ' ' + '08:00');
    $scope.endDate = new Date();
    $scope.endTime = new Date(new Date().toDateString() + ' ' + '09:00');
    $scope.eventNote = "";
    $scope.eventType = "event";
    $scope.rep_day_week = null;
    $scope.rep_day_month = null;
    $scope.rep_stop_date = null;
    $scope.all_day = false;
    $scope.amount = 0;

    $scope.submitEvent = function() {
        if ($scope.eventTitle === "") { $scope.errorMessage = "Event title required"; return;}
        if ($scope.rep_day_week === "") { $scope.rep_day_week = null; }
        if ($scope.rep_day_month === "") { $scope.rep_day_month = null; }
        if ($scope.eventType !== "event") { $scope.all_day = true; $scope.endDate = $scope.eventDate; }
        if (new Date($scope.endDate) < new Date($scope.eventDate)) { $scope.endDate = $scope.eventDate; }
        let eventSubmit = {
            user_id: user_id,
            start_datetime: datetimeFormatter($scope.eventDate, $scope.eventTime),
            end_datetime: datetimeFormatter($scope.endDate, $scope.endTime),
            title: $scope.eventTitle,
            notes: $scope.eventNote,
            isFullDay: $scope.all_day,
            rep_stop_date: $scope.rep_stop_date,
            rep_day_month: $scope.rep_day_month,
            rep_day_week: $scope.rep_day_week,
            event_type: $scope.eventType,
            amount: $scope.amount,
            job_id: null
        };
        console.log(eventSubmit);
        $http.post('/calendar_events', eventSubmit, null).then(function successful(response) {
            if (response.status !== 201) { $scope.errorMessage = response.data; } //If unsuccessful server returns error, display message
            else { $location.path('/calendar'); } // If successful redirect to calendar page
        });
    };

    /*Formats JS datetime for MySQL*/
    function datetimeFormatter(date, time) {
        let newDate = (date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let hours = (time.getHours() < 10) ? ("0" + time.getHours()) : time.getHours();
        let minutes = (time.getMinutes() < 10) ? ("0" + time.getMinutes()) : time.getMinutes();
        let newTime = hours + ":" + minutes + ":" + "00";
        return newDate + " " + newTime;
    }
}]);