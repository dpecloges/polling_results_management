angular.module('app.rs')
  .directive('candidateResultsChart', ['CandidateService', function(CandidateService) {
    return {
      restrict: 'E',
      templateUrl: 'app/rs/directives/candidate-results-chart/candidate-results-chart.tpl.html',
      replace: false,
      controller: 'CandidateResultsChartController',
      scope: {
        electionProcedureId: '=',
        model: '=',
        disabled: '=ngDisabled',
        valuesFontSize: '=',
        valuesFontStyle: '@',
        valuesFontFamily: '@',
      }
    };
  }]);
