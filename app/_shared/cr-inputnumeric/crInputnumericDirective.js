angular.module('app.utils').directive('crInputnumeric', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/_shared/cr-inputnumeric/cr-inputnumeric.tpl.html',
    controller: 'CrInputnumericController',
    scope: {
      value: '=',
      maxDigits: '@',
      disabled: '=ngDisabled',
      onChange: '&',
    }
  };
});
