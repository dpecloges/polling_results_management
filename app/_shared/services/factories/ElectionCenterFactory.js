angular.module('app.utils').factory('ElectionCenter', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope) {
    return $resource(null, null, {
      getAll: {
        url: $rootScope.electionCenterFindAllUrl,
        method: 'GET',
        isArray: true,
      },
      get: {
        url: $rootScope.electionCenterFindUrl,
        method: 'GET'
      },
      save: {
        url: $rootScope.electionCenterSaveUrl,
        method: 'POST'
      },
      'delete': {
        url: $rootScope.electionCenterDeleteUrl,
        method: 'POST'
      },
      getBasic: {
        url: $rootScope.electionCenterFindBasicUrl,
        method: 'GET'
      }
    });
  }
]);
