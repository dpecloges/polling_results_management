angular.module('app.utils').service('RegistrationService', [
  '$q', 'Registration',
  function ($q, Registration) {
    return {
      
      findRegistration(identifier) {
        return identifier ? Registration.findRegistration({identifier: identifier}, null).$promise : {};
      },
      
      register(data) {
        return Registration.register({}, data);
      }
      
    };
  }
]);
