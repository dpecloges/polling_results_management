angular.module('app.ep.verification').directive('undoVote', function () {
  return {
    restrict: 'E',
    templateUrl: 'app/ep/verification/directives/undo-vote/undo-vote.tpl.html',
    replace: true,
    controller: 'UndoVoteController',
    scope: {
      undoVoteExecution: '&',
      disabled: '=ngDisabled',
      undoLoading: '='
    }
  };
});