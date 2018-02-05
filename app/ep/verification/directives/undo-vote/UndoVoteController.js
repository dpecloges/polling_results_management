angular.module('app.ep.verification').controller('UndoVoteController', [
  '$scope',
  '$rootScope',
  '$modal',
  function ($scope, $rootScope, $modal) {
    
    $scope.openModal = function () {
      
      let modalInstance = $modal.open({
        animation: true,
        windowClass: 'modal-fixed-width-md',
        templateUrl: 'undoVoteModal.tpl.html',
        controller($scope, $modalInstance) {
          
          //Επιβεβαίωση στο modal
          $scope.confirm = function () {
            $modalInstance.close($scope.undoReason);
          };
          
          //Ακύρωση στο modal
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
          
        },
        resolve: {}
      });
      
      modalInstance.result.then(function (undoReason) {
        $scope.undoVoteExecution({undoReason: undoReason});
      });
      
    };
    
  }
]);
