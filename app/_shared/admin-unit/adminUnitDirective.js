angular.module('app.utils')
  .directive('adminUnit', ['AdminUnitService', function(AdminUnitService) {
    return {
      restrict: 'E',
      templateUrl: 'app/_shared/admin-unit/adminunit.tpl.html',
      replace: false,
      controller: 'AdminUnitController',
      scope: {
        geographicalUnitId: '=',
        decentralAdminId: '=',
        regionId: '=',
        regionalUnitId: '=',
        municipalityId: '=',
        municipalUnitId: '=',
        municipalCommunityId: '=',
        foreign: '=',
        foreignCountryIsoCode: '=',
        foreignCity: '=',
        hideGeographicalUnit: '=',
        hideDecentralAdmin: '=',
        hideRegion: '=',
        hideRegionalUnit: '=',
        hideMunicipality: '=',
        hideMunicipalUnit: '=',
        hideForeignOption: '=',
        hideForeignCity: '=',
        disabled: '=ngDisabled',
        name: '@',
        required: '&?',
        setClear: '&',
        onChange: '&',
        setInitLists: '&',
        getDataValues: '&',
        horizontalLayout: '=',
      }
    };
  }]);
