angular.module('app.mg.electiondepartment').factory('AddContributionService', [
  '$rootScope',
  '$modal',
  '$ngBootbox',
  '$translate',
  'ViewJqGridService',
  'ElectionDepartmentService',
  'ContributionType',
  function($rootScope, $modal, $ngBootbox, $translate, ViewJqGridService, ElectionDepartmentService, ContributionType) {
    
    var gridId = 'selectVolunteerGrid';
    
    /**
     * Άνοιγμα modal
     */
    var openModal = (type, candidateId, electionDepartment, currentElectionProcedure) => {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'app/mg/electiondepartment/services/add-contribution/add-contribution.tpl.html',
        windowClass: 'modal-fixed-width-χlg', //modal-80percent
        controller($scope, $modalInstance, gridId, authService) {
          $scope.args = {};
  
          $scope.hasPermission = function (permission) {
            return authService.hasPermission(permission);
          };
          
          $scope.gridId = gridId;
          
          $scope.gridData = {
            caption: $translate.instant('global.grid.caption'),
            url: $rootScope.volunteerIndexUrl,
            colNames: [
              'id',
              $translate.instant('ext.volunteer.list.grid.publicIdentifier'),
              $translate.instant('ext.volunteer.list.grid.eklSpecialNo'),
              $translate.instant('ext.volunteer.list.grid.lastName'),
              $translate.instant('ext.volunteer.list.grid.firstName'),
              $translate.instant('ext.volunteer.list.grid.email'),
            ],
            colModel: [
              { name: 'id', hidden: true },
              { name: 'publicIdentifier', index: 'publicIdentifier', sortable: true, editable: false, width: 50, align: 'center' },
              { name: 'eklSpecialNo', index: 'eklSpecialNo', sortable: true, editable: false, width: 50, align: 'center' },
              { name: 'lastName', index: 'lastName', sortable: true, editable: false, width: 80 },
              { name: 'firstName', index: 'firstName', sortable: true, editable: false, width: 80 },
              { name: 'email', index: 'email', sortable: true, editable: false, width: 90, align: 'center'},
            ],
            sortname: 'lastName',
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
            $modalInstance.close(id);
          };
          
          /**
           * Επιβεβαίωση στο modal
           */
          $scope.confirm = function() {
            if (!$scope.hasPermission('mg.electiondepartment')) {
              return;
            }
            // Επιστροφή του επιλεγμένου id
            var rowId = ViewJqGridService.getSelectedRow($('#' + $scope.gridId));
            $modalInstance.close(rowId);
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
      
      modalInstance.result.then(rowId => {
        const found = electionDepartment.contributions.find(c => c.volunteer && c.volunteer.id === rowId);
        if (found) {
          $ngBootbox.alert($translate.instant('mg.electiondepartment.view.contributions.add.selectVolunteer.alert.volunteerExists'));
          return;
        }
        
          
        const $table = $('#' + gridId);
        
        const volunteer = {
          id: rowId,
          publicIdentifier: ViewJqGridService.getRowCellValue($table, rowId, 'publicIdentifier'),
          eklSpecialNo: ViewJqGridService.getRowCellValue($table, rowId, 'eklSpecialNo'),
          lastName: ViewJqGridService.getRowCellValue($table, rowId, 'lastName'),
          firstName: ViewJqGridService.getRowCellValue($table, rowId, 'firstName'),
          email: ViewJqGridService.getRowCellValue($table, rowId, 'email'),
        };
        
        const contribution = {
          volunteerId: rowId,
          round: currentElectionProcedure.round,
          volunteer: volunteer,
          type: type,
          candidateId: (type === 'CANDIDATE_REPRESENTATIVE') ? candidateId : null,
          status: (type === 'COMMITTEE_LEADER' || type === 'COMMITTEE_LEADER_VICE' || type === 'ID_VERIFIER' || type === 'ID_VERIFIER_VICE') ? 'PENDING' : 'WITHOUT_ACCESS'
        };
        
        // Έλεγχος δήλωσης εθελοντή σε πολλαπλά Ε.Τ. (δεν ισχύει για προέδρους και αναπληρωτές προέδρους)
        ElectionDepartmentService.getByVolunteer(rowId, currentElectionProcedure.round, electionDepartment.id)
          .then(volunteerEds => {
            
            let conflictingVolunteerEds = [];
            
            for(let i=0; i<volunteerEds.length; i++) {
              if((type !== 'COMMITTEE_LEADER' && type !== 'COMMITTEE_LEADER_VICE') || (volunteerEds[i].contributionType !== 'COMMITTEE_LEADER' && volunteerEds[i].contributionType !== 'COMMITTEE_LEADER_VICE')) {
                conflictingVolunteerEds.push(volunteerEds[i]);
              }
            }
            
            if (conflictingVolunteerEds.length) {
              $ngBootbox.alert(`
                ${$translate.instant('mg.electiondepartment.view.contributions.add.selectVolunteer.alert.volunteerExistsinEd')}
                <br>
                ${conflictingVolunteerEds.map(function(ed) {
                  let contributionTypeText = $translate.instant(ContributionType[ed.contributionType].messageKey);
                  return `<br>${ed.displayName} (` + contributionTypeText + `)`;
                })}
              `);
              return;
            }
            
            electionDepartment.contributions.push(contribution);
          });
      });
    };
    
    return { openModal };
  }]);
