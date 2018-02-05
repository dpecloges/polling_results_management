angular.module('app.utils').service('UsVolunteerService', [
  '$q',
  'UsVolunteer',
  function($q, UsVolunteer) {
    return {
      assignVolunteer(volunteerAssignmentRequest) {
        return UsVolunteer.assignVolunteer({}, volunteerAssignmentRequest).$promise;
      },
      unassignVolunteer(volunteerId) {
        return UsVolunteer.unassignVolunteer({volunteerId: volunteerId}, null).$promise;
      },
      reassignVolunteer(volunteerReassignmentRequest) {
        return UsVolunteer.reassignVolunteer({}, volunteerReassignmentRequest).$promise;
      },
      notifyVolunteer(volunteerId) {
        return UsVolunteer.notifyVolunteer({volunteerId: volunteerId}, null).$promise;
      },
      notifyAllVolunteers(pending, notified) {
        return UsVolunteer.notifyAllVolunteers({pending: pending, notified: notified}, null).$promise;
      },
      manuallyCreateUser(newUser) {
        return UsVolunteer.manuallyCreateUser({}, newUser).$promise;
      }
    }
  }
]);
