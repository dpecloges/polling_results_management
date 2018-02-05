angular.module('app.us.user').controller('UserListController', [
  '$rootScope',
  '$scope',
  '$translate',
  '$stateParams',
  'ViewJqGridService',
  'SuccessErrorService',
  'authService',
  'electionCenters',
  'electionDepartments',
  function ($rootScope, $scope, $translate, $stateParams, ViewJqGridService, SuccessErrorService, authService, electionCenters, electionDepartments) {
    
    $scope.viewUrl = 'us/user/view/';
    
    //Εκλογικά κέντρα
    $scope.electionCenters = electionCenters;
    
    //Εκλογικά τμήματα
    $scope.electionDepartments = electionDepartments;
    
    $scope.hasPermission = function (permission) {
      return authService.hasPermission(permission);
    };
    
    // Παρακολούθηση για σφάλματα στο $rootScope.errorList.
    $rootScope.$watch('errorList', function () {
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
      url: $rootScope.userIndexUrl,
      shrinkToFit: true,
      colNames: [
        'id',
        $translate.instant('global.grid.actions'),
        $translate.instant('us.user.list.grid.username'),
        $translate.instant('us.user.list.grid.lastName'),
        $translate.instant('us.user.list.grid.firstName'),
        $translate.instant('us.user.list.grid.email'),
        $translate.instant('us.user.list.grid.electionCenterCode'),
        $translate.instant('us.user.list.grid.electionCenterName'),
        $translate.instant('us.user.list.grid.electionDepartmentCode'),
        $translate.instant('us.user.list.grid.electionDepartmentName')
      ],
      colModel: [
        {name: 'id', hidden: true},
        {name: 'extraActions', sortable: false, fixed: true, align: 'center', width: 70},
        {name: 'username', index: 'username', sortable: true, editable: false, width: 100},
        {name: 'lastName', index: 'lastName', sortable: true, editable: false, width: 90},
        {name: 'firstName', index: 'firstName', sortable: true, editable: false, width: 90},
        {name: 'email', index: 'email', sortable: true, editable: false, width: 100},
        {name: 'electionCenterCode', index: 'electionDepartment.electionCenter.code', sortable: true, editable: false, width: 70},
        {name: 'electionCenterName', index: 'electionDepartment.electionCenter.name', sortable: true, editable: false, width: 100},
        {name: 'electionDepartmentCode', index: 'electionDepartment.code', sortable: true, editable: false, width: 70},
        {name: 'electionDepartmentName', index: 'electionDepartment.name', sortable: true, editable: false, width: 100}
      ],
      sortname: 'lastName',
      sortorder: 'asc'
    };
    
    $scope.retrieveGridData = function () {
      
      if (!$scope.hasPermission('sa.user')) {
        return;
      }
      
      if($scope.args.hasElectionDepartmentId === '') {
        $scope.args.hasElectionDepartmentId = null;
      }
      
      $scope.startIndexLoading();
      ViewJqGridService.retrieveData($('#userListGrid'), $scope.args);
    };
    
    $scope.clearElectionCenterDepartmentArgs = function() {
      if($scope.args.hasElectionDepartmentId === 'NO') {
        $scope.args.electionCenterId = null;
        $scope.args.electionDepartmentId = null;
      }
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
    
    $scope.clearArguments = function() {
      Object.getOwnPropertyNames($scope.args).forEach(val => {
        $scope.args[val] = null;
      });
    };
    
  }
]);
