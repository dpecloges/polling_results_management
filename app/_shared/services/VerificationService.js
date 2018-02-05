angular.module('app.utils').service('VerificationService', [
  '$q', 'Verification',
  function($q, Verification) {

    //Αναζήτηση στη διαπίστευση
    function verify(args) {
      return Verification.verify({}, args);
    }

    //Αποθήκευση ψηφίσαντα
    function saveVoter(voter) {
      return Verification.saveVoter({}, voter);
    }

    //Αναίρεση διαπίστευσης
    function undoVote(voterId, undoReason) {
      return Verification.undoVote({voterId: voterId, undoReason: undoReason}, null);
    }

    /**
     * Ανάκτηση αριθμού διαπιστευμένων.
     */
    function getVoterCount(electionDepartmentId) {
      return Verification.getVoterCount({ electionDepartmentId }).$promise;
    }

    return {
      verify,
      saveVoter,
      undoVote,
      getVoterCount,
    };
  }
]);
