angular.module('app.rs')
  .directive('candidateResults', ['CandidateService', function(CandidateService) {
    return {
      restrict: 'E',
      templateUrl: 'app/rs/directives/candidate-results/candidate-results.tpl.html',
      replace: false,
      controller: 'CandidateResultsController',
      scope: {
        electionProcedureId: '=',
        model: '=',
        disabled: '=ngDisabled',
        maxDigits: '@',
      }
    };
  }]);
