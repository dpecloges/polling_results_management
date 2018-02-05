angular.module('app.utils').factory('Verification', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope) {
    return $resource(null, null, {
      verify: {
        url: $rootScope.verificationVerifyUrl,
        method: 'POST'
      },
      saveVoter: {
        url: $rootScope.verificationSaveVoterUrl,
        method: 'POST'
      },
      undoVote: {
        url: $rootScope.verificationUndoVoteUrl,
        method: 'POST'
      },
      getVoterCount: {
        url: $rootScope.voterCountUrl,
        method: 'GET',
      },
    });
  }
]);
