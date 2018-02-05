angular.module('app.us.user').controller('UserViewController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$state',
  '$translate',
  '$timeout',
  '$window',
  '$ngBootbox',
  'UserService',
  'SuccessErrorService',
  'ViewJqGridService',
  'authService',
  'user',
  'electionDepartments',
  'roles',
  function ($scope, $rootScope, $stateParams, $state, $translate, $timeout, $window, $ngBootbox,
            UserService, SuccessErrorService, ViewJqGridService, authService, user, electionDepartments, roles) {
    
    //View state
    $scope.viewState = 'app.us.user.view';
    
    $scope.hasPermission = function (permission) {
      return authService.hasPermission(permission);
    };
    
    //Αντικείμενο εγγραφής
    $scope.user = user;
    
    //Εκλογικά τμήματα
    $scope.electionDepartments = electionDepartments;
    
    //Ρόλοι
    $scope.roles = roles;
    
    /*
     * Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
     */
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }
    
    /*
     * Αποθήκευση
     */
    $scope.saveUser = function (opts) {
      
      if (!$scope.hasPermission('sa.user')) {
        return;
      }
      
      //Αρχικοποίηση success-error
      SuccessErrorService.initialize($scope);
      
      //Front-end user validation
      
      if(!$scope.user.username) {
        SuccessErrorService.showError($scope, $translate.instant('us.user.view.error.emptyUsername'));
        return;
      }
      if(!$scope.user.id || $scope.user.willChangePassword) {
        if(!$scope.user.password) {
          SuccessErrorService.showError($scope, $translate.instant('us.user.view.error.emptyPassword'));
          return;
        }
        else if($scope.user.password !== $scope.user.passwordRepeat) {
          SuccessErrorService.showError($scope, $translate.instant('us.user.view.error.passwordsNotMatch'));
          return;
        }
      }
      if(!$scope.user.lastName) {
        SuccessErrorService.showError($scope, $translate.instant('us.user.view.error.emptyLastName'));
        return;
      }
      if(!$scope.user.firstName) {
        SuccessErrorService.showError($scope, $translate.instant('us.user.view.error.emptyFirstName'));
        return;
      }
      if(!$scope.user.roleId) {
        SuccessErrorService.showError($scope, $translate.instant('us.user.view.error.noRole'));
        return;
      }
      
      //Εκκίνηση spinner
      $scope.saveLoading = true;
      
      //Αποθήκευση
      UserService.saveUser($scope.user).$promise
          .then(function (result) {
            //Ορισμός αποθηκευμένου αντικειμένου
            $scope.user = result;
            
            //Μετάβαση στο state με το νέο id
            $state.go($scope.viewState, {id: $scope.user.id}, {notify: false});
            
            //Μήνυμα επιτυχίας
            SuccessErrorService.showSuccess($scope);
            
            //Ορισμός κατάστασης φόρμας σε μη dirty
            $scope.userForm.$dirty = false;
          })
          .catch(function (result) {
            //Μήνυμα σφάλματος
            SuccessErrorService.apiValidationErrors($scope, result.data);
          })
          .finally(function (result) {
            //Σταμάτημα spinner
            $scope.saveLoading = false;
          });
    };
    
    //Διαγραφή
    $scope.deleteUser = function () {
      
      if (!$scope.hasPermission('sa.user')) {
        return;
      }
      
      //Bootbox επιβεβαίωσης
      $ngBootbox.customDialog({
        message: $translate.instant('us.user.view.delete.confirmation'),
        buttons: {
          confirm: {
            label: $translate.instant('global.confirm'),
            className: 'btn-success',
            callback: function () {
              
              //Εκκίνηση spinner
              $scope.deleteLoading = true;
              
              //Διαγραφή
              UserService.deleteUser($scope.user.id).$promise
                  .then(function (result) {
                    //Μήνυμα επιτυχίας
                    var successMessage = $translate.instant('us.user.view.delete.success');
                    
                    //Μετάβαση στο ευρετήριο
                    $state.go('app.us.user.list', {successMessage: successMessage}, {
                      reload: false,
                      notify: true
                    });
                  })
                  .catch(function (result) {
                    //Μήνυμα σφάλματος
                    SuccessErrorService.apiValidationErrors($scope, result.data);
                  })
                  .finally(function (result) {
                    //Σταμάτημα spinner
                    $scope.deleteLoading = false;
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
        
      });
      
    };
    
  }
]);
