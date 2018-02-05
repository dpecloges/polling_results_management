angular.module('app.us.volunteer').service('VolunteerReassignmentDialog', [
  '$rootScope', 
  '$modal', 
  '$ngBootbox',
  '$translate',
  '$log',
  'ViewJqGridService',
  'SuccessErrorService',
  'ContributionType',
  'UsVolunteerService',
  'CandidateService',
  function(
      $rootScope, $modal, $ngBootbox, $translate, $log,
      ViewJqGridService, SuccessErrorService, ContributionType, UsVolunteerService, CandidateService) {
    
    var gridId = 'selectElectionDepartmentGrid';
    
    // Άνοιγμα modal
    var open = (volunteer, currentElectionProcedure) => {
      
      var modalInstance = $modal.open({
        templateUrl: 'app/us/volunteer/reassignment/volunteer-reassignment-dialog.tpl.html',
        windowClass: 'modal-fixed-width-χlg', //modal-80percent
        controller($scope, $modalInstance, gridId, authService) {
  
          $scope.hasPermission = function(permission) {
            return authService.hasPermission(permission);
          };
          
          $scope.volunteer = volunteer;
          
          CandidateService.getByCurrentElectionProcedure().then(function(result) {
            $scope.candidates = result;
          });
          
          $scope.args = {};
          
          $scope.getReassignmentFormData = function(rowId) {
            return {
              volunteerId: volunteer.id,
              fromElectionDepartmentId: volunteer.electionDepartmentId,
              toElectionDepartmentId: rowId,
              round: currentElectionProcedure.round
            }
          };
          
          $scope.isValidReassignmentForm = function(rowId) {
            var formData = $scope.getReassignmentFormData(rowId);
            return (
                formData.volunteerId != null &&
                formData.fromElectionDepartmentId != null &&
                formData.toElectionDepartmentId != null
            );
          };
          
          /**
           * Μετακίνηση εθελοντή στο επιλεγμένο τμήμα
           */
          $scope.reassignVolunteer = function(rowId) {
            if ($scope.isValidReassignmentForm(rowId)) {
              var reassignment = $scope.getReassignmentFormData(rowId);
              UsVolunteerService.reassignVolunteer(reassignment).then(function(data) {
                // Το modal κλείνοντας επιστρέφει το row object του επιλεγμένου τμήματος
                var jqTable = $('#' + $scope.gridId);
                var toElectionDepartment = ViewJqGridService.getRowObject(jqTable, rowId);
                $modalInstance.close(toElectionDepartment);
              }).catch(function (result) {
                // Μήνυμα σφάλματος
                var errorMsg = "";
                if(result.data.errors) {
                  var errorMsgs = result.data.errors.map(e => e.errorMessage);
                  errorMsg = errorMsgs.join('<br/>');
                  $ngBootbox.alert(errorMsg);
                }
                else {
                    $log.error('Υπάρχει bug στον κώδικα ή πρόβλημα στα δεδομένα.');
                }
              });
            } else {
              $ngBootbox.alert($translate.instant('us.volunteer.reassignment.errors.departmentNotSelected'));
            }
          };
          
          $scope.gridId = gridId;
          $scope.gridData = {
            caption: $translate.instant('global.grid.caption'),
            url: $rootScope.electionDepartmentFullIndexUrl,
            rowList: [5, 10],
            rowNum: 5,
            colNames: [
              'id',
              'electionCenterId',
              $translate.instant('us.volunteer.assignment.electiondepartment.list.grid.electionCenterCode'),
              $translate.instant('us.volunteer.assignment.electiondepartment.list.grid.electionCenterName'),
              $translate.instant('us.volunteer.assignment.electiondepartment.list.grid.code'),
              $translate.instant('us.volunteer.assignment.electiondepartment.list.grid.name'),
            ],
            colModel: [
              { name: 'id', hidden: true },
              { name: 'electionCenterId', hidden: true },
              { name: 'electionCenterCode', index: 'electionCenter.code', sortable: true, editable: false, width: 50 },
              { name: 'electionCenterName', index: 'electionCenter.name', sortable: true, editable: false, width: 100 },
              { name: 'code', index: 'code', sortable: true, editable: false, width: 50 },
              { name: 'name', index: 'name', sortable: true, editable: false, width: 100 }
            ],
            sortname: 'electionCenter.code',
            sortorder: 'asc'
              
          };
          
          /**
           * Ανάκτηση
           */
          $scope.retrieveGridData = function() {
            if (!$scope.hasPermission('mg.electiondepartment')) {
              return;
            }
            $scope.startIndexLoading();
            ViewJqGridService.retrieveData($('#' + $scope.gridId), $scope.args);
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
          
          /**
           * Διπλό κλικ σε γραμμή
           */
          $scope.doubleClick = function(id) {
            
          };
          
          /**
           * Επιβεβαίωση στο modal
           */
          $scope.confirm = function() {
            if (!$scope.hasPermission('mg.electiondepartment')) {
              return;
            }
            var jqTable = $('#' + $scope.gridId);
            var rowId = ViewJqGridService.getSelectedRow(jqTable);
            $scope.reassignVolunteer(rowId);
          };
          
          $scope.testReassignmentFormData = function() {
            if (!$scope.hasPermission('mg.electiondepartment')) {
              return;
            }
            var jqTable = $('#' + $scope.gridId);
            var rowId = ViewJqGridService.getSelectedRow(jqTable);
            return $scope.getReassignmentFormData(rowId);
          };
          
          /**
           * Ακύρωση στο modal
           */
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        resolve: {
          gridId: () => gridId
        }
      });
      
      modalInstance.rendered.then(function() {
        $rootScope.$broadcast('resizeModalJqGrid');
      });
      
      return modalInstance;
    };
    
    return { open };
    
  }]);
