'use strict';

/* Calendar citation / tutorial = https://www.youtube.com/watch?v=xhnKKEpZDeQ */

angular.module('myApp.calendar', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calendar', {
    templateUrl: 'calendar/calendar.html',
    controller: 'CalendarCtrl'
  });
}])

.controller('CalendarCtrl', ['$http', '$scope', '$rootScope', 'uiCalendarConfig', '$location', '$route', '$window',
    function ($http, $scope, $rootScope, uiCalendarConfig, $location, $route, $window) {
    if(!$rootScope.globals.currentUser){$location.path('/login')}

    function init(){
        $scope.getEvents();
    }

    const MONTH = "m", WEEK = "w", DAY = "d";
    const weekdayNumberConversion  = {
        "Sunday" : 0,
        "Monday" : 1,
        "Tuesday" : 2,
        "Wednesday" : 3,
        "Thursday" : 4,
        "Friday" : 5,
        "Saturday" : 6
    };

    $scope.SelectedEvent = null;
    let isFirstTime = true;
    let userID = $rootScope.globals.currentUser.user_id;
    $scope.events = [];
    $scope.selectedViewType = MONTH;
    $scope.eventSources = [$scope.events];
    $scope.selectedDate = new Date(Date.now());
    $scope.calledOnce = false;

    $scope.createEvent = function(){
        $location.path('/eventForm');
    };

    //Load events from server
    $scope.getEvents = function(){
        $http.get('/calendar_events/user/'+ userID, null).then(function (response) {
            $scope.events.splice(0, $scope.events.length);
            let rawEvents = response.data;
            //Only jump into this if-block on the initial page load ...
            if (!$scope.calledOnce) {
                $scope.calledOnce = true;
                $scope.m = $('#calendar').fullCalendar('getCalendar').moment();
                $scope.selectedDate = new Date($scope.m._d);
                $window.addEventListener("DOMContentLoaded", $scope.changeSelectedViewType());
                $window.addEventListener("DOMContentLoaded", $scope.increase());
                $window.addEventListener("DOMContentLoaded", $scope.decrease());
            }
            prepareEventsArray(rawEvents);
            rawEvents.forEach(function(event) {
                /* Timezone fix for date */
                /* https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript */
                let dateStart = new Date(event.start_datetime);
                let dateEnd = (event.end_datetime) ? new Date(event.end_datetime) : dateStart;
                if (!event.end_datetime) { event.isFullDay = "true"; }
                let userTimezoneOffset = dateStart.getTimezoneOffset() * 60000;
                let fullDay = event.isFullDay;
                $scope.events.push({
                    event_id : event.event_id,
                    title: event.title,
                    description: event.notes,
                    start: new Date(dateStart.getTime() + userTimezoneOffset),
                    end: new Date(dateEnd.getTime() + userTimezoneOffset),
                    allDay : fullDay,
                    stick: true
                });
            });
        });
    };

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
                    $location.path('/eventForm');
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

    $scope.deleteEvent = function(event_id){
        console.log("in delete function");
        console.log(event_id);
        $http.delete('/calendar_events/' + event_id, null).then(function(response){
            console.log("in delete function");
                    /* Redirect to view1 page */
                    $route.reload();
        });
    };

    $scope.changeSelectedViewType = function(){
        if (angular.element('.fc-month-button')[0] !== null){
            document.getElementsByClassName('fc-month-button')[0].addEventListener("click", function(){
                $scope.selectedViewType = MONTH;
            });
        }
        if (angular.element('.fc-month-button')[0] !== null){
            document.getElementsByClassName('fc-agendaWeek-button')[0].addEventListener("click", function(){
                $scope.selectedViewType = WEEK;
            });
        }
        if (angular.element('.fc-month-button')[0] !== null){
            document.getElementsByClassName('fc-agendaDay-button')[0].addEventListener("click", function(){
                $scope.selectedViewType = DAY;
            });
        }
    };

    $scope.increase = function() {
        if (angular.element('.fc-next-button')[0] !== null){
            document.getElementsByClassName('fc-next-button')[0].addEventListener("click", function(){
                if ($scope.selectedViewType === MONTH){
                    $scope.selectedDate.setMonth($scope.selectedDate.getMonth()+1);
                }
                else if ($scope.selectedViewType === WEEK){
                    $scope.selectedDate.setDate($scope.selectedDate.getDate()+7);
                }
                else if ($scope.selectedViewType === DAY){
                    $scope.selectedDate.setDate($scope.selectedDate.getDate()+1);
                }
                $scope.getEvents();
            });
        }
    };

    $scope.decrease = function(){
        if (angular.element('.fc-prev-button')[0] !== null){
            document.getElementsByClassName('fc-prev-button')[0].addEventListener("click", function(){
                if ($scope.selectedViewType === MONTH){
                    $scope.selectedDate.setMonth($scope.selectedDate.getMonth()-1);
                }
                else if ($scope.selectedViewType === WEEK){
                    $scope.selectedDate.setDate($scope.selectedDate.getDate()-7);
                }
                else if ($scope.selectedViewType === DAY){
                    $scope.selectedViewType.setDate($scope.selectedDate.getDate()-1);
                }
                $scope.getEvents();
            });
        }
    };


        /*****************TESTING**************/
     /*******************************************************************************
     * Name: prepareEventsArray
     * @param array of raw (MySQL provided) calendar_event objects
     * Description: Performs multiple tasks that prepares this array for display to
     * the user including removing events that should not be displayed, changing the
     * datetime format for better visual display
     *******************************************************************************/
    function prepareEventsArray(array){
        /* This initial block checks for event rules that have been passed back that should not populate in the calendar.
        If the event shouldn't populate, the index is recorded and each index is removed after the forEach block. Since
        there are additional areas where events must be removed, toRemove is reset to an empty array.*/
        let toRemove = []; //List of event IDs to remove from list
        let toAdd = []; //List events to add to the list
        array.forEach(function(event){
            let start = new Date(event.start_datetime);
            let stop = (event.end_datetime) ? new Date(event.end_datetime) : null;
            let selectedMonth = $scope.selectedDate.getMonth();
            let selectedYear = $scope.selectedDate.getFullYear();

            if((start.getFullYear() > selectedYear || (start.getFullYear() === selectedYear && start.getMonth() > selectedMonth))
                || (stop !== null && ((stop.getFullYear() < selectedYear) || (stop.getFullYear() === selectedYear && stop.getMonth() < selectedMonth)))){
                toRemove.push(event.event_id);
            }
        });

        toRemove.forEach(function(id){
            array.splice(array.findIndex(event => event.event_id === id), 1);
        });

        toRemove = [];

        /*This moves through the list of events that need to be populated and either creates appropriate repeating events for
        * the given month or just updates the datetime to a date format (YYYY-MM-DD)*/
        array.forEach(function(event){
            if (event.rep_day_week){ //IF REPEATS BASED ON DAY OF WEEK
                //Create events based on the event rule, then remove the event rule so it doesn't populate (could result in duplicates)
                let repeatedEvents = createEventsFromWeekdayRepeatRule(event);
                toRemove.push(event.event_id);
                repeatedEvents.forEach(function(event){
                    toAdd.push(event);
                });
            }
            else if (event.rep_day_month){ //IF REPEATS BASED ON DAY OF THE MONTH
                event.start_datetime = new Date($scope.selectedDate.getFullYear(), $scope.selectedDate.getMonth(), event.rep_day_month);
            }
        });
        toRemove.forEach(function(id){
            array.splice(array.findIndex(event => event.event_id === id), 1);
        });
        toAdd.forEach(function(event){
            array.push(event);
        });
    }

    /*******************************************************************************
     * Name: createEventsFromWeekdayRepeatRule
     * @param event object
     * Description: The event object will be duplicated into multiple objects based
     * on the weekday repeating status. For example, if the event repeats every Monday
     * the this function will find every monday in the selected month and create a
     * duplicate event for that date.
     *******************************************************************************/
    function createEventsFromWeekdayRepeatRule(event){
        //Start at the beginning of a given month and find all matching weekdays for that month (e.g., all Mondays in July)
        let tmpDate = new Date($scope.selectedDate.getFullYear(), $scope.selectedDate.getMonth(), 1);
        let month = tmpDate.getMonth();
        let eventStorage = [];
        while (tmpDate.getMonth() === month){
            //If the day of week matches, create a duplicate event in storage and change the start date to the discovered date
            if (tmpDate.getDay() === weekdayNumberConversion[event.rep_day_week]
            && tmpDate <= new Date(event.rep_stop_date)) {
                let tmpEvent = Object.assign({}, event); //Cloning object so it doesn't alter existing ones
                tmpEvent.start_datetime = tmpDate.getFullYear() + "-" + (tmpDate.getMonth()+1) + "-" + tmpDate.getDate();
                tmpEvent.end_datetime = tmpDate.getFullYear() + "-" + (tmpDate.getMonth()+1) + "-" + tmpDate.getDate();
                eventStorage.push(tmpEvent);
            }
            tmpDate.setDate(tmpDate.getDate()+1);
        }
        return eventStorage;
    }
    init();
    }]);

