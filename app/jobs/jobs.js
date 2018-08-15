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
        $location.path('/jobs')
        window.location.reload();
       }

       function getjobs() {

        $http.get('/jobs/' + user_id).then(function (response){
            if (response.status !== 200){
                console.log(response);
                window.alert('Error Retrieving  Jobs');
            } else { $scope.records =  response.data; }
        });
      }
    
      function deletejob(id) {
        const t = '/api/deletejob/' + id;
        console.log(t);
        return this.http.get(t);
      }

      function updatesinglejob(event) {
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
              }).then(function(response){
                  if (response.status !== 204){
                      console.log(response);
                      window.alert('Error Updating Job');
                  } else {
                      window.alert('Job Updated Successfully');
                  }
          })
      }
 
}]);