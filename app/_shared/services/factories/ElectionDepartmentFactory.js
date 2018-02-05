angular.module('app.utils').factory('ElectionDepartment', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope) {
    return $resource(null, null, {
      getAll: {
        url: $rootScope.electionDepartmentFindAllUrl,
        method: 'GET',
        isArray: true,
      },
      get: {
        url: $rootScope.electionDepartmentFindUrl,
        method: 'GET'
      },
      save: {
        url: $rootScope.electionDepartmentSaveUrl,
        method: 'POST'
      },
      'delete': {
        url: $rootScope.electionDepartmentDeleteUrl,
        method: 'POST'
      },
      generateSerialNoAndCode: {
        url: $rootScope.electionDepartmentGenerateSerialNoAndCodeUrl,
        method: 'GET'
      },
      getByVolunteer: {
        url: $rootScope.electionDepartmentByVolunteerUrl,
        method: 'GET',
        params: { electionDepartmentId: '@electionDepartmentId' },
        isArray: true,
      },
      notifyPendingContribution: {
          url: $rootScope.notifyPendingContributionUrl,
          method: 'POST',
          params: { electionDepartmentId: '@electionDepartmentId', contributionId: '@contributionId' }
      },
      notifyPendingContributionsByElectionDepartment: {
        url: $rootScope.notifyPendingContributionsByElectionDepartmentUrl,
        method: 'POST',
        params: { electionDepartmentId: '@electionDepartmentId' }
      },
      renotifyPendingContribution: {
          url: $rootScope.renotifyPendingContributionUrl,
          method: 'POST',
          params: { electionDepartmentId: '@electionDepartmentId', contributionId: '@contributionId' }
      },
      renotifyPendingContributionsByElectionDepartment: {
        url: $rootScope.renotifyPendingContributionsByElectionDepartmentUrl,
        method: 'POST',
        params: { electionDepartmentId: '@electionDepartmentId' }
      }
    });
  }
]);
