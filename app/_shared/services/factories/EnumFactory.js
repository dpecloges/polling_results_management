(function() {

  'use strict';
  
  angular.module('app.utils').factory('Enum', [
    '$resource',
    '$rootScope',
    function($resource, $rootScope) {
      return $resource(null, null, {
        getValues: {
          url: $rootScope.enumValuesUrl,
          method: 'GET',
          isArray: true,
          cache: true
        },
        get: {
          url: $rootScope.enumsUrl,
          method: 'GET',
          isArray: true,
          cache: true
        }
      });
    }
  ]);

})();
