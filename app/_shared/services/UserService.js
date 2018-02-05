angular.module('app.utils').service('UserService', [
  '$q', 'User',
  function ($q, User) {
    
    //Ανάκτηση χρήστη
    function getUser(id) {
      return User.get({id: id}, null);
    }
    
    //Αποθήκευση χρήστη
    function saveUser(user) {
      return User.save({}, user);
    }
    
    //Διαγραφή χρήστη
    function deleteUser(id) {
      return User.delete({id: id}, null);
    }
    
    return {
      getUser,
      saveUser,
      deleteUser
    };
  }
]);
