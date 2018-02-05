angular.module('app.utils')
  .factory('Country', ['$resource', '$rootScope', function($resource, $rootScope) {
    return $resource(null, null, {
      getAll: {
        url: $rootScope.countryFindAllUrl,
        method: 'GET',
        cache: true,
        isArray: true,
      }
    });
  }]);
