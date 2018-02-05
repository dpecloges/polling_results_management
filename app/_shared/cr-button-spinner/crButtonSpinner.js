(function () {
    angular.module('app.utils').directive('crButtonSpinner', ["$compile", function ($compile) {
        "use strict";

        return {
            restrict: 'A',
            scope: {
                spinning: '=crButtonSpinner',
                spinningIcon: '@?',
                buttonPrepend: '@?',
                buttonAppend: '@?'
            },
            template:
            "<span ng-if=\"!!buttonPrepend\" ng-hide=\"spinning\"><i class=\"{{ buttonPrepend }}\"></i></span>" +
            "<span ng-if=\"!!buttonPrepend\" ng-show=\"spinning\"><i class=\"{{ !!spinningIcon ? spinningIcon : 'fa fa-spinner fa-spin' }}\"></i></span>" +
            "<span ng-if=\"!!buttonAppend\" ng-hide=\"spinning\"><i class=\"{{ buttonAppend }}\"></i></span>" +
            "<span ng-if=\"!buttonPrepend\" ng-show=\"spinning\"><i class=\"{{ !!spinningIcon ? spinningIcon : 'fa fa-spinner fa-spin' }}\"></i></span>"
        }
    }]);
} ());