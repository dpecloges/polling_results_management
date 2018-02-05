angular.module('app.utils').service('ElectionCenterService', [
  '$q', 'ElectionCenter',
  function ($q, ElectionCenter) {
    
    function getAll() {
      return ElectionCenter.getAll().$promise;
    }
    
    //Ανάκτηση εκλογικού κέντρου
    function getElectionCenter(id) {
      return ElectionCenter.get({id: id}, null);
    }
    
    //Αποθήκευση εκλογικού κέντρου
    function saveElectionCenter(electionCenter) {
      return ElectionCenter.save({}, electionCenter);
    }
    
    //Διαγραφή εκλογικού κέντρου
    function deleteElectionCenter(id) {
      return ElectionCenter.delete({id: id}, null);
    }
    
    //Ανάκτηση βασικών στοιχείων εκλογικού κέντρου
    function getElectionCenterBasic(id) {
      return ElectionCenter.getBasic({id: id}, null);
    }
    
    return {
      getAll,
      getElectionCenter,
      saveElectionCenter,
      deleteElectionCenter,
      getElectionCenterBasic
    };
  }
]);
