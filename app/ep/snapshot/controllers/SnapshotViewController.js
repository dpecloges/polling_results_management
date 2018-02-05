angular.module('app.ep.snapshot').controller('SnapshotViewController', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$translate',
  '$timeout',
  '$interval',
  '$window',
  '$filter',
  'authService',
  'localStorageService',
  'SuccessErrorService',
  'ElectionDepartmentService',
  'ResultService',
  'SnapshotService',
  'currentElectionProcedure',
  'ResultType',
  'DisplayResultOption',
  'AutoRefresh',
  function($scope, $rootScope, $state, $stateParams, $translate, $timeout, $interval, $window, $filter, authService, localStorageService,
           SuccessErrorService, ElectionDepartmentService, ResultService, SnapshotService, currentElectionProcedure,
           ResultType, DisplayResultOption, AutoRefresh) {
    
    let refreshTimer;
    
    $scope.hasPermission = permission => authService.hasPermission(permission);
    
    // Τρέχουσα εκλογική διαδικασία
    $scope.currentElectionProcedure = currentElectionProcedure;
    
    $scope.DisplayResultOption = DisplayResultOption;
    $scope.snapshot = {};
    $scope.args = {};
    $scope.filters = [];
    $scope.departmentCountData = {};
    $scope.showAdminUnit = true;
    $scope.autoRefresh = false;
    
    // Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }
    
    $scope.mainTableData = [];
    $scope.calculationDates = {};
  
    /**
     * Άνοιγμα - εμφάνιση πλαινής μπάρας φίλτρων.
     */
    $scope.openSidebar = () => {
      $scope.sidebarOpened = true;
    };
    
    $scope.$on('$viewContentLoaded', () => {
      // Απόκρυψη της πλαινής navigation bar.
      $timeout(() => {
        angular.element('a[toggle-menu]').triggerHandler('click');
      });
      
      // Ανάκτηση φίλτρων και αποτελεσμάτων από την πληροφορία στο $window.opener
      // αν πρόκειται για redirect ή αν υπάρχει από το LocalStorage.
      // Η υλοποίηση προκύπτει από την ανάγκη διατήρησης των φίλτρων
      // και των αποτελεσμάτων σε περίπτωση συνεχώμενων ανανεώσεων
      // της σελίδας (κουμπί ή F5).
      $timeout(() => {
        let args;
        
        if ($window.opener && $window.opener.args) {
          args = $window.opener.args;
        } else if (localStorageService.isSupported) {
          args = localStorageService.get('snapshotArgs');
        }
        
        if (args && Object.getOwnPropertyNames(args).length) {
          $scope.args = args;
          $scope.sidebarOpened = false;
          $scope.retrieve();
        } else {
          $scope.sidebarOpened = true;
        }
      });
    });
  
    $scope.options = {
    
    };
  
    $scope.chartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      tooltips: { enabled: false },
      events: []
    };
    
    $scope.chartColors = ['rgba(10,190,85,0.9)', 'rgba(168,202,203,0.9)'];
    $scope.votersChartColors = ['rgba(10,190,85,0.9)'];
    $scope.votersRateChartColors = ['rgba(73,91,145,0.9)'];
    $scope.undoneVotersChartColors = ['rgba(190,10,85,0.9)'];
    
    /**
     * Αποστολή Αποτελεσμάτων
     */
    $scope.retrieve = () => {
      if (!$scope.hasPermission('ep.snapshot')) {
        return;
      }

      SnapshotService.searchSnapshots(reduceArgs($scope.args))
          .then(result => {
  
            $scope.mainTableData = [];
  
            $scope.calculationDates = {
              calculationDateTime: result.calculationDateTime,
              nextCalculationDateTime: result.nextCalculationDateTime
            };
  
            $scope.mainTableData.push({
              id: result.id,
              type: result.type,
              argId: result.argId,
              name: result.name,
              calculationDateTime: result.calculationDateTime,
              nextCalculationDateTime: result.nextCalculationDateTime,
              startedDepartmentCount: result.startedDepartmentCount,
              submittedDepartmentCount: result.submittedDepartmentCount,
              totalDepartmentCount: result.totalDepartmentCount,
              voterCount: result.voterCount,
              undoneVoterCount: result.undoneVoterCount
            });
  
            //$scope.mainTableData = mainUnitArray.concat(result.descendantSnapshots);
  
            for (var i = 0; i < result.descendantSnapshots.length; i++) {
              if (result.descendantSnapshots[i].totalDepartmentCount > 0) {
                $scope.mainTableData.push(result.descendantSnapshots[i]);
              }
            }
  
            $scope.findAllSnapshots(result.type, result.argId, false);
          })
          .catch(({ data }) => {
            SuccessErrorService.apiValidationErrors($scope, data);
          })
          .finally(() => {
            $scope.sidebarOpened = false;
            
            // Χρειάζεται timeout με interval για να προλάβουν να ενημερωθούν
            // τα dropdowns της διοικητικής δομής και να ενημερωθεί αντίστοιχα το breadcrumb
            $timeout(() => {
              // Για δημιουργία breadcrumb από φίλτρα
              $scope.filters = mapOrderedFilterArgs($scope.args);
              
              // Persist on local storage
              persistLocalArgs($scope.args);
            }, 100);
          });
    };
    
    $scope.toggleAutoRefresh = autoRefresh => {
      $scope.autoRefresh = autoRefresh;
      
      if (autoRefresh) {
        refreshTimer = $interval(() => {
          $scope.retrieve();
        }, AutoRefresh.INTERVAL);
      } else {
        $interval.cancel(refreshTimer);
      }
    };
    
    /**
     * Αλλαγή στα φίλτρα για κλικ σε αντίστοιχο στοιχείο του breadcrumb.
     */
    $scope.onBreadcrumbClick = ({ model, value }) => {
      // Εκκαθάριση των κατωτεροβάθμιων φίλτρων.
      Object.keys(ResultType).forEach(key => {
        if (ResultType[key].order > ResultType[model].order) {
          $scope.args[key] = null;
        }
      });
            
      // Χρήση της $timeout ώστε να προλάβουν
      // να ανανεωθούν οι νέες τιμές των πεδίων.
      $timeout(() => {
        $scope.initAdminUnitLists();
        $scope.retrieve();
      });
    };
    
    $scope.drillDown = ({ type, argId }) => {
      const resultType = ResultType.get(type);
      
      $scope.args[resultType] = Number(argId) || argId;
      
      // Χρήση της $timeout ώστε να προλάβουν
      // να ανανεωθούν οι νέες τιμές των πεδίων.
      $timeout(() => {
        $scope.initAdminUnitLists();
        $scope.retrieve();
      });
    };
    
    $scope.setInitAdminUnitLists = adminUnitListsFn => {
      $scope.initAdminUnitLists = adminUnitListsFn;
    };
    
    $scope.adminUnitDataValues = adminUnitDataValuesFn => {
      $scope.getAdminUnitDataValues = adminUnitDataValuesFn;
    };
    
    $scope.setClear = adminUnitFn => {
      $scope.clearAdminUnit = adminUnitFn;
    };
    
    $scope.clearArguments = () => {
      Object.keys($scope.args).forEach(val => {
        $scope.args[val] = null;
      });
      
      $scope.clearAdminUnit();
      $scope.showAdminUnit = true;
    };
    
    function persistLocalArgs(args = {}, key = 'snapshotArgs') {
      if (localStorageService.isSupported && args) {
        localStorageService.set(key, args);
      }
    }
    
    function mapDropdownArgValue(type, argId) {
      return $scope.getAdminUnitDataValues().find(au => au.model === type) || {};
    }
    
    function mapOrderedFilterArgs(args = {}) {
      return Object.keys(args)
        .filter(key => ResultType[key] && $scope.args[key])
        .sort((a, b) => ResultType[a].order - ResultType[b].order)
        .map(key => mapDropdownArgValue(key, args[key]))
        .filter(d => d.visibility);
    }
    
    function reduceArgs(args = {}) {
      return Object.keys(args).reduce((acc, key) => {
        return args[key] && ResultType[key] && ResultType[key].order > acc.order
            ? { type: ResultType[key].type, argId: args[key], order: ResultType[key].order }
            : acc;
      }, { order: 0 });
    };
    
    function percent2d(number1, number2) {
      if (number2 === 0) return 0;
      
      const perc = (number1 / number2) * 100;
      return !isNaN(perc) ? perc.toFixed(2) : 0;
    }
  
    $scope.customLineChartOptions = {
      showAnalysis: false,
      loadAnalysis: false
    }
    
    $scope.findAllSnapshots = (type, argId, scrollToAnalysis) => {
      
      let args = {
        type: type,
        argId: argId
      };
  
      // $scope.customLineChartOptions.showAnalysis = false;
      $scope.customLineChartOptions.loadAnalysis = true;
      
      SnapshotService.findAllSnapshots(args)
          .then(result => {
  
            $scope.votersChartSeries = [$translate.instant('ep.snapshot.view.analysis.voterCount')];
            $scope.votersRateChartSeries = [$translate.instant('ep.snapshot.view.analysis.voterCountRate')];
            $scope.undoneVotersChartSeries = [$translate.instant('ep.snapshot.view.analysis.undoneVoterCount')];
  
            $scope.votersChartLabels = [];
            $scope.votersRateChartLabels = [];
            $scope.undoneVotersChartLabels = [];
            let votersChartData = [];
            let votersRateChartData = [];
            let undoneVotersChartData = [];
            
            for (var i = 0; i < result.length; i++) {
              $scope.votersChartLabels.push(result[i].calculationDateTime);
              $scope.votersRateChartLabels.push(result[i].calculationDateTime);
              $scope.undoneVotersChartLabels.push(result[i].calculationDateTime);
              votersChartData.push(result[i].voterCount);
              votersRateChartData.push(i == 0 ? result[i].voterCount : result[i].voterCount - result[i-1].voterCount);
              undoneVotersChartData.push(result[i].undoneVoterCount);
            }
  
            $scope.votersChartData = [votersChartData];
            $scope.votersRateChartData = [votersRateChartData];
            $scope.undoneVotersChartData = [undoneVotersChartData];
  
            let tooltipMessages = {
              title: $translate.instant('ep.snapshot.view.charts.title.tooltip')
            };
            
            $scope.votersChartDatasetOverride = [{ xAxisID: 'x-axis-1', yAxisID: 'y-axis-1' }];
            $scope.votersChartOptions = {
              legend: {
                display: true
              },
              tooltips: {
                callbacks: {
                  title: function(tooltipItem, data) {
                    return tooltipMessages.title + ': ' + $filter('date')(tooltipItem[0].xLabel, 'HH:mm');
                  },
                  label: function (tooltipItem, data) {
                    return data.datasets[0].label + ': ' + tooltipItem.yLabel;
                  }
                }
              },
              scales: {
                xAxes: [{
                  id: 'x-axis-1',
                  type: 'time',
                  unit: 'millisecond',
                  displayFormats: {
                    'millisecond': 'HH:mm',
                  },
                  ticks: {
                    max: 10
                  }
                }],
                yAxes: [
                  {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
              }
            };
            
            $scope.customLineChartOptions = {
              showAnalysis: true,
              loadAnalysis: false,
              name: result[result.length - 1].name
            }
  
            $scope.votersRateChartDatasetOverride = $scope.votersChartDatasetOverride;
            $scope.votersRateChartOptions = $scope.votersChartOptions;
            
            $scope.undoneVotersChartDatasetOverride = $scope.votersChartDatasetOverride;
            $scope.undoneVotersChartOptions = $scope.votersChartOptions;
  
            if (scrollToAnalysis) {
              $timeout(function() {
                $('html,body').animate({scrollTop: $("#analysisHeaderId").offset().top}, 500);
              }, 500);
            }
            
          })
          .catch(({data}) => {
            SuccessErrorService.apiValidationErrors($scope, data);
          });
    }
  
  }
]);
