angular.module('app.us.volunteer').service('ManualUserCreationDialog', [
  '$rootScope', 
  '$modal', 
  '$ngBootbox',
  '$translate',
  'SuccessErrorService',
  'UsVolunteerService',
  function($rootScope, $modal, $ngBootbox, $translate, SuccessErrorService, UsVolunteerService) {
    
    var open = (volunteer) => {
      
      var modalInstance = $modal.open({
        templateUrl: 'app/us/volunteer/manualusercreation/manualusercreation-dialog.tpl.html',
        controller: function($scope, $modalInstance, volunteer, authService) {
  
          $scope.hasPermission = function(permission) {
            return authService.hasPermission(permission);
          };
          
          $scope.volunteer = volunteer;
          
          $scope.args = {
              electionDepartmentId: volunteer.electionDepartmentId,
              username: volunteer.email,
              lastName: volunteer.lastName,
              firstName: volunteer.firstName,
              type: 'USER'
          };
          
          var isAcceptedPasswordStrength = function() {
            return true;
          };
          
          var isValidFormData = function() {
            return (
                $scope.args.electionDepartmentId != null &&
                !!$scope.args.username &&
                !!$scope.args.password &&
                !!$scope.args.passwordConfirmation &&
                ($scope.args.password === $scope.args.passwordConfirmation) &&
                isAcceptedPasswordStrength()
            );
          };
          
          var getFormData = function() {
            return {
              volunteerId: volunteer.id,
              password: $scope.args.password,
              passwordConfirmation: $scope.args.passwordConfirmation,
            };
          };
          
          /**
           * Επιβεβαίωση στο modal
           */
          $scope.confirm = function() {
  
            if (!$scope.hasPermission('sa.user')) {
              return;
            }
            
            if (!isValidFormData()) {
              $ngBootbox.alert($translate.instant('us.volunteer.assignment.errors.invalidForm'));
              return;
            }
            
            var newUser = getFormData();
            
            UsVolunteerService.manuallyCreateUser(newUser).then(function(result) {
              
              $modalInstance.close(newUser);
              
            }).catch(function(result) {
              // Μήνυμα σφάλματος
              var errorMsg = "";
              if(result.data.errors) {
                var errorMsgs = result.data.errors.map(e => e.errorMessage);
                errorMsg = errorMsgs.join('<br/>');
                $ngBootbox.alert(errorMsg);
              }
              else {
                  $log.error('Υπάρχει bug στον κώδικα ή πρόβλημα στα δεδομένα.');
              }
            });
          };
          
          /**
           * Ακύρωση στο modal
           */
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          
        }, // controller
        resolve: {
          volunteer: () => volunteer
        }
      
      }); // modalInstance
      
      return modalInstance;
      
    };
    
    return { open };
    
  }]);
