angular.module('app.utils').factory('Result', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope) {
    return $resource(null, null, {
      get: {
        url: $rootScope.resultsFindUrl,
        method: 'GET'
      },
      save: {
        url: $rootScope.resultsSaveUrl,
        method: 'POST',
      },
      searchResults: {
        url: $rootScope.searchResultsUrl,
        method: 'POST',
      },
      scheduleJob: {
        url: $rootScope.scheduleResultsUrl,
        method: 'POST'
      },
      unscheduleJob: {
        url: $rootScope.unscheduleResultsUrl,
        method: 'GET'
      },
      getJobStatus: {
        url: $rootScope.resultsJobStatusUrl,
        method: 'GET'
      }
    });
  }
]);
