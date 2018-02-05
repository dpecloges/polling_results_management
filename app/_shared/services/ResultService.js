angular.module('app.utils').service('ResultService', [
  '$q', 'Result',
  function($q, Result) {
    return {
      
      /**
       * Ανάκτηση αποτελεσμάτων Εκλογικού Τμήματος.
       *
       * @param  {Number} id [description]
       * @return {Object} promise με Εκλογικό Τμήμα (αποτελέσματα)
       */
      get(id) {
        return id ? Result.get({ id }, null).$promise : {};
      },
      
      /**
       * Αποθήκευση αποτελεσμάτων Εκλ. Τμήματος.
       *
       * @param {Object} electionDepartment αποτελέσματα Εκλ. Τμήματος
       * @return {Object} promise με αποθηκευμένα αποτελέσματα Εκλ. Τμήματος
       */
      save(electionDepartment) {
        return Result.save({}, electionDepartment).$promise;
      },
      
      searchResults(args = {}) {
        return Result.searchResults({}, args).$promise;
      },
  
      scheduleJob(scheduleJob) {
        return Result.scheduleJob({}, scheduleJob);
      },
  
      unscheduleJob() {
        return Result.unscheduleJob({}, null);
      },
  
      getJobStatus() {
        return Result.getJobStatus({}, null).$promise;
      }
      
    };
  }
]);
