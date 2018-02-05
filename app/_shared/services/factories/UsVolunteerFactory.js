angular.module('app.utils').factory('UsVolunteer', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope) {
    return $resource(null, null, {
      assignVolunteer: {
        url: $rootScope.usVolunteerAssignUrl,
        method: 'POST'
      },
      unassignVolunteer: {
        url: $rootScope.usVolunteerUnassignUrl,
        method: 'POST'
      },
      reassignVolunteer: {
        url: $rootScope.usVolunteerReassignUrl,
        method: 'POST'
      },
      notifyVolunteer: {
        url: $rootScope.usVolunteerNotifyUrl,
        method: 'POST'
      },
      notifyAllVolunteers: {
        url: $rootScope.usVolunteerNotifyAllUrl,
        method: 'POST'
      },
      manuallyCreateUser: {
        url: $rootScope.usVolunteerManuallyCreateUserUrl,
        method: 'POST'
      }
    });
  }
]);
