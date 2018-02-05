angular.module('app.utils').service('CandidateService', [
  '$q',
  'Candidate',
  function($q, Candidate) {
    return {

    /**
     * Αν΄άκτηση όλων των Υποφηφίων.
     *
     * @return {Object} Resource object με τον πίνακα Υποψηφ΄΄ιων
     */
      getAll() {
        return Candidate.getAll().$promise;
      },
      
      /**
       * Αν΄άκτηση όλων των Υποφηφίων δοθείσας Εκλογικής Διαδικασίας.
       *
       * @return {Object} Resource object με τον πίνακα Υποψηφ΄΄ιων
       */
      getByCurrentElectionProcedure() {
        return Candidate.getByCurrentElectionProcedure().$promise;
      },

    };
  }
]);
