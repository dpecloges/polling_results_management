angular.module('app.mg.electioncenter').controller('ElectionCenterListController', [
  '$rootScope',
  '$scope',
  '$translate',
  '$stateParams',
  'ViewJqGridService',
  'SuccessErrorService',
  'authService',
  function($rootScope, $scope, $translate, $stateParams, ViewJqGridService, SuccessErrorService, authService) {

    $scope.viewUrl = 'mg/electioncenter/view/';

    $scope.hasPermission = function(permission) {
      return authService.hasPermission(permission);
    };

    // Παρακολούθηση για σφάλματα στο $rootScope.errorList.
    $rootScope.$watch('errorList', function() {
      SuccessErrorService.onRootScopeError($scope, $rootScope.errorList);
    }, true);

    /*
     * Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
     */
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }

    $scope.args = {};
    
    $scope.gridData = {
      caption: $translate.instant('global.grid.caption'),
      url: $rootScope.electionCenterIndexUrl,
      excelUrl: $rootScope.electionCenterExcelUrl,
      shrinkToFit: false,
      colNames: [
          'id',
          $translate.instant('global.grid.actions'),
          $translate.instant('mg.electioncenter.list.grid.code'),
          $translate.instant('mg.electioncenter.list.grid.municipalityName'),
          $translate.instant('mg.electioncenter.list.grid.address'),
          $translate.instant('mg.electioncenter.list.grid.name'),
          $translate.instant('mg.electioncenter.list.grid.supervisorFullName'),
          $translate.instant('mg.electioncenter.list.grid.supervisorEmail'),
          $translate.instant('mg.electioncenter.list.grid.supervisorCellphone'),
          $translate.instant('mg.electioncenter.list.grid.supervisorAddress'),
          $translate.instant('mg.electioncenter.list.grid.supervisorPostalCode'),
          $translate.instant('mg.electioncenter.list.grid.regionName'),
          $translate.instant('mg.electioncenter.list.grid.regionalUnitName'),
          $translate.instant('mg.electioncenter.list.grid.municipalUnitName'),
          $translate.instant('mg.electioncenter.list.grid.postalCode'),
          $translate.instant('mg.electioncenter.list.grid.telephone'),
          $translate.instant('mg.electioncenter.list.grid.foreign'),
          $translate.instant('mg.electioncenter.list.grid.foreignCountryName'),
          $translate.instant('mg.electioncenter.list.grid.foreignCity'),
          $translate.instant('mg.electioncenter.list.grid.estimatedBallotBoxes'),
          $translate.instant('mg.electioncenter.list.grid.ballotBoxes')
      ],
      colModel: [
          { name: 'id', hidden: true },
          { name: 'extraActions', sortable: false, fixed: true, align: 'center', width: 70 },
          { name: 'code', index: 'code', sortable: true, editable: false, align: 'center', width: 80 },
          { name: 'municipalityName', index: 'municipality.name', sortable: true, editable: false, width: 200 },
          { name: 'address', index: 'address', sortable: true, editable: false, width: 200 },
          { name: 'name', index: 'name', sortable: true, editable: false, width: 200 },
          { name: 'supervisorFullName', sortable: false, editable: false, width: 220 },
          { name: 'supervisorEmail', sortable: false, editable: false, width: 220 },
          { name: 'supervisorCellphone', sortable: false, editable: false, width: 150, align: 'center' },
          { name: 'supervisorAddress', sortable: false, editable: false, width: 220 },
          { name: 'supervisorPostalCode', sortable: false, editable: false, width: 100, align: 'center' },
          { name: 'regionName', index: 'region.name', sortable: true, editable: false, width: 200 },
          { name: 'regionalUnitName', index: 'regionalUnit.name', sortable: true, editable: false, width: 200 },
          { name: 'municipalUnitName', index: 'municipalUnit.name', sortable: true, editable: false, width: 200 },
          { name: 'postalCode', index: 'postalCode', sortable: true, editable: false, align: 'center', width: 100 },
          { name: 'telephone', index: 'telephone', sortable: true, editable: false, width: 130 },
          { name: 'foreign', index: 'foreign', sortable: true, editable: false, align: 'center', width: 70 },
          { name: 'foreignCountryName', index: 'foreignCountry.name', sortable: true, editable: false, width: 100 },
          { name: 'foreignCity', index: 'foreignCity', sortable: true, editable: false, width: 100 },
          { name: 'estimatedBallotBoxes', index: 'estimatedBallotBoxes', sortable: true, editable: false, align: 'center', width: 100 },
          { name: 'ballotBoxes', index: 'ballotBoxes', sortable: true, editable: false, align: 'center', width: 70 }
      ],
      sortname: 'code',
      sortorder: 'asc'
    };

    $scope.retrieveGridData = function() {
      if (!$scope.hasPermission('mg.electioncenter')) {
        return;
      }
      $scope.startIndexLoading();
      ViewJqGridService.retrieveData($('#electionCenterListGrid'), $scope.args);
    };

    /**
     * Έναρξη ένδειξης spinner στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.startIndexLoading = function() {
      $scope.indexLoading = true;
    };

    /**
     * Λήξη ένδειξης spinner στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.stopIndexLoading = function() {
      $scope.indexLoading = false;
    };

    /**
     * Εμφάνιση σφάλματος στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.errorIndexLoading = function() {
      $scope.indexLoading = false;
    };
    
    $scope.setClear = adminUnitFn => {
      $scope.clearAdminUnit = adminUnitFn;
    };

    $scope.clearArguments = () => {
      Object.getOwnPropertyNames($scope.args).forEach(val => {
        $scope.args[val] = null;
      });
      
      $scope.clearAdminUnit();
    };

  }
]);
