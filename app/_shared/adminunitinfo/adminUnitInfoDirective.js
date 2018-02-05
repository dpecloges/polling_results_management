(function() {

  'use strict';

  angular.module('app.utils')
    .directive('adminUnitInfo', ['LocationService', function(LocationService) {
      return {
        restrict: 'E',
        templateUrl: 'app/_shared/adminunitinfo/adminunitinfo.tpl.html',
        replace: false,
        controller: 'AdminUnitInfoController',
        scope: {
          municipalityId: '=',
          municipalUnitId: '=',
          municipalUnitExists: '=',
          municipalCommunityId: '=',
          disabled: '=ngDisabled',
          name: '@',
          required: '&?',
          changeable: '&?',
          fromNull: '&?',
          actrequired: '&?',
          api: '='
        }
      };
    }]);

})();
