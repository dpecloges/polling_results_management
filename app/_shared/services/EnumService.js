(function() {

  'use strict';

  angular.module('app.utils').service('EnumService', ['Enum',
    function(Enum) {

      /**
       * Επιστρέφει τις τιμές του δοθεντος enum.
       *
       * @param  {String} enumClass
       * @return {Array} Promise με τον πίνακα με τις τιμές των enums.
       */
      function getValues(enumClass) {
        return Enum.getValues({ enumClass }, null);
      }

      /**
       * Επιστρέφει τιμές για πολλαπλά δοθέντα enumerations.
       *
       * @param  {Array} enumClass Τα δοθέντα enumClasses.
       * @return {Array} Promise με τον πίνακα με τα αντίστοιχες τιμές των enums.
       */
      function get(...enums) {
        return Enum.get({ enums: enums.join() }, null);
      }

      return { getValues, get };
    }
  ]);

})();
