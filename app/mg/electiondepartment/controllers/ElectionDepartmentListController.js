angular.module('app.mg.electiondepartment').controller('ElectionDepartmentListController', [
  '$rootScope',
  '$scope',
  '$translate',
  '$stateParams',
  'ViewJqGridService',
  'SuccessErrorService',
  'authService',
  'candidates',
  function ($rootScope, $scope, $translate, $stateParams, ViewJqGridService, SuccessErrorService, authService, candidates) {
    
    $scope.viewUrl = 'mg/electiondepartment/view/';
    
    $scope.hasPermission = function (permission) {
      return authService.hasPermission(permission);
    };
    
    //Υποψήφιοι
    $scope.candidates = candidates;
    
    // Παρακολούθηση για σφάλματα στο $rootScope.errorList.
    $rootScope.$watch('errorList', function () {
      SuccessErrorService.onRootScopeError($scope, $rootScope.errorList);
    }, true);
    
    /**
     * Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
     */
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }
    
    $scope.args = {};
  
    let newLineFormatter = function (cellvalue, options, rowObject) {
      return !cellvalue ? '' : cellvalue.replace(/<br\s*[\/]?>/gi,'<br />');
    };
    
    for(let i=0; i<candidates.length; i++) {
      switch(candidates[i].order) {
        case 1:
          $scope.candidateOneFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        case 2:
          $scope.candidateTwoFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        case 3:
          $scope.candidateThreeFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        case 4:
          $scope.candidateFourFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        case 5:
          $scope.candidateFiveFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        case 6:
          $scope.candidateSixFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        case 7:
          $scope.candidateSevenFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        case 8:
          $scope.candidateEightFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        case 9:
          $scope.candidateNineFullName = candidates[i].lastName + ' ' + candidates[i].firstName;
          break;
        default:
          break;
      }
    }
    
    $scope.gridData = {
      caption: $translate.instant('global.grid.caption'),
      url: $rootScope.electionDepartmentFullIndexUrl,
      excelUrl: $rootScope.electionDepartmentExcelUrl,
      shrinkToFit: false,
      colNames: [
        'id',
        $translate.instant('global.grid.actions'),
        $translate.instant('mg.electiondepartment.list.grid.electionCenterCode'),
        $translate.instant('mg.electiondepartment.list.grid.code'),
        $translate.instant('mg.electiondepartment.list.grid.name'),
        $translate.instant('mg.electiondepartment.list.grid.regionalUnit'),
        $translate.instant('mg.electiondepartment.list.grid.municipality'),
        $translate.instant('mg.electiondepartment.list.grid.electionCenterName'),
        $translate.instant('mg.electiondepartment.list.grid.geographicalUnit'),
        $translate.instant('mg.electiondepartment.list.grid.decentralAdmin'),
        $translate.instant('mg.electiondepartment.list.grid.region'),
        $translate.instant('mg.electiondepartment.list.grid.municipalUnit'),
        $translate.instant('mg.electiondepartment.list.grid.address'),
        $translate.instant('mg.electiondepartment.list.grid.postalCode'),
        $translate.instant('mg.electiondepartment.list.grid.telephone'),
        $translate.instant('mg.electiondepartment.list.grid.foreign'),
        $translate.instant('mg.electiondepartment.list.grid.foreignCountry'),
        $translate.instant('mg.electiondepartment.list.grid.foreignCity'),
        $translate.instant('mg.electiondepartment.list.grid.electionCenterComments'),
        $translate.instant('mg.electiondepartment.list.grid.floorNumber'),
        $translate.instant('mg.electiondepartment.list.grid.disabledAccess'),
        $translate.instant('mg.electiondepartment.list.grid.estimatedBallotBoxes'),
        $translate.instant('mg.electiondepartment.list.grid.ballotBoxes'),
        $translate.instant('mg.electiondepartment.list.grid.voters2007'),
        $translate.instant('mg.electiondepartment.list.grid.comments'),
        $translate.instant('mg.electiondepartment.list.grid.accessDifficulty'),
        $translate.instant('mg.electiondepartment.list.grid.committeeLeader'),
        $translate.instant('mg.electiondepartment.list.grid.committeeLeaderVice'),
        $translate.instant('mg.electiondepartment.list.grid.committeeMember'),
        $translate.instant('mg.electiondepartment.list.grid.idVerifier'),
        $translate.instant('mg.electiondepartment.list.grid.idVerifierVice'),
        $translate.instant('mg.electiondepartment.list.grid.treasurer'),
        $translate.instant('mg.electiondepartment.list.grid.candidateOneRep', {repFullName: $scope.candidateOneFullName}),
        $translate.instant('mg.electiondepartment.list.grid.candidateTwoRep', {repFullName: $scope.candidateTwoFullName}),
        $translate.instant('mg.electiondepartment.list.grid.candidateThreeRep', {repFullName: $scope.candidateThreeFullName}),
        $translate.instant('mg.electiondepartment.list.grid.candidateFourRep', {repFullName: $scope.candidateFourFullName}),
        $translate.instant('mg.electiondepartment.list.grid.candidateFiveRep', {repFullName: $scope.candidateFiveFullName}),
        $translate.instant('mg.electiondepartment.list.grid.candidateSixRep', {repFullName: $scope.candidateSixFullName}),
        $translate.instant('mg.electiondepartment.list.grid.candidateSevenRep', {repFullName: $scope.candidateSevenFullName}),
        $translate.instant('mg.electiondepartment.list.grid.candidateEightRep', {repFullName: $scope.candidateEightFullName}),
        $translate.instant('mg.electiondepartment.list.grid.candidateNineRep', {repFullName: $scope.candidateNineFullName}),
      ],
      colModel: [
        {name: 'id', hidden: true},
        {name: 'extraActions', sortable: false, fixed: true, align: 'center', width: 70},
        {name: 'electionCenterCode', index: 'electionCenter.code', sortable: true, editable: false, align: 'center', width: 80},
        {name: 'code', index: 'code', sortable: true, editable: false, align: 'center', width: 80},
        {name: 'name', index: 'name', sortable: true, editable: false, align: 'center', width: 100},
        {name: 'regionalUnit', index: 'electionCenter.regionalUnit.name', sortable: true, editable: false, width: 200},
        {name: 'municipality', index: 'electionCenter.municipality.name', sortable: true, editable: false, width: 200},
        {name: 'electionCenterName', index: 'electionCenter.name', sortable: true, editable: false, width: 200},
        {name: 'geographicalUnit', index: 'electionCenter.geographicalUnit.name', sortable: true, editable: false, width: 120},
        {name: 'decentralAdmin', index: 'electionCenter.decentralAdmin.name', sortable: true, editable: false, width: 200},
        {name: 'region', index: 'electionCenter.region.name', sortable: true, editable: false, width: 200},
        {name: 'municipalUnit', index: 'electionCenter.municipalUnit.name', sortable: true, editable: false, width: 200},
        {name: 'address', index: 'electionCenter.address', sortable: true, editable: false, width: 200},
        {name: 'postalCode', index: 'electionCenter.postalCode', sortable: true, editable: false, align: 'center', width: 70},
        {name: 'telephone', index: 'electionCenter.telephone', sortable: true, editable: false, width: 130},
        {name: 'foreign', index: 'electionCenter.foreign', sortable: true, editable: false, align: 'center', width: 70},
        {name: 'foreignCountry', index: 'electionCenter.foreignCountry.name', sortable: true, editable: false, width: 100},
        {name: 'foreignCity', index: 'electionCenter.foreignCity', sortable: true, editable: false, width: 100},
        {name: 'electionCenterComments', index: 'electionCenter.comments', sortable: true, editable: false, width: 300},
        {name: 'floorNumber', index: 'electionCenter.floorNumber', sortable: true, editable: false, align: 'center', width: 50},
        {name: 'disabledAccess', index: 'electionCenter.disabledAccess', sortable: true, editable: false, align: 'center', width: 80},
        {name: 'estimatedBallotBoxes', index: 'electionCenter.estimatedBallotBoxes', sortable: true, editable: false, align: 'center', width: 100},
        {name: 'ballotBoxes', index: 'electionCenter.ballotBoxes', sortable: true, editable: false, align: 'center', width: 70},
        {name: 'voters2007', index: 'electionCenter.voters2007', sortable: true, editable: false, align: 'center', width: 100},
        {name: 'comments', index: 'comments', sortable: true, editable: false, width: 300},
        {name: 'accessDifficulty', index: 'accessDifficulty', sortable: true, editable: false, align: 'center', width: 80},
        {name: 'committeeLeader', index: 'committeeLeader', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'committeeLeaderVice', index: 'committeeLeaderVice', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'committeeMember', index: 'committeeMember', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'idVerifier', index: 'idVerifier', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'idVerifierVice', index: 'idVerifierVice', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'treasurer', index: 'treasurer', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'candidateOneRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'candidateTwoRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter},
        {name: 'candidateThreeRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter, hidden: authService.getElectionProcedureRound() !== 'FIRST'},
        {name: 'candidateFourRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter, hidden: authService.getElectionProcedureRound() !== 'FIRST'},
        {name: 'candidateFiveRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter, hidden: authService.getElectionProcedureRound() !== 'FIRST'},
        {name: 'candidateSixRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter, hidden: authService.getElectionProcedureRound() !== 'FIRST'},
        {name: 'candidateSevenRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter, hidden: authService.getElectionProcedureRound() !== 'FIRST'},
        {name: 'candidateEightRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter, hidden: authService.getElectionProcedureRound() !== 'FIRST'},
        {name: 'candidateNineRep', sortable: false, editable: false, width: 220, formatter: newLineFormatter, hidden: authService.getElectionProcedureRound() !== 'FIRST'}
      ],
      sortname: 'name',
      sortorder: 'desc'
    };
    
    
    $scope.retrieveGridData = function () {
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
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
