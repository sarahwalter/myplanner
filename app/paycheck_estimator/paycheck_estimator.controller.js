'use strict';

angular.module('myApp.paycheck_estimator', ['ngRoute', 'ngMaterial'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/paycheck_estimator', {
            templateUrl : 'paycheck_estimator/paycheck_estimator.html',
            controller : 'PaychkCtrl'
        });
    }])

    .controller('PaychkCtrl', ['$http', '$scope', '$rootScope', '$location', function($http, $scope, $rootScope, $location){
        if(!$rootScope.globals.currentUser){$location.path('/login')}
        else{
            const HOURLY = 2080, WEEKLY = 52, MONTHLY = 12, ANNUALLY = 1, BIWEEKLY = 26, BIMONTHLY = 24;
            const ALLOWANCE = 4050; //According to blog: http://evolvingpf.com/2017/06/w-4-calculations-dont-black-box/
            const STAND_DED_SINGLE = 12000;
            const STAND_DED_HEAD = 18000;
            const STAND_DED_MARRIED = 24000;
    
            let user_id = $rootScope.globals.currentUser.user_id;
    
            //This occurs on instantiation
            $http.get('/jobs/user/' + user_id, null).then(function(response){
                $scope.allJobs = response.data;
                $scope.jobInfo = response.data[0];
                $scope.formFill();
            });
    
            //Based on the rate that was provided, calculate the annual gross income
            function getAnnualGross(jobInfo){
                let period = jobInfo.frequency;
                let annualGross = '';
                switch (period){
                    case 'Hourly': annualGross = jobInfo.wage * HOURLY; break;
                    case 'Weekly': annualGross = jobInfo.wage * WEEKLY; break;
                    case 'Monthly' : annualGross = jobInfo.wage * MONTHLY; break;
                    case 'Annually' : annualGross = jobInfo.wage * ANNUALLY; break;
                    case 'Bi-Weekly' : annualGross = jobInfo.wage * BIWEEKLY; break; //Every two weeks
                    case 'Bi-Monthly' : annualGross = jobInfo.wage * BIMONTHLY; break; //Twice per month
                    default : annualGross = 0; //Should never happen ... undoubtedly will
                }
    
                return annualGross.toFixed(2);
            }
    
            //Gets the gross expected for the pay period
            function getPayPeriodGross(jobInfo){
                let salary = 0;
    
                switch (jobInfo.frequency){
                    case 'Hourly' : salary = jobInfo.wage * 40; break;
                    case 'Annually' : salary = jobInfo.wage / MONTHLY; break;
                    default : salary = jobInfo.wage;
                }
    
                return salary.toFixed(2);
            }
    
            //Calculates the user's standard deduction for the given pay period
            function getPayPeriodDeduction(jobInfo){
                let deduction = 0; //standard deduction amount
                let payPeriod = 0; //Total pay periods for the year
    
                switch(jobInfo.filing_status){
                    case 'Single' : deduction = STAND_DED_SINGLE; break;
                    case 'Married Filing Jointly' : deduction = STAND_DED_MARRIED; break;
                    case 'Married Filing Separately' : deduction = STAND_DED_SINGLE; break;
                    case 'Head of Household' : deduction = STAND_DED_HEAD; break;
                    case 'Qualifying Widower' : deduction = STAND_DED_MARRIED; break;
                }
    
                switch(jobInfo.frequency){
                    case 'Hourly':
                    case 'Weekly': payPeriod = WEEKLY; break;
                    case 'Monthly':
                    case 'Annually': payPeriod = MONTHLY; break;
                    case 'Bi-Weekly': payPeriod = BIWEEKLY; break;
                    case 'Bi-Monthly': payPeriod = BIMONTHLY; break;
                }
    
                return deduction / payPeriod;
            }
    
            //Taxable income is the salary minus standard deduction minus retirement percentage minus pre-tax static amounts
            function getTaxableIncome(jobInfo){
                return ($scope.payPeriodGross -
                    ($scope.payPeriodGross * (jobInfo.retirement_percent / 100)) -
                    jobInfo.pretax_static - getPayPeriodDeduction(jobInfo)).toFixed(2);
            }
    
            //Perform the tax calculations based on federal/local percentages and post tax deductions
            function taxCalculations(jobInfo){
                return ($scope.taxableIncome -
                    ($scope.taxableIncome * (jobInfo.fed_tax_rate / 100)) -
                    ($scope.taxableIncome * (jobInfo.loc_tax_rate / 100)) -
                    (jobInfo.posttax_static) +
                    getPayPeriodDeduction(jobInfo)).toFixed(2); //Add this back in since its only a deduction, not actually removed
            }
    
            $scope.formFill = function(){
                $scope.annualGross = getAnnualGross($scope.jobInfo);
                $scope.payPeriodGross = getPayPeriodGross($scope.jobInfo);
                $scope.taxableIncome = getTaxableIncome($scope.jobInfo);
                $scope.afterTax = taxCalculations($scope.jobInfo);
            };
        }
    }]);