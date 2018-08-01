'use strict';

angular.module('myApp.calendar-ui', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calendar-ui', {
    templateUrl: 'calendar-ui/calendar-ui.html',
    controller: 'Calendar-uiCtrl'
  });
}])

.controller('Calendar-uiCtrl', ['$http', '$scope', '$rootScope', 'uiCalendarConfig', function ($http, $scope, $rootScope, uiCalendarConfig) {
        $scope.SelectedEvent = null;
        var isFirstTime = true;
        
        $scope.events = [];
        $scope.eventSources = [$scope.events];
        
       
        //Load events from server
        $http.get('/calendar-ui/'+ $rootScope.globals.currentUser.user_id, {
            cache: true,
            params: {}
        }).then(function (data) {
            $scope.events.splice(0, $scope.events.length);
            
            angular.forEach(data.data, function (value) {
                var dateStart = new Date(value.startAt);
                var dateEnd = new Date(value.endAt);
                var userTimezoneOffset = dateStart.getTimezoneOffset() * 60000;
                
                $scope.events.push({
                    title: value.title,
                    description: value.Description,
                    start: new Date(dateStart.getTime() + userTimezoneOffset),
                    end: new Date(dateEnd.getTime() + userTimezoneOffset),
                    allDay : (value.isFullDay === "false")
                });
            });
        });
        
        //Configure the Calendar
        $scope.uiConfig = {
            calendar : {
                height: 450,
                editable: true,
                displayEventTime: false,
                header: {
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev, next'
                },
                eventClick: function (event) {
                    $scope.SelectedEvent = event;
                },
                eventAfterAllRender: function () {
                    if ($scope.events.length > 0 && isFirstTime) {
                        //Focus first event
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                    }
                }
            }
        };
    }]);

