'use strict';

angular.module('myApp.event_edit', ['ngRoute', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/eventForm/:id', {
        templateUrl: 'event/eventEditForm.html',
        controller: 'EventEditCtrl'
    });
}])

.controller('EventEditCtrl', ['$http', '$scope', '$rootScope', '$location', '$window', '$route', '$routeParams', function($http, $scope, $rootScope, $location, $route, $routeParams) {
    if(!$rootScope.globals.currentUser){$location.path('/login')}
    let user_id = $rootScope.globals.currentUser.user_id;
    $scope.id = $routeParams.current.params.id;
    $http.get('/calendar_events/event/' + $scope.id).then(function(res){
        let response = res.data[0];
        let start = new Date(response.start_datetime);
        let end = new Date(response.end_datetime);
        $scope.eventTitle = response.title;
        $scope.eventDate = start;
        $scope.eventTime = new Date(start.getTime());
        $scope.endDate = end;
        $scope.endTime = new Date(end.getTime());
        $scope.eventNote = response.notes;
        $scope.eventType = response.event_type;
        $scope.rep_day_week = response.rep_day_week;
        $scope.rep_day_month = response.rep_day_month;
        $scope.rep_stop_date = response.rep_stop_date;
        $scope.all_day = response.isFullDay;
        $scope.amount = response.amount;
    });

    $scope.submitEvent = function() {
        if ($scope.eventTitle === "") { $scope.errorMessage = "Event title required"; return;}
        if ($scope.rep_day_week === "") { $scope.rep_day_week = null; }
        if ($scope.rep_day_month === "") { $scope.rep_day_month = null; }
        if ($scope.eventType !== "event") { $scope.all_day = true; $scope.endDate = $scope.eventDate; }
        if (new Date($scope.endDate) < new Date($scope.eventDate)) { $scope.endDate = $scope.eventDate; }
        let eventSubmit = {
            event_id: $scope.id,
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
        $http.patch('/calendar_events', eventSubmit, null).then(function successful(response) {
            if (response.status !== 204) { $scope.errorMessage = response.data; } //If unsuccessful server returns error, display message
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