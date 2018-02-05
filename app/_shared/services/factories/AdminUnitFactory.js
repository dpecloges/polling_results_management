angular.module('app.utils')
  .factory('AdminUnit', ['$resource', '$rootScope', function($resource, $rootScope) {
    return $resource(null, null, {
      getAll: {
        url: $rootScope.adminUnitFindAllUrl,
        method: 'GET',
        cache: true,
        isArray: true,
      }
    });
  }]);
