angular.module('app.rs.display').controller('DisplayViewController', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$translate',
  '$timeout',
  '$interval',
  '$window',
  'authService',
  'localStorageService',
  'SuccessErrorService',
  'ElectionDepartmentService',
  'ResultService',
  'currentElectionProcedure',
  'ResultType',
  'DisplayResultOption',
  'AutoRefresh',
  function($scope, $rootScope, $state, $stateParams, $translate, $timeout, $interval, $window, authService, localStorageService,
      SuccessErrorService, ElectionDepartmentService, ResultService, currentElectionProcedure,
      ResultType, DisplayResultOption, AutoRefresh) {
    
    let refreshTimer;
    
    $scope.hasPermission = permission => authService.hasPermission(permission);
    
    // Τρέχουσα εκλογική διαδικασία
    $scope.currentElectionProcedure = currentElectionProcedure;

    $scope.DisplayResultOption = DisplayResultOption;
    $scope.result = {};
    $scope.args = {};
    $scope.filters = [];
    $scope.departmentCountData = {};
    $scope.showAdminUnit = true;
    $scope.autoRefresh = false;

    // Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }
    
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
      
      // Ανάκτηση φίλτρων και αποτελεσμάτων αν υπάρχουν στο LocalStorage.
      // Η υλοποίηση προκύπτει από την ανάγκη διατήρησης των φίλτρων
      // και των αποτελεσμάτων σε περίπτωση συνεχώμενων ανανεώσεων
      // της σελίδας (κουμπί ή F5).
      $timeout(() => {
        if (localStorageService.isSupported) {
          const args = localStorageService.get('resultArgs');
        
          if (args && Object.getOwnPropertyNames(args).length) {
            $scope.args = args;
            $scope.sidebarOpened = false;
            $scope.retrieve();
          } else {
            $scope.sidebarOpened = true;
          }
        }
      });
    });

    /**
     * Αποστολή Αποτελεσμάτων
     */
    $scope.retrieve = () => {
      if (!$scope.hasPermission('rs.result')) {
        return;
      }
      
      ResultService.searchResults(reduceArgs($scope.args))
        .then(result => {
          $scope.result = result;
          $scope.departmentCountData.submittedDepartmentCount = result.submittedDepartmentCount;
          $scope.departmentCountData.totalDepartmentCount = result.totalDepartmentCount;
          
          // $scope.totalVotesPercentage = percent2d($scope.result.totalVotes);
          $scope.totalAndWhiteSumPercentage = percent2d($scope.result.invalidVotes + $scope.result.whiteVotes, $scope.result.totalVotes);
          $scope.validVotesPercentage = percent2d($scope.result.validVotes, $scope.result.totalVotes);
          $scope.invalidVotesPercentage = percent2d($scope.result.invalidVotes, $scope.result.totalVotes);
          $scope.whiteVotesPercentage = percent2d($scope.result.whiteVotes, $scope.result.totalVotes);
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
    
    /**
     * Ενεργοποίηση/απενεργοποίηση auto refresh για ορισμένο interval.
     *
     * @param  {Boolean} autoRefresh ΄ένδειξη
     */
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
    
    $scope.adminUnitDataValues = adminUnitDataValuesFn => {
      $scope.getAdminUnitDataValues = adminUnitDataValuesFn;
    };
    
    $scope.setInitAdminUnitLists = adminUnitDataValuesFn => {
      $scope.initAdminUnitLists = adminUnitDataValuesFn;
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

    function persistLocalArgs(args = {}, key = 'resultArgs') {
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
        .map(key => mapDropdownArgValue(key, args[key]));
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

  }
]);
