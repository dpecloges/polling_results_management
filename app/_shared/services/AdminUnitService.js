angular.module('app.utils').service('AdminUnitService', [
  '$q',
  'AdminUnit',
  function($q, AdminUnit) {
    return {

      getAll() {
        return AdminUnit.getAll().$promise;
      },

    };
  }
]);
