angular.module('app.sa.scheduledjob').controller('ScheduledJobViewController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$state',
  '$window',
  '$ngBootbox',
  '$translate',
  'SuccessErrorService',
  'authService',
  'ResultService',
  'SnapshotService',
  'jobStatus',
  function ($scope, $rootScope, $stateParams, $state, $window, $ngBootbox, $translate, SuccessErrorService, authService, ResultService, SnapshotService, jobStatus) {
    
    //View state
    $scope.viewState = 'app.sa.scheduledjob.view';
    
    $rootScope.$watch('errorList', function() {
      SuccessErrorService.onRootScopeError($scope, $rootScope.errorList);
    }, true);
    
    $scope.hasPermission = function (permission) {
      return authService.hasPermission(permission);
    };
    
    $scope.jobStatus = jobStatus;
    $scope.jobGroup = $stateParams.jobGroup;
    
    $scope.scheduleJob = function () {

      if (!$scope.hasPermission('sys.admin')) {
        return;
      }

      if ($stateParams.jobGroup === 'calculate_results') {
  
        //Εκκίνηση spinner
        $scope.saveLoading = true;
  
        //Αρχικοποίηση success-error
        SuccessErrorService.initialize($scope);
  
        ResultService.scheduleJob($scope.jobStatus).$promise
            .then(function (result) {
  
              $scope.jobStatus = result;
  
              SuccessErrorService.showSuccess($scope, $translate.instant('sa.scheduledjob.view.action.schedule.success'));
            })
            .catch(function (result) {
              //Μήνυμα σφάλματος
              SuccessErrorService.apiValidationErrors($scope, result.data);
            })
            .finally(function (result) {
              //Σταμάτημα spinner
              $scope.saveLoading = false;
            });
      }
      else if ($stateParams.jobGroup === 'calculate_snapshots') {
  
        //Εκκίνηση spinner
        $scope.saveLoading = true;
  
        //Αρχικοποίηση success-error
        SuccessErrorService.initialize($scope);
  
        SnapshotService.scheduleJob($scope.jobStatus).$promise
            .then(function (result) {
        
              $scope.jobStatus = result;
        
              SuccessErrorService.showSuccess($scope, $translate.instant('sa.scheduledjob.view.action.schedule.success'));
            })
            .catch(function (result) {
              //Μήνυμα σφάλματος
              SuccessErrorService.apiValidationErrors($scope, result.data);
            })
            .finally(function (result) {
              //Σταμάτημα spinner
              $scope.saveLoading = false;
            });
      }
    };
  
    $scope.unscheduleJob = function () {
    
      if (!$scope.hasPermission('sys.admin')) {
        return;
      }
  
      if ($stateParams.jobGroup === 'calculate_results') {
  
        $ngBootbox.customDialog({
          message: $translate.instant('sa.scheduledjob.view.action.unschedule.confirmation'),
          buttons: {
            confirm: {
              label: $translate.instant('global.confirm'),
              className: 'btn-success',
              callback: function () {
          
                //Εκκίνηση spinner
                $scope.saveLoading = true;
          
                //Αρχικοποίηση success-error
                SuccessErrorService.initialize($scope);
          
                ResultService.unscheduleJob().$promise
                    .then(function (result) {
  
                      $scope.jobStatus = result;
  
                      SuccessErrorService.showSuccess($scope, $translate.instant('sa.scheduledjob.view.action.unschedule.success'));
                    })
                    .catch(function (result) {
                      //Μήνυμα σφάλματος
                      SuccessErrorService.apiValidationErrors($scope, result.data);
                    })
                    .finally(function (result) {
                      //Σταμάτημα spinner
                      $scope.saveLoading = false;
                    });
          
              }
            },
            cancel: {
              label: $translate.instant('global.cancel'),
              className: 'btn-danger',
              callback: function () {
              }
            }
          }
    
        })
      }
      else if ($stateParams.jobGroup === 'calculate_snapshots') {
  
        $ngBootbox.customDialog({
          message: $translate.instant('sa.scheduledjob.view.action.unschedule.confirmation'),
          buttons: {
            confirm: {
              label: $translate.instant('global.confirm'),
              className: 'btn-success',
              callback: function () {
          
                //Εκκίνηση spinner
                $scope.saveLoading = true;
          
                //Αρχικοποίηση success-error
                SuccessErrorService.initialize($scope);
          
                SnapshotService.unscheduleJob().$promise
                    .then(function (result) {
                
                      $scope.jobStatus = result;
                
                      SuccessErrorService.showSuccess($scope, $translate.instant('sa.scheduledjob.view.action.unschedule.success'));
                    })
                    .catch(function (result) {
                      //Μήνυμα σφάλματος
                      SuccessErrorService.apiValidationErrors($scope, result.data);
                    })
                    .finally(function (result) {
                      //Σταμάτημα spinner
                      $scope.saveLoading = false;
                    });
          
              }
            },
            cancel: {
              label: $translate.instant('global.cancel'),
              className: 'btn-danger',
              callback: function () {
              }
            }
          }
    
        })
      }
      
    };
    
  }
]);
