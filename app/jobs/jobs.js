'use strict';

angular.module('myApp.jobs', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/jobs', {
    templateUrl: 'jobs/jobs.html',
    controller: 'JobsCtrl'
  });
}])

.controller('JobsCtrl', ['$http', '$scope', '$rootScope', '$location', function($http, $scope, $rootScope, $location) {
     if(!$rootScope.globals.currentUser){$location.path('/login')}
     let user_id = $rootScope.globals.currentUser.user_id;
     $scope.filingTypes = [
         "Single",
         "Married Filing Jointly",
         "Married Filing Separately",
         "Head of Household",
         "Qualifying Widower"
     ];
     $scope.frequencyTypes = [
         "Hourly",
         "Weekly",
         "Monthly",
         "Bi-Weekly",
         "Bi-Monthly",
         "Annually"
     ];

     $scope.update_jobID = 0;
     $scope.update_jobTitle = "";
     $scope.update_filing = "";
     $scope.update_frequency = "";
     $scope.update_payRate = 0;
     $scope.update_allowances = 0;
     $scope.update_fedTaxes = 0;
     $scope.update_localTaxes = 0;
     $scope.update_retirement = 0;
     $scope.update_postTax = 0;
     $scope.update_preTax = 0;

     $.ready(
      getjobs()
     );

     $scope.deleten =  function(id) {
      console.log(id);
      if (window.confirm('Do you realy want to delete this job ?')) {

        $http.delete('/jobs/' + id, null)
              .then(function successful(response){
                  window.alert('Job Deleted');
                  loadjobagain();
                }, function failure(response){
                   window.alert('Error While Deleting the job');
                   loadjobagain();
    
              });
      }
    };

     $scope.getUpdateInfo = function(id){
         $http.get('/jobs/job/' + id, null).then(function(res){
             if (res.status !== 200){ console.log("Error getting results for update job"); }
             else {
                 console.log(res);
                 let response = res.data[0];
                 $scope.update_jobID = response.job_id;
                 $scope.update_jobTitle = response.title;
                 $scope.update_filing = response.filing_status;
                 $scope.update_frequency = response.frequency;
                 $scope.update_payRate = response.wage;
                 $scope.update_allowances = response.allowances;
                 $scope.update_fedTaxes = response.fed_tax_rate;
                 $scope.update_localTaxes = response.loc_tax_rate;
                 $scope.update_retirement = response.retirement;
                 $scope.update_postTax = response.posttax;
                 $scope.update_preTax = response.pretax;
             }
         })
     };

     $scope.upjob = function(event){

      event.preventDefault();
      const target = event.target;
      const title = target.querySelector('#up-job-title').value ;
          const payrate = target.querySelector('#up-pay-rate').value ;
          const frequnecy = target.querySelector('#up-pay-frequency').value ;
          const filling = target.querySelector('#up-pay-filling').value ;
          const allowences = target.querySelector('#up-pay-allowences').value ;
          const retirement = target.querySelector('#up-pay-retirement').value ;
          const pretax = target.querySelector('#up-pay-pretax').value ;
          const posttax = target.querySelector('#up-pay-posttax').value ;
          const fedtax = target.querySelector('#up-pay-fed-tax-rate').value ;
          const loctax = target.querySelector('#up-pay-loc-tax-rate').value ;
          const id = target.querySelector('#up-job-id').value ;
          $http.post('/updatejobs', 
                    {
                    "user_id":$rootScope.globals.currentUser.user_id, title,
                    "wage":payrate,
                    "frequency":frequnecy,
                    "filing":filling,
                    "allowances":allowences,
                    "retirement":retirement,
                    "pretax":pretax,
                    "posttax":posttax,
                    "fed_tax_rate":fedtax,
                    "loc_tax_rate":loctax,
                    "job_id":id,
                    }
          ).then(function successful(response){
            /* If successful */
            /* Create global variable for currentUser */
            console.log(response);
            window.alert('Job Updated');
            loadjobagain();

        }, function failure(response){
            /* If not successful */
            /*server returns error, display message */

            console.log(response);
            window.alert('Error While Updating the job');
            loadjobagain();
      
        });
     };
      
      $scope.addjobs = function(event){
          event.preventDefault();
          const target = event.target;
          const title = target.querySelector('#add-job-title').value ;
          const payrate = target.querySelector('#add-pay-rate').value ;
          const frequnecy = target.querySelector('#add-pay-frequency').value ;
          const filling = target.querySelector('#add-pay-filling').value ;
          const allowences = target.querySelector('#add-pay-allowences').value ;
          const retirement = target.querySelector('#add-pay-retirement').value ;
          const pretax = target.querySelector('#add-pay-pretax').value ;
          const posttax = target.querySelector('#add-pay-posttax').value ;
          const fedtax = target.querySelector('#add-pay-fed-tax-rate').value ;
          const loctax = target.querySelector('#add-pay-loc-tax-rate').value ;
          $http.post('/jobs', 
                            {"user_id":$rootScope.globals.currentUser.user_id, title,
                             "wage":payrate,
                             "frequency":frequnecy,
                             "filing":filling,
                             "allowances":allowences,
                             "retirement":retirement,
                             "pretax":pretax,
                             "posttax":posttax,
                             "fed_tax_rate":fedtax,
                             "loc_tax_rate":loctax
                            } 
                    )
          .then(function successful(response){
              /* If successful */
              /* Create global variable for currentUser */
              console.log(response);
              window.alert('New Job created');
              loadjobagain();

          }, function failure(response){
              /* If not successful */
              /*server returns error, display message */

              console.log(response);
              window.alert('Error While adding New Job');
              loadjobagain();
        
          });
        };
      
      function loadjobagain() {
        $location.path('/jobs');
        window.location.reload();
       }

        function getjobs() {
            $http.get('/jobs/user/' + user_id).then(function (response){
                if (response.status !== 200){
                    console.log(response);
                    window.alert('Error Retrieving  Jobs');
                } else { $scope.records =  response.data; }
            });
        }

      $scope.updatesinglejob = function(event) {
          event.preventDefault();
          let title = $('#up-job-title').val();
          let payrate = $('#up-pay-rate').val() ;
          let frequnecy = $scope.update_frequency ;
          let filling = $scope.update_filing;
          let allowences = $('#up-pay-allowences').val() ;
          let retirement = $('#up-pay-retirement').val() ;
          let pretax = $('#up-pay-pretax').val() ;
          let posttax = $('#up-pay-posttax').val() ;
          let fedtax = $('#up-pay-fed-tax-rate').val() ;
          let loctax = $('#up-pay-loc-tax-rate').val() ;
          let id = $('#up-job-id').val() ;
          $http.patch('/jobs',
              {
                  "user_id": user_id,
                  "title" : title,
                  "wage":payrate,
                  "frequency":frequnecy,
                  "filing":filling,
                  "allowances":allowences,
                  "retirement":retirement,
                  "pretax":pretax,
                  "posttax":posttax,
                  "fed_tax_rate":fedtax,
                  "loc_tax_rate":loctax,
                  "job_id":id
              }).then(function successful(response){
                      /* If successful */
                      /* Create global variable for currentUser */
                      console.log(response);
                      window.alert('Job Updated');
                      loadjobagain();

                  }, function failure(response){
                      /* If not successful */
                      /*server returns error, display message */

                      console.log(response);
                      window.alert('Error While adding New Job');
                      loadjobagain();

              });
      }
 
}]);