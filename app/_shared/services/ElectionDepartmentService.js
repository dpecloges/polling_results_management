angular.module('app.utils').service('ElectionDepartmentService', [
  '$q', 'ElectionDepartment',
  function($q, ElectionDepartment) {
    return {
      
      /**
       * Ανάκτηση όλων των Εκλογικών Τμημάτων.
       */
      getAll() {
        return ElectionDepartment.getAll().$promise;
      },
      
      /**
       * Ανάκτηση Εκλογικών Τμημάτων από Εκλ. Κέντρο.
       *
       * @param {Number} id id Εκλ. Κέντρου
       * @return {Object} promise με τα Εκλ. Τμήματα
       */
      getByElectionCenter(id) {
        return id ? ElectionDepartment.getByElectionCenter({ id }, null).$promise : [];
      },

      /**
       * Ανάκτηση εκλογικού τμήματος
       */
      getElectionDepartment(id) {
        return ElectionDepartment.get({ id }, null);
      },

      /**
       * Αποθήκευση εκλογικού τμήματος
       */
      saveElectionDepartment(electionDepartment) {
        return ElectionDepartment.save({}, electionDepartment);
      },

      /**
       * Διαγραφή εκλογικού τμήματος
       */
      deleteElectionDepartment(id) {
        return ElectionDepartment.delete({ id }, null);
      },

      /**
       * Παραγωγή αύξοντα αριθμού και κωδικού εκλογικού τμήματος
       */
      generateSerialNoAndCode(electionCenterId) {
        return ElectionDepartment.generateSerialNoAndCode({ electionCenterId }, null);
      },
      
      getByVolunteer(id, round, electionDepartmentId = null) {
        return ElectionDepartment.getByVolunteer({ id, round, electionDepartmentId }, null).$promise;
      },
      
      notifyPendingContribution(electionDepartmentId, contributionId) {
        return ElectionDepartment.notifyPendingContribution({ electionDepartmentId, contributionId }, null).$promise;
      },
      
      notifyPendingContributionsByElectionDepartment(electionDepartmentId) {
    	  return ElectionDepartment.notifyPendingContributionsByElectionDepartment({ electionDepartmentId }, null).$promise;
    	},
      
      renotifyPendingContribution(electionDepartmentId, contributionId) {
        return ElectionDepartment.renotifyPendingContribution({ electionDepartmentId, contributionId }, null).$promise;
      },
      
      renotifyPendingContributionsByElectionDepartment(electionDepartmentId) {
        return ElectionDepartment.renotifyPendingContributionsByElectionDepartment({ electionDepartmentId }, null).$promise;
      }

    };
  }
]);
