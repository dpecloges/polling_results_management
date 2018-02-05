(function() {

    'use strict';

    angular.module('app.utils')
        .directive('locationInfo', function() {
            return {
                restrict: 'E',
                templateUrl: 'app/_shared/locationinfo/locationinfo.tpl.html',
                replace: false,
                controller: 'LocationInfoController',
                scope: {
                    countryId: '=',
                    foreignCity: '=',
                    municipalityId: '=',
                    placeDescr: '=',
                    municipalUnitId: '=',
                    municipalUnitExists: '=',
                    municipalCommunityId: '=',
                    disabled: '=ngDisabled',
                    name: '@',
                    required: '&?',
                    changeable: '&?',
                    fromNull: '&?',
                    actrequired: '&?',
                    isGreeceSelected: '=',
                    cityText: '=',
                    noPlaceDescr: '=',
                    adminUnitApi: '=',
                    cityApi: '='
                }
            };

        });

})();
