angular.module('app.utils')
    .factory('Role', ['$resource', '$rootScope', function ($resource, $rootScope) {
      return $resource(null, null, {
        getAll: {
          url: $rootScope.roleFindAllUrl,
          method: 'GET',
          cache: true,
          isArray: true
        }
      });
    }]);
