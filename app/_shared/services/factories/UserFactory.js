angular.module('app.utils').factory('User', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope) {
    return $resource(null, null, {
      get: {
        url: $rootScope.userFindUrl,
        method: 'GET'
      },
      save: {
        url: $rootScope.userSaveUrl,
        method: 'POST'
      },
      delete: {
        url: $rootScope.userDeleteUrl,
        method: 'POST'
      }
    });
  }
]);
