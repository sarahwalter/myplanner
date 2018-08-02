'use strict';

/* Calendar citation / tutorial = https://www.youtube.com/watch?v=xhnKKEpZDeQ */

angular.module('myApp.calendar', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calendar', {
    templateUrl: 'calendar/calendar.html',
    controller: 'CalendarCtrl'
  });
}])

.controller('CalendarCtrl', ['$http', '$scope', '$rootScope', 'uiCalendarConfig', '$window', '$location', function ($http, $scope, $rootScope, uiCalendarConfig, $window, $location) {

        $scope.SelectedEvent = null;
        var isFirstTime = true;
        
        $scope.events = [];
        $scope.eventSources = [$scope.events];
        
        $scope.createEvent = function(){
            $location.path('/eventForm');
        };
        //Load events from server
        $http.get('/calendar-ui/'+ $rootScope.globals.currentUser.user_id, null).then(function (data) {
            $scope.events.splice(0, $scope.events.length);
            
            angular.forEach(data.data, function (value) {
            
                /* Timezone fix for date */
                /* https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript */
                var dateStart = new Date(value.start_datetime);
                var dateEnd = new Date(value.end_datetime);
                var userTimezoneOffset = dateStart.getTimezoneOffset() * 60000;
                
                $scope.events.push({
                    title: value.title,
                    description: value.notes,
                    start: new Date(dateStart.getTime() + userTimezoneOffset),
                    end: new Date(dateEnd.getTime() + userTimezoneOffset),
                    allDay : (value.isFullDay === "true"),
                    stick: true
                });
            });
        });
        console.log($scope.eventSources);
        //Configure the Calendar
        $scope.uiConfig = {
            calendar : {
                height: 450,
                editable: true,
                displayEventTime: false,
                
                /*customButtons: {
                    addEvent: {
                    text: '+',
                    click: function() {
                        //$location.path('/eventForm');
                        $window.location.href = '#!/eventForm';
                        }
                    }
                 },*/
                header: {
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev, next'  //addEvent
                },
                eventClick: function (event) {
                    $scope.SelectedEvent = event;
                },
                /*eventAfterAllRender: function () {
                    if ($scope.events.length > 0 && isFirstTime) {
                        //Focus first event
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                    }
                }*/
            }
        };
    }]);
