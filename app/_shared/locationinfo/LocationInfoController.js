(function() {

  'use strict';

  angular.module('app.utils')
    .controller('LocationInfoController', [
      '$scope',
      '$rootScope',
      '$ngBootbox',
      '$translate',
      'LocationService',
      function($scope, $rootScope, $ngBootbox, $translate, LocationService) {

        // Ανάκτηση των χωρών.
        $scope.countries = LocationService.getCountries($scope.countryId);

        /**
         * Έλεγχος αν η επιλεγμένη χώρα είναι η Ελλάδα.
         * Η μεταβλητή isGreeceSelected χρησιμοποιείται στην περίπτωση που θέλουμε
         * να έχουμε πρόσβαση στο αν είναι επιλεγμένη η Ελλάδα έξω από το directive.
         */
        $scope.countryIsGreece = function(){
            $scope.isGreeceSelected = $scope.countryId == $rootScope.greeceId;
            return $scope.isGreeceSelected;
        }

        /**
         * Αλλαγή επιλεγμένης Χώρας.
         * Αν επιλεχθεί χώρα διαφορετική της Ελλάδας,
         * τα στοιχεία της καθαρίζουν.
         */
        $scope.countryChanged = () => {

            //Μηδενίζουμε ό,τι έχει να κάνει με την πόλη και τραβάμε τις πόλεις που αντιστοιχούν στη χώρα
            $scope.cityApi.clearCity();
            $scope.cityApi.filterCities($scope.countryId);

            // Η αποεπιλογή του Νομού καθαρίζει όλα τα κατώτερης βαθμίδας στοιχεία.
            $scope.adminUnitApi.changedPrefecture(null);
        };

      }
    ]);

})();
