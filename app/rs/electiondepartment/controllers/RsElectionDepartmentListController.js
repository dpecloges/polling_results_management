angular.module('app.rs.electiondepartment').controller('RsElectionDepartmentListController', [
  '$rootScope',
  '$scope',
  '$translate',
  '$stateParams',
  'ViewJqGridService',
  'SuccessErrorService',
  'authService',
  function ($rootScope, $scope, $translate, $stateParams, ViewJqGridService, SuccessErrorService, authService) {
    
    $scope.hasPermission = function (permission) {
      return authService.hasPermission(permission);
    };
    
    // Παρακολούθηση για σφάλματα στο $rootScope.errorList.
    $rootScope.$watch('errorList', function () {
      SuccessErrorService.onRootScopeError($scope, $rootScope.errorList);
    }, true);
    
    $scope.args = {};
  
    let newLineFormatter = function (cellvalue, options, rowObject) {
      return !cellvalue ? '' : cellvalue.replace(/<br\s*[\/]?>/gi,'<br />');
    };
    
    $scope.gridData = {
      caption: $translate.instant('global.grid.caption'),
      url: $rootScope.electionDepartmentResultsIndexUrl,
      excelUrl: $rootScope.electionDepartmentResultsExcelUrl,
      shrinkToFit: false,
      colNames: [
        'id',
        $translate.instant('mg.electiondepartment.list.grid.electionCenterCode'),
        $translate.instant('mg.electiondepartment.list.grid.code'),
        $translate.instant('mg.electiondepartment.list.grid.name'),
        $translate.instant('mg.electiondepartment.list.grid.regionalUnit'),
        $translate.instant('mg.electiondepartment.list.grid.municipality'),
        $translate.instant('mg.electiondepartment.list.grid.committeeLeader'),
        $translate.instant('mg.electiondepartment.list.grid.idVerifier'),
        $translate.instant('mg.electiondepartment.list.grid.submitted'),
        $translate.instant('mg.electiondepartment.list.grid.voterCount'),
        $translate.instant('mg.electiondepartment.list.grid.undoneVoterCount'),
        $translate.instant('mg.electiondepartment.list.grid.electionCenterName'),
        $translate.instant('mg.electiondepartment.list.grid.geographicalUnit'),
        $translate.instant('mg.electiondepartment.list.grid.decentralAdmin'),
        $translate.instant('mg.electiondepartment.list.grid.region'),
        $translate.instant('mg.electiondepartment.list.grid.municipalUnit'),
        $translate.instant('mg.electiondepartment.list.grid.foreign'),
        $translate.instant('mg.electiondepartment.list.grid.foreignCountry'),
        $translate.instant('mg.electiondepartment.list.grid.foreignCity')
      ],
      colModel: [
        {name: 'id', hidden: true},
        {name: 'electionCenterCode', index: 'electionCenter.code', sortable: true, editable: false, align: 'center', width: 80},
        {name: 'code', index: 'code', sortable: true, editable: false, align: 'center', width: 80},
        {name: 'name', index: 'name', sortable: true, editable: false, align: 'center', width: 100},
        {name: 'regionalUnit', index: 'electionCenter.regionalUnit.name', sortable: true, editable: false, width: 200},
        {name: 'municipality', index: 'electionCenter.municipality.name', sortable: true, editable: false, width: 200},
        {name: 'committeeLeader', index: 'committeeLeader', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'idVerifier', index: 'idVerifier', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'submitted', sortable: false, editable: false, align: 'center', width: 100},
        {name: 'voterCount', sortable: false, editable: false, align: 'center', width: 100},
        {name: 'undoneVoterCount', sortable: false, editable: false, align: 'center', width: 100},
        {name: 'electionCenterName', index: 'electionCenter.name', sortable: true, editable: false, width: 200},
        {name: 'geographicalUnit', index: 'electionCenter.geographicalUnit.name', sortable: true, editable: false, width: 120},
        {name: 'decentralAdmin', index: 'electionCenter.decentralAdmin.name', sortable: true, editable: false, width: 200},
        {name: 'region', index: 'electionCenter.region.name', sortable: true, editable: false, width: 200},
        {name: 'municipalUnit', index: 'electionCenter.municipalUnit.name', sortable: true, editable: false, width: 200},
        {name: 'foreign', index: 'electionCenter.foreign', sortable: true, editable: false, align: 'center', width: 70},
        {name: 'foreignCountry', index: 'electionCenter.foreignCountry.name', sortable: true, editable: false, width: 100},
        {name: 'foreignCity', index: 'electionCenter.foreignCity', sortable: true, editable: false, width: 100}
      ],
      sortname: 'name',
      sortorder: 'desc'
    };
    
    
    $scope.retrieveGridData = function () {
      
      if (!$scope.hasPermission('rs.result')) {
        return;
      }
      
      if($scope.args.votersExist === '') {
        $scope.args.votersExist = null;
      }
      
      if($scope.args.submitted === '') {
        $scope.args.submitted = null;
      }
      
      $scope.startIndexLoading();
      ViewJqGridService.retrieveData($('#electionDepartmentListGrid'), $scope.args);
    };
    
    /**
     * Έναρξη ένδειξης spinner στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.startIndexLoading = function () {
      $scope.indexLoading = true;
    };
    
    /**
     * Λήξη ένδειξης spinner στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.stopIndexLoading = function () {
      $scope.indexLoading = false;
    };
    
    /**
     * Εμφάνιση σφάλματος στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.errorIndexLoading = function () {
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
