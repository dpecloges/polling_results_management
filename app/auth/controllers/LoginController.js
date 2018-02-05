angular.module('app.auth').controller('LoginController', [
  '$scope', '$state', '$stateParams', '$window', '$timeout', 'authService',
  function ($scope, $state, $stateParams, $window, $timeout, authService) {
    
    $scope.viewUrl = 'login/';
    
    $scope.data = {
      grant_type: "password",
      username: "",
      password: ""
    };
    
    $scope.login = function () {
      authService.loginToken($scope, $scope.data);
    };
    
    if ($stateParams.reloadWindow) {
      $timeout(function() {
        $window.location.reload();
      });
    }
    
    let checkForValidToken = function () {
      if (authService.tokenIsValid()) {
        $state.go('app.index', {notify: true});
      }
    }
    
    checkForValidToken();
  }
]);
