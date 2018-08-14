'use strict';

angular.module('myApp.budget', ['ngRoute', 'ngMaterial'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/budget', {
            templateUrl: 'budget/budget.html',
            controller: 'BudgetCtrl'
        });
    }])

    .controller('BudgetCtrl', ['$http', '$scope', '$rootScope', '$location', function ($http, $scope, $rootScope, $location) {
        if(!$rootScope.globals.currentUser){ $location.path('/login') }

        const weekdayNumberConversion  = {
            "Sunday" : 0,
            "Monday" : 1,
            "Tuesday" : 2,
            "Wednesday" : 3,
            "Thursday" : 4,
            "Friday" : 5,
            "Saturday" : 6
        };

        $scope.selectedDate = new Date(Date.now());

        let user_id = $rootScope.globals.currentUser.user_id;

        $scope.init = function(){
            $scope.getEvents();
        };

        $scope.getEvents = function(){
            $http.get('/calendar_events/user/' + user_id, null).then(function(response){
                $scope.events = response.data;
                $scope.dateChange();
            });
        };

        $scope.dateChange = function(){
            $scope.incomeEvents = $scope.events.filter(event => event.event_type === "income");
            $scope.expenseEvents = $scope.events.filter(event => event.event_type === "expense");
            prepareEventsArray($scope.incomeEvents);
            prepareEventsArray($scope.expenseEvents);
            $scope.totalIncome = getTotal($scope.incomeEvents);
            $scope.totalExpenses = getTotal($scope.expenseEvents);
            $scope.unallocated = ($scope.totalIncome - $scope.totalExpenses).toFixed(2);
        };

        /*******************************************************************************
         * Name: prepareEventsArray
         * @param array of raw (MySQL provided) calendar_event objects
         * Description: Performs multiple tasks that prepares this array for display to
         * the user including removing events that should not be displayed, changing the
         * datetime format for better visual display, and sorting everything by date
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

                // console.log("SELECTED: " + selectedYear + "   " + selectedMonth);
                // console.log("START: " + event.title + ": " + start.getFullYear() + "   " + start.getMonth());
                // if (stop) { console.log("STOP: " + event.title + ": " + stop.getFullYear() + "   " + stop.getMonth()); }

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
                let convertedDate;
                if (event.rep_day_week){ //IF REPEATS BASED ON DAY OF WEEK
                    //Create events based on the event rule, then remove the event rule so it doesn't populate (could result in duplicates)
                    let repeatedEvents = createEventsFromWeekdayRepeatRule(event);
                    toRemove.push(event.event_id);
                    repeatedEvents.forEach(function(event){
                        toAdd.push(event);
                    });
                }
                else {
                    if (event.rep_day_month) { //IF REPEATS BASED ON DAY OF THE MONTH
                        convertedDate = new Date($scope.selectedDate.getFullYear(), $scope.selectedDate.getMonth(), event.rep_day_month);
                    }
                    else {
                        let d = event.start_datetime.split(/[- : T]/);
                        convertedDate = new Date(d[0], d[1] - 1, d[2]);
                    }
                    event.start_datetime = (convertedDate.getFullYear()) + "-" + (convertedDate.getMonth() + 1) + "-" + convertedDate.getDate();
                }
            });
            toRemove.forEach(function(id){
                array.splice(array.findIndex(event => event.event_id === id), 1);
            });
            toAdd.forEach(function(event){
                array.push(event);
            });
            //Once all is done, sort the array in ascending date order
            dateTimeSort(array);
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
                    eventStorage.push(tmpEvent);
                }
                tmpDate.setDate(tmpDate.getDate()+1);
            }
            return eventStorage;
        }

        /*******************************************************************************
         * Name: getTotal
         * @param array of event objects with amounts
         * Description: Sums the amounts of every object in the array
         *******************************************************************************/
        function getTotal(array){
            let total = 0;
            array.forEach(function(event){
                total += event.amount;
            });
            return total.toFixed(2);
        }

        /*******************************************************************************
         * Name: dateTimeSort
         * @param array of event objects with start_datetime formatted as YYYY-MM-DD
         * Description: Sorts every object in the array in ascending order by date
         *******************************************************************************/
        function dateTimeSort(array){
            array.sort(function(a, b){
                //Only need to compare the day of the month (month and year will always be the same). This requires splitting
                //the string value and casting it to an integer so it compares ints instead of Unicode values
                let a_start = parseInt(a.start_datetime.split(/-/)[2], 10);
                let b_start = parseInt(b.start_datetime.split(/-/)[2], 10);
                return a_start > b_start || -(a_start <= b_start);
            });
        }
        $scope.init();
    }]);

