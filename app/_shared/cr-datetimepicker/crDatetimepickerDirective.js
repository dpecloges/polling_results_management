(function() {

  'use strict';

  angular.module('app.utils')
    //global configuration for datepicker within the app.utils module
    .config(function(datepickerConfig, datepickerPopupConfig) {

      datepickerPopupConfig.showButtonBar = true;

      datepickerPopupConfig.toggleWeeksText = true;
      datepickerPopupConfig.closeOnDateSelection = true;

      datepickerPopupConfig.currentText = 'Σήμερα';
      datepickerPopupConfig.clearText = 'Καθαρισμός';
      datepickerPopupConfig.closeText = 'Κλείσιμο';

      datepickerConfig.showWeeks = false;
    })
    .directive('crDatetimepicker', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
        templateUrl: 'app/_shared/cr-datetimepicker/cr-datetimepicker.tpl.html',
        replace: true,
        controller: 'crDatetimepickerCtrl',
        scope: {
          model: '=',
          labelInfo: '@',
          mindate: '=',
          maxdate: '=',
          disabled: '=ngDisabled',
          name: '@',
          settoday: '=',
          actrequired: '=',
          api: '='
        },

        link(scope, element, attrs, ctrl) {
          scope.formats = ['dd/MM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          scope.dateFormat = scope.formats[0];

          scope.options = {
            'year-format': '"yyyy"',
            'starting-day': 0,
            format: 'dd/MM/yyyy'
          };

          $('.clockpicker').clockpicker();

        }

      };
    }]);

})();
