angular.module('app.utils').controller('SearchLogController', [
  '$scope',
  '$rootScope',
  '$translate',
  '$http',
  '$timeout',
  'ViewJqGridService',
  function($scope, $rootScope, $translate, $http, $timeout, ViewJqGridService) {
    
    // Ανάκτηση λίστας κριτηρίων που θέλουμε να εμφανίζονται στο log αναζητήσεων.
    $http({
        url: `${$rootScope.baseUrl}/cregapi/common/indexsearches/basicarguments`,
        dataType: 'json',
        method: 'GET'
      })
      .then(({ data }) => {
        $scope.basicArguments = data;
      });
          
    // Ανάκτηση δεδομένων όταν εμφανίζεται το directive.
    $scope.$watch('show', value => {
      if (value) $scope.retrieveGridData();
    }, true);

    // - jqGrid data.
    // Χρειάζεται 2 στήλες για τα arguments, μία στήλη με τα json data
    // και μία που τα εμφανίζει σε human-readable μορφή.
    $scope.gridData = {
      caption: $translate.instant('common.grid.caption.searchlog'),
      url: $rootScope.indexSearchesIndexUrl,
      shrinkToFit: true,
      colNames: [
        'id',
        '',
        $translate.instant('common.grid.searchlog.arguments'),
        $translate.instant('common.grid.searchlog.date'),
        $translate.instant('common.grid.searchlog.rowcount'),
      ],
      colModel: [
        { name: 'id', hidden: true },
        { name: 'arguments', sortable: false, editable: false, hidden: true },
        { name: 'formattedArguments', sortable: false, editable: false, width: 300,
          formatter(cellvalue) {
            const args = JSON.parse(cellvalue || '{}');
            
            // Φιλτράρει όσα κριτήρια θέλουμε να εμφανίζονται και έχουν τιμή,
            // τα μεταφράζει και τα ενώνει σε ένα string χωρισμένο με κόμματα.
            return Object.keys(args)
              .filter(key => Object.keys($scope.basicArguments).includes(key))
              .filter(key => args[key] || args[key] === 0)
              .map(key => `${$scope.basicArguments[key]}: ${args[key]}`)
              .join(', ');
          }
        },
        { name: 'date', index: 'date', sortable: true, editable: false, align: 'center', width: 50 },
        { name: 'rowCount', index: 'rowCount', sortable: true, editable: false, align: 'center', width: 50 },
      ],
      sortname: 'date',
      sortorder: 'desc',
      rowNum: 5,
      rowList: [5, 10, 15],
    };
    
    /**
     * Ανάκτηση αποτελεσμάτων και εμφάνιση στο grid (επιλογή με το gridId).
     */
    $scope.retrieveGridData = () => {
      ViewJqGridService.retrieveData(angular.element(`#search-log-${$scope.idSuffix}`), { entity: $scope.entity });
    };
    
    /**
     * Καλείται για γραμμή του grid όπου παίρνει το περιεχόμενο της στήλης 'argument'
     * το μετατρέπει σε αντικείμενο και το θέτει στο scope
     * (κατ' επέκταση στο scope του parent element).
     *
     * @param {Number} rowId Αριθμός γραμμής του jqGrid
     */
    $scope.fillArguments = rowId => {
      const argsJSON = angular.element(`#search-log-${$scope.idSuffix}`).jqGrid('getCell', rowId, 'arguments');
      
      $scope.args = JSON.parse(argsJSON || '{}');
    };
    
    /**
     * Καλείται στη μέθοδο loadComplete του jqGrid.
     * Αντιγράφει τα δεδομένα της στήλης arguments στη στήλη formattedArguments.
     */
    $scope.formatArguments = () => {
      const $grid = angular.element(`#search-log-${$scope.idSuffix}`);
      
      ViewJqGridService.getAllRowIds($grid).forEach(rowId => {
        const rowData = ViewJqGridService.getRowObject($grid, rowId);
        
        ViewJqGridService.setCell($grid, rowId, 'formattedArguments', rowData.arguments);
      });
    };
    
  }
]);
