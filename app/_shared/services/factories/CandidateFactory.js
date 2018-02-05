angular.module('app.utils')
  .factory('Candidate', ['$resource', '$rootScope', function($resource, $rootScope) {
    return $resource(null, null, {
      getAll: {
        url: $rootScope.candidateFindAllUrl,
        method: 'GET',
        cache: true,
        isArray: true,
      },
      getByCurrentElectionProcedure: {
        url: $rootScope.candidateFindByElectionProcedureUrl,
        method: 'GET',
        isArray: true,
      },
    });
  }]);
