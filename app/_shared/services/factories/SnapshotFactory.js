angular.module('app.utils').factory('Snapshot', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope) {
    return $resource(null, null, {
      searchSnapshots: {
        url: $rootScope.searchSnapshotsUrl,
        method: 'POST',
      },
      findAllSnapshots: {
        url: $rootScope.findAllSnapshotsUrl,
        method: 'POST',
        isArray: true
      },
      scheduleJob: {
        url: $rootScope.scheduleSnapshotsUrl,
        method: 'POST'
      },
      unscheduleJob: {
        url: $rootScope.unscheduleSnapshotsUrl,
        method: 'GET'
      },
      getJobStatus: {
        url: $rootScope.snapshotsJobStatusUrl,
        method: 'GET'
      }
    });
  }
]);
