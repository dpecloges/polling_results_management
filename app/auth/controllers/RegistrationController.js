angular.module('app.auth').controller('RegistrationController', [
  '$scope', '$state', '$stateParams', '$translate', 'RegistrationService', 'SuccessErrorService', 'registerUser',
  function ($scope, $state, $stateParams, $translate, RegistrationService, SuccessErrorService, registerUser) {
    
    $scope.viewUrl = 'register/';
    
    $scope.registerUser = registerUser;
    $scope.registerUser.success = false;
    
    $scope.data = {
      identifier: $stateParams.id,
      username: registerUser.username,
      password: '',
      passwordRepeat: ''
    }
    
    $scope.register = function () {
      
      if (!$scope.data.password || !$scope.data.passwordRepeat) {
        SuccessErrorService.showError($scope, $translate.instant('global.register.action.error.empty.password'));
        return;
      }
  
      if ($scope.data.password !== $scope.data.passwordRepeat) {
        SuccessErrorService.showError($scope, $translate.instant('global.register.action.error.passwords.not.match'));
        return;
      }
      
      RegistrationService.register($scope.data).$promise
          .then(function (result) {
            $scope.registerUser.success = true;
            SuccessErrorService.showSuccess($scope, $translate.instant('global.register.action.success'));
          })
          .catch(function (result) {
            //Μήνυμα σφάλματος
            SuccessErrorService.apiValidationErrors($scope, result.data);
          });
    };
  
    $scope.login = function () {
      $state.go('app.auth.login', {reloadWindow: true}, {notify: true, reload: true});
    }
    
    if ($scope.registerUser.errorCode) {
      SuccessErrorService.addError($scope, $scope.registerUser.errorMessage);
    }
    
  }
]);
