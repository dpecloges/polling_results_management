angular.module('app.utils').directive('addressInfo', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/_shared/addressinfo/addressinfo.tpl.html',
    replace: false,
    scope: {
      address: '=',
      addressNo: '=',
      addressTk: '=',
      telephone: '=',
      disabled: '=ngDisabled',
      name: '@',
      required: '&?',
      changeable: '&?',
      fromNull: '&?',
      isMigrated: '=',
      limits: '&',
    },
    link(scope, elem, attrs) {
      if (attrs.telephone) {
        scope.hasTelephone = true;
      }
    }
  };
});
