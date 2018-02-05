angular.module('app.mg.electioncenter').controller('ElectionCenterViewController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$state',
  '$translate',
  '$timeout',
  '$window',
  '$ngBootbox',
  'ElectionCenterService',
  'SuccessErrorService',
  'ViewJqGridService',
  'authService',
  'electionCenter',
  'currentElectionProcedure',
  function ($scope, $rootScope, $stateParams, $state, $translate, $timeout, $window, $ngBootbox,
            ElectionCenterService, SuccessErrorService, ViewJqGridService, authService, electionCenter, currentElectionProcedure) {
    
    //View state
    $scope.viewState = 'app.mg.electioncenter.view';
    
    //Url Ε.Τ. για το ευρετήριο.
    $scope.electionDepartmentViewUrl = 'mg/electiondepartment/view/';
    $scope.electionDepartmentGridId = 'election-department-list-grid';
    $scope.electionDepartmentGridSelector = '#' + $scope.electionDepartmentGridId;
  
    $scope.hasPermission = function (permission) {
      return authService.hasPermission(permission);
    };
    
    //Αντικείμενο εγγραφής
    $scope.electionCenter = electionCenter;
    
    //Τρέχουσα εκλογική διαδικασία
    $scope.currentElectionProcedure = currentElectionProcedure;
    
    /*
     * Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
     */
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }
    
    /**
     * Προσθήκη επόπτη
     * Αρχικοποιεί έναν κενό contributor ανάλογα με το γύρο της τρέχουσας εκλογικής διαδικασίας
     */
    $scope.addSupervisor = function () {
  
      if (!$scope.hasPermission('mg.electioncenter')) {
        return;
      }
      
      if ($scope.currentElectionProcedure.round === 'FIRST' && !$scope.electionCenter.supervisorFirst) {
        $scope.electionCenter.supervisorFirst = {};
      }
      else if ($scope.currentElectionProcedure.round === 'SECOND' && !$scope.electionCenter.supervisorSecond) {
        $scope.electionCenter.supervisorSecond = {};
      }
    };
    
    // Πεδία που διατηρούνται κατά τη μετάβαση τη δημιουργία νέου EK.
    var localElectionCenterInitFields = [
      'geographicalUnitId', 'decentralAdminId', 'regionId', 
      'regionalUnitId', 'municipalityId', 'municipalUnitId'
    ];
    var foreignElectionCenterInitFields = [
      'foreignCountry', 'foreignCity'
    ];
    
    /*
     * Δημιουργία αντιγράφου του ΕΚ που δίνεται ως όρισμα, διατηρώντας 
     * μόνο τα απαιτούμενα πεδία για τη δημιουργία νέου EK.
     */
    var newElectionCenterFrom = function(electionCenter) {
      var newElectionCenter = { id:null, foreign: electionCenter.foreign };
      var copyFields = electionCenter.foreign? 
        foreignElectionCenterInitFields: localElectionCenterInitFields
      
      copyFields.forEach(f => {
        newElectionCenter[f] = electionCenter[f];
      });
      
      return newElectionCenter;
    }
    
    /*
     * Αποθήκευση
     */
    $scope.saveElectionCenter = function (opts) {
  
      if (!$scope.hasPermission('mg.electioncenter')) {
        return;
      }
      
      //Εκκίνηση spinner
      $scope.saveLoading = true;
      
      //Αρχικοποίηση success-error
      SuccessErrorService.initialize($scope);
      
      // Επιλογή δημιουργίας νέου ΕK
      var addNew = opts && opts.addNew;
      
      //Αποθήκευση
      ElectionCenterService.saveElectionCenter($scope.electionCenter).$promise
          .then(function (result) {
            
            
            //Ορισμός αποθηκευμένου αντικειμένου
            $scope.electionCenter = addNew? newElectionCenterFrom(result): result;
                        
            //Μετάβαση στο state με το νέο id
            $state.go($scope.viewState, {id: $scope.electionCenter.id}, {notify: false});
            
            //Μήνυμα επιτυχίας
            SuccessErrorService.showSuccess($scope);
            
            //Ορισμός κατάστασης φόρμας σε μη dirty
            $scope.electionCenterForm.$dirty = false;
          })
          .catch(function (result) {
            //Μήνυμα σφάλματος
            SuccessErrorService.apiValidationErrors($scope, result.data);
          })
          .finally(function (result) {
            //Σταμάτημα spinner
            $scope.saveLoading = false;
            
            if (addNew) {
              var jqDepartmentTable = angular.element($scope.electionDepartmentGridSelector);
              ViewJqGridService.clearGrid(jqDepartmentTable);
            }
          });
    };
    
    /*
     * Διαγραφή
     */
    $scope.deleteElectionCenter = function () {
  
      if (!$scope.hasPermission('mg.electioncenter')) {
        return;
      }
      
      //Bootbox επιβεβαίωσης
      $ngBootbox.customDialog({
        message: $translate.instant('mg.electioncenter.view.delete.confirmation'),
        buttons: {
          confirm: {
            label: $translate.instant('global.confirm'),
            className: 'btn-success',
            callback: function () {
              
              //Εκκίνηση spinner
              $scope.deleteLoading = true;
              
              //Αρχικοποίηση success-error
              SuccessErrorService.initialize($scope);
              
              //Διαγραφή
              ElectionCenterService.deleteElectionCenter($scope.electionCenter.id).$promise
                  .then(function (result) {
                    //Μήνυμα επιτυχίας
                    var successMessage = $translate.instant('mg.electioncenter.view.delete.success');
                    
                    //Μετάβαση στο ευρετήριο
                    $state.go('app.mg.electioncenter.list', {successMessage: successMessage}, {
                      reload: false,
                      notify: true
                    });
                  })
                  .catch(function (result) {
                    //Μήνυμα σφάλματος
                    SuccessErrorService.apiValidationErrors($scope, result.data);
                  })
                  .finally(function (result) {
                    //Σταμάτημα spinner
                    $scope.deleteLoading = false;
                  });
              
            }
          },
          cancel: {
            label: $translate.instant('global.cancel'),
            className: 'btn-danger',
            callback: function () {
            }
          }
        }
        
      });
      
    };
    
    /**
     * Ανοίγει ένα νέο tab στον browser με την καρτέλα καταχώρισης
     * Εκλογικού Τμήματος μεταφέροντας το id του Εκλογικού Κέντρου.
     */
    $scope.createNewElectionDepartment = () => {
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      $window.electionCenterId = $scope.electionCenter.id;
      $window.open('#/mg/electiondepartment/view/', '_blank');
    };
    
    // Data ευρετηρίου Εκλογικών Τμημάτων
    $scope.electionDepartmentGridData = {
      //caption: $translate.instant('global.grid.caption'),
      url: $rootScope.electionDepartmentIndexUrl,
      // shrinkToFit: true,
      colNames: [
        'id',
        $translate.instant('global.grid.actions'),
        $translate.instant('mg.electiondepartment.view.code'),
        $translate.instant('mg.electiondepartment.view.name'),
        $translate.instant('mg.electiondepartment.view.comments'),
      ],
      colModel: [
        {name: 'id', hidden: true},
        {name: 'extraActions', sortable: false, fixed: true, align: 'center', width: 60},
        {name: 'code', index: 'code', sortable: true, editable: false, align: 'center', width: 40},
        {name: 'name', index: 'name', sortable: true, editable: false, width: 80},
        {name: 'comments', index: 'comments', sortable: true, editable: false, width: 100},
      ],
      sortname: 'name',
      sortorder: 'asc',
    };
    
    /**
     * Ανάκτηση αποτελεσμάτων ευρετηρίου.
     */
    $scope.retrieveElectionDepartmentGridData = () => {
  
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      
      $scope.startIndexLoading();
      
      ViewJqGridService.retrieveData(
          angular.element($scope.electionDepartmentGridSelector),
          {electionCenterId: $scope.electionCenter.id}
      );
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
    
  }
]);
