angular.module('app.ep.statistics').controller('StatisticsViewController', [
  '$rootScope',
  '$scope',
  '$translate',
  '$stateParams',
  '$timeout',
  '$window',
  'ViewJqGridService',
  'SuccessErrorService',
  'authService',
  'SnapshotType',
  'ResultType',
  function($rootScope, $scope, $translate, $stateParams, $timeout, $window,
      ViewJqGridService, SuccessErrorService, authService, SnapshotType, ResultType) {
    
    $scope.calculationDates = {};
    
    // Καρφωτό φιλτράρισμα περιοχών που θέλουμε να προβάλουμε.
    $scope.areas = SnapshotType.filter(area => ![
      'ALL', 'ABROAD', 'GREECE', 'FOREIGN_CITY',
      'GEOGRAPHICAL_UNIT', 'DECENTRAL_ADMIN', 'MUNICIPAL_UNIT',
    ].includes(area.value));
    $scope.areas.sort(function(a,b) {return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0);} );
  
    $scope.args = {
      type: 'MUNICIPALITY'
    };
    
    $scope.hasPermission = permission => authService.hasPermission(permission);

    // Παρακολούθηση για σφάλματα στο $rootScope.errorList.
    $rootScope.$watch('errorList', () => {
      SuccessErrorService.onRootScopeError($scope, $rootScope.errorList);
    }, true);

    // Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }

    $scope.topVerificationsGridData = {
      caption: $translate.instant('ep.statistics.list.grid.topVerifications'),
      url: `${$rootScope.statisticsIndexUrl}`,
      excelUrl: $rootScope.statisticsExcelUrl,
      shrinkToFit: true,
      colNames: [
        'id', 'argId', 'type', 'calculationDateTime', 'nextCalculationDateTime',
        $translate.instant('ep.statistics.list.grid.columnArea'),
        $translate.instant('ep.statistics.list.grid.columnNumber'),
      ],
      colModel: [
        { name: 'id', hidden: true, sortable: false },
        { name: 'argId', hidden: true, sortable: false },
        { name: 'type', hidden: true, sortable: false },
        { name: 'calculationDateTime', hidden: true, sortable: false },
        { name: 'nextCalculationDateTime', hidden: true, sortable: false },
        { name: 'name', sortable: false, editable: false, width: 500 },
        { name: 'voterCount', sortable: false, editable: false, align: 'center', width: 200 },
      ],
      sortname: 'voterCount desc, name',
      sortorder: 'asc',
      rowNum: 10,
      rowList: [10, 20, 50],
    };
    
    $scope.lowestVerificationsGridData = {
      caption: $translate.instant('ep.statistics.list.grid.lowestVerifications'),
      url: $rootScope.statisticsIndexUrl,
      excelUrl: $rootScope.statisticsExcelUrl,
      shrinkToFit: true,
      colNames: [
        'id', 'argId', 'type',
        $translate.instant('ep.statistics.list.grid.columnArea'),
        $translate.instant('ep.statistics.list.grid.columnNumber')
      ],
      colModel: [
        { name: 'id', hidden: true, sortable: false },
        { name: 'argId', hidden: true, sortable: false },
        { name: 'type', hidden: true, sortable: false },
        { name: 'name', index: 'code', sortable: false, editable: false, width: 500 },
        { name: 'voterCount', sortable: false, editable: false, align: 'center', width: 200 },
      ],
      sortname: 'voterCount asc, name',
      sortorder: 'asc',
      rowNum: 10,
      rowList: [10, 20, 50],
    };
    
    $scope.topUndoVotesGridData = {
      caption: $translate.instant('ep.statistics.list.grid.topUndoVotes'),
      url: $rootScope.statisticsIndexUrl,
      excelUrl: $rootScope.statisticsExcelUrl,
      shrinkToFit: true,
      colNames: [
        'id', 'argId', 'type',
        $translate.instant('ep.statistics.list.grid.columnArea'),
        $translate.instant('ep.statistics.list.grid.columnNumber')
      ],
      colModel: [
        { name: 'id', hidden: true, sortable: false },
        { name: 'argId', hidden: true, sortable: false },
        { name: 'type', hidden: true, sortable: false },
        { name: 'name', index: 'code', sortable: false, editable: false, width: 500 },
        { name: 'undoneVoterCount', sortable: false, editable: false, align: 'center', width: 200 },
      ],
      sortname: 'undoneVoterCount desc, name',
      sortorder: 'asc',
      rowNum: 10,
      rowList: [10, 20, 50],
    };
    
    $scope.lowestUndoVotesGridData = {
      caption: $translate.instant('ep.statistics.list.grid.lowestUndoVotes'),
      url: $rootScope.statisticsIndexUrl,
      excelUrl: $rootScope.statisticsExcelUrl,
      shrinkToFit: true,
      colNames: [
        'id', 'argId', 'type',
        $translate.instant('ep.statistics.list.grid.columnArea'),
        $translate.instant('ep.statistics.list.grid.columnNumber')
      ],
      colModel: [
        { name: 'id', hidden: true, sortable: false },
        { name: 'argId', hidden: true, sortable: false },
        { name: 'type', hidden: true, sortable: false },
        { name: 'name', sortable: false, editable: false, width: 500 },
        { name: 'undoneVoterCount', sortable: false, editable: false, align: 'center', width: 200 },
      ],
      sortname: 'undoneVoterCount asc, name',
      sortorder: 'asc',
      rowNum: 10,
      rowList: [10, 20, 50],
    };

    $scope.retrieveGridData = () => {
      if (!$scope.hasPermission('ep.snapshot')) {
        return;
      }

      $scope.startIndexLoading();
      ViewJqGridService.retrieveData(angular.element('table[id$="grid"]'), $scope.args);
    };

    /**
     * Έναρξη ένδειξης spinner στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.startIndexLoading = () => {
      $scope.indexLoading = true;
    };

    /**
     * Λήξη ένδειξης spinner στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.stopIndexLoading = () => {
      $scope.indexLoading = false;
    };

    /**
     * Εμφάνιση σφάλματος στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.errorIndexLoading = () => {
      $scope.indexLoading = false;
    };

    $scope.clearArguments = () => {
      Object.getOwnPropertyNames($scope.args).forEach(val => {
        $scope.args[val] = null;
      });
    };
    
    /**
     * Ορισμός ωρών τελευταίας και επόμενης ενημέρωσης από δεδομένα jqGrid.
     */
    $scope.dataLoaded = gridId => {
      const $grid = angular.element(`#${gridId}`);
      
      if (ViewJqGridService.hasRows($grid)) {
        const firstRow = ViewJqGridService.getAllRowIds($grid)[0];
        $scope.calculationDates.calculationDateTime = ViewJqGridService.getRowCellValue($grid, firstRow, 'calculationDateTime');
        $scope.calculationDates.nextCalculationDateTime = ViewJqGridService.getRowCellValue($grid, firstRow, 'nextCalculationDateTime');
      }
    };
    
    /**
     * Μεταφορά στη σελ΄ίδα της Εξέλιξης Εκλ. Διαδιασίας
     * σε διπλό κλικ σε γραμμή του ευρετηρίου.
     */
    $scope.gotoSnapshot = (rowId, gridId) => {
      const $grid = angular.element(`#${gridId}`);
      const { argId, type } = ViewJqGridService.getRowObject($grid, rowId);
      
      $window.args = { [ResultType.get(type)]: Number(argId) };
      $window.open('#/ep/snapshot/view/', '_blank');
    };
    
    $timeout(() => {
      // Hide column names
      // angular.element('.ui-jqgrid-hdiv').hide();
      
      $scope.retrieveGridData();
    });
    
    /**
     * Resize jqGrid(s) by parent width.
     * Selects grid elements by 'div[grid-id$="grid"]'.
     */
    function resizeJqGrids() {
      $timeout(() => {
        const $grids = angular.element('div[grid-id$="grid"]');
        
        $grids.each(function() {
          const $this = angular.element(this);
          const $parent = $this.parent();
          const $table = $this.find('table');
          
          $table.jqGrid('setGridWidth', $parent.width());
        });
      });
    }

  }
]);
