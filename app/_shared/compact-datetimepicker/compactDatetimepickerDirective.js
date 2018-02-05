'use strict';

angular.module('app.utils').directive('compactDatetimepicker', function() {
    
    return {
        restrict: 'E',
        templateUrl: 'app/_shared/compact-datetimepicker/compact-datetimepicker.tpl.html',
        replace: true,
        controller: 'CompactDatetimepickerController',
        scope: {
            model: '=',
            name: '@',
            disabled: '=ngDisabled',
            changeable: '&?',
            type: '=',
            suggestFireDate: '&?'
        },
        link: function(scope, elem, attrs) {
            scope.setDateTimeValueIfEmpty = function() {
                if(!scope.model) {
                    elem.find('[datetime-picker="dd/MM/yyyy HH:mm"]').val('00/00/0000 00:00');
                }
            }
        }
    };
    
});