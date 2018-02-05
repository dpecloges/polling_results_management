angular.module('app.utils').service('CountryService', [
  '$q',
  'Country',
  function($q, CountryService) {
    return {

      getAll() {
        return CountryService.getAll().$promise;
      },

    };
  }
]);
