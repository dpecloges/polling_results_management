angular.module('app.us.volunteer').service('NotifyAllVolunteersDialog', [
  '$rootScope', 
  '$modal', 
  '$ngBootbox',
  '$translate',
  'SuccessErrorService',
  'ContributionType',
  'UsVolunteerService',
  function(
      $rootScope, $modal, $ngBootbox, $translate, SuccessErrorService,
      ContributionType, UsVolunteerService) {
    
    var open = () => {
      
      var modalInstance = $modal.open({
        templateUrl: 'app/us/volunteer/notifyall/notifyall-dialog.tpl.html',
        controller: function($scope, $modalInstance, ContributionType, authService) {
  
          $scope.hasPermission = function(permission) {
            return authService.hasPermission(permission);
          };
          
          $scope.args = {
              pending: false,
              notified: false
          };
          

          /**
           * Επιβεβαίωση στο modal
           */
          $scope.confirm = function() {
            if (!$scope.hasPermission('sa.email')) {
              return;
            }
            $modalInstance.close($scope.args);
          };
          
          /**
           * Ακύρωση στο modal
           */
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          
        },
        resolve: {
          ContributionType: ContributionType
        }
      });
      
      modalInstance.rendered.then(function() {
        
      });
      
      return modalInstance;
      
    };
    
    return { open };
    
  }]);
