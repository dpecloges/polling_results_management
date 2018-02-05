angular.module('app.utils').factory('Registration', [
  '$resource',
  '$rootScope',
  function ($resource, $rootScope) {
    
    return $resource(null, null,
        {
          'findRegistration': {
            url: $rootScope.registrationFindUrl,
            method: "GET"
          },
          'register': {
            url: $rootScope.registrationRegisterUrl,
            method: "POST"
          },
        }
    );
  }
]);