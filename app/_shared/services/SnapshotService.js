angular.module('app.utils').service('SnapshotService', [
  '$q', 'Snapshot',
  function($q, Snapshot) {
    return {
      
      searchSnapshots(args = {}) {
        return Snapshot.searchSnapshots({}, args).$promise;
      },
  
      findAllSnapshots(args = {}) {
        return Snapshot.findAllSnapshots({}, args).$promise;
      },
  
      scheduleJob(scheduleJob) {
        return Snapshot.scheduleJob({}, scheduleJob);
      },
  
      unscheduleJob() {
        return Snapshot.unscheduleJob({}, null);
      },
  
      getJobStatus() {
        return Snapshot.getJobStatus({}, null).$promise;
      }
      
    };
  }
]);
