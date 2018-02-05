angular.module('app.rs')
  .controller('CandidateResultsController', [
    '$scope',
    '$ngBootbox',
    '$translate',
    'CandidateService',
    'StringNumbers',
    function($scope, $ngBootbox, $translate, CandidateService, StringNumbers) {
      
      $scope.candidates = [];
    
      // Ανάκτηση Υποψηφίων Εκλογικής Διαδικασίας
      CandidateService.getByCurrentElectionProcedure()
        .then(candidates => {
          $scope.candidates = candidates;
        });
        
      /**
       * Διαμόρφωση model των πεδίων.
       *
       * @param {Number} order Αρίθμηση υποψηφίου
       * @return {[type]} Στοιχείο του model για το πεδίο
       */
      $scope.candidateVotesModel = ({ order }) => `candidate${StringNumbers[order]}Votes`;
      
      /**
       * Format ονόματος.
       *
       * @param {String} lastName Επίθετο
       * @param {String} firstName Όνομα
       * @param {String} fatherName Πατρώνυμο
       * @return {String} Φορμαρισμένο όνομα
       */
      $scope.formatName = ({ lastName, firstName, fatherName }) =>
        `${lastName} ${firstName} ${fatherName ? ` (${fatherName})` : ''}`;
        
      /**
       * Μετατροπή string σε lowercase με το πρώτο γράμμα κεφαλαίο.
       * π.χ.
       * hello -> Hello, HELLO -> Hello, hELLO -> Hello
       */
      function toFirstCapitalLetter(word = '') {
        return word.charAt().toUpperCase() + word.slice(1).toLowerCase();
      }
      
    }
  ]);
