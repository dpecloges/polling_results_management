angular.module('app.utils').service('ElectionProcedureService', [
  '$q', 'ElectionProcedure',
  function ($q, ElectionProcedure) {
    
    //Ανάκτηση τρέχουσας εκλογικής διαδικασίας
    function getCurrent(id) {
      return ElectionProcedure.current({}, null);
    }
    
    return {
      getCurrent
    };
  }
]);
