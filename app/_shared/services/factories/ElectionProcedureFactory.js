angular.module('app.utils').factory('ElectionProcedure', [
  '$resource',
  '$rootScope',
  function ($resource, $rootScope) {
    
    return $resource(null, null,
        {
          'current': {
            url: $rootScope.electionProcedureCurrentUrl,
            method: "GET"
          }
        }
    );
  }
]);