angular.module('app.utils').service('RoleService', [
  '$q',
  'Role',
  function ($q, Role) {
    return {
      
      getAll() {
        return Role.getAll().$promise;
      },
      
    };
  }
]);
