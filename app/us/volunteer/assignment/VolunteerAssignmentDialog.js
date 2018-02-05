angular.module('app.us.volunteer').service('VolunteerAssignmentDialog', [
  '$rootScope', 
  '$modal', 
  '$ngBootbox',
  '$translate',
  'ViewJqGridService',
  'SuccessErrorService',
  'ContributionType',
  'UsVolunteerService',
  'CandidateService',
  function(
      $rootScope, $modal, $ngBootbox, $translate, ViewJqGridService, 
      SuccessErrorService, ContributionType, UsVolunteerService, CandidateService) {
    
    var gridId = 'selectElectionDepartmentGrid';
    
    // Άνοιγμα modal
    var open = (volunteer, currentElectionProcedure) => {
      
      var modalInstance = $modal.open({
        templateUrl: 'app/us/volunteer/assignment/volunteer-assignment-dialog.tpl.html',
        windowClass: 'modal-fixed-width-χlg', //modal-80percent
        controller($scope, $modalInstance, gridId, authService) {
  
          $scope.hasPermission = function(permission) {
            return authService.hasPermission(permission);
          };
          
          $scope.volunteer = volunteer;
          
          var UserCreationOption = {
              NO_ACTION: 'NO_ACTION',
              NOTIFY: 'NOTIFY',
              CREATE_NOW: 'CREATE_NOW'
          };
          
          $scope.contributionTypeOptions = [
            {id: ContributionType.CANDIDATE_REPRESENTATIVE.id, name: $translate.instant(ContributionType.CANDIDATE_REPRESENTATIVE.messageKey)},
            {id: ContributionType.COMMITTEE_LEADER.id, name: $translate.instant(ContributionType.COMMITTEE_LEADER.messageKey)},
            {id: ContributionType.COMMITTEE_LEADER_VICE.id, name: $translate.instant(ContributionType.COMMITTEE_LEADER_VICE.messageKey)},
            {id: ContributionType.COMMITTEE_MEMBER.id, name: $translate.instant(ContributionType.COMMITTEE_MEMBER.messageKey)},
            {id: ContributionType.ID_VERIFIER.id, name: $translate.instant(ContributionType.ID_VERIFIER.messageKey)},
            {id: ContributionType.ID_VERIFIER_VICE.id, name: $translate.instant(ContributionType.ID_VERIFIER_VICE.messageKey)},
            {id: ContributionType.TREASURER.id, name: $translate.instant(ContributionType.TREASURER.messageKey)}
          ];
          
          CandidateService.getByCurrentElectionProcedure().then(function(result) {
            $scope.candidates = result;
          });
          
          $scope.userCreationOptions = [
            {id: UserCreationOption.NO_ACTION, name: $translate.instant('us.volunteer.assignment.options.createUserOption.NO_ACTION')}
          ];
          
          if ($scope.hasPermission('sa.email')) {
            $scope.userCreationOptions.push({id: UserCreationOption.NOTIFY, name: $translate.instant('us.volunteer.assignment.options.createUserOption.NOTIFY')});
          }
          
          if ($scope.hasPermission('sa.user')) {
            $scope.userCreationOptions.push({id: UserCreationOption.CREATE_NOW, name: $translate.instant('us.volunteer.assignment.options.createUserOption.CREATE_NOW')});
          }
          
          $scope.args = {};
          $scope.contributionType = ContributionType.COMMITTEE_LEADER.id;
          $scope.userCreationOption = UserCreationOption.NO_ACTION;
          $scope.userCreationOptionsDisabled = false;
          
          $scope.getAssignmentFormData = function(rowId) {
            return {
              volunteerId: volunteer.id,
              electionDepartmentId: rowId,
              contributionType: $scope.contributionType,
              contributionCandidateId: $scope.contributionCandidateId,
              notify: $scope.userCreationOption != UserCreationOption.NO_ACTION? ($scope.userCreationOption == UserCreationOption.NOTIFY): null,
              username: $scope.username,
              password: $scope.password,
              passwordConfirmation: $scope.passwordConfirmation,
              round: currentElectionProcedure.round
            }
          };
          
          $scope.isValidAssignmentForm = function(rowId) {
            var formData = $scope.getAssignmentFormData(rowId);
            return (
                formData.volunteerId != null &&
                formData.electionDepartmentId != null &&
                formData.contributionType != null &&
                (formData.contributionCandidateId || formData.contributionType !== 'CANDIDATE_REPRESENTATIVE') &&
                (formData.notify == null || formData.notify === true || (formData.notify === false && formData.username != null && formData.password != null && formData.passwordConfirmation != null))
            );
          };
          
          $scope.contributionTypeChanged = function() {
            if ($scope.contributionType !== ContributionType.COMMITTEE_LEADER.id &&
                $scope.contributionType !== ContributionType.COMMITTEE_LEADER_VICE.id &&
                $scope.contributionType !== ContributionType.ID_VERIFIER.id &&
                $scope.contributionType !== ContributionType.ID_VERIFIER_VICE.id) {
              $scope.sendEmailNotification = false;
              $scope.userCreationOption = UserCreationOption.NO_ACTION;
              $scope.userCreationOptionsDisabled = true;
            } else {
              $scope.userCreationOptionsDisabled = false;
            }
            $scope.contributionCandidateId = null;
          };
          
          $scope.userCreationOptionChanged = function() {
            if ($scope.userCreationOption === UserCreationOption.CREATE_NOW) {
              $scope.username = $scope.volunteer.email;
            }
          };
          
          /**
           * Ένταξη εθελοντή στο επιλεγμένο τμήμα
           */
          $scope.assignVolunteer = function(rowId) {
            if ($scope.isValidAssignmentForm(rowId)) {
              var assignment = $scope.getAssignmentFormData(rowId);
              UsVolunteerService.assignVolunteer(assignment).then(function(data) {
                // Το modal κλείνοντας επιστρέφει το row object του επιλεγμένου τμήματος
                var jqTable = $('#' + $scope.gridId);
                var electionDepartment = ViewJqGridService.getRowObject(jqTable, rowId);
                $modalInstance.close(electionDepartment);
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
              $ngBootbox.alert($translate.instant('us.volunteer.assignment.errors.invalidForm'));
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
              'electionCenterDisplayName',
              'electionDepartmentDisplayName'
            ],
            colModel: [
              { name: 'id', hidden: true },
              { name: 'electionCenterId', hidden: true },
              { name: 'electionCenterCode', index: 'electionCenter.code', sortable: true, editable: false, width: 50 },
              { name: 'electionCenterName', index: 'electionCenter.name', sortable: true, editable: false, width: 100 },
              { name: 'code', index: 'code', sortable: true, editable: false, width: 50 },
              { name: 'name', index: 'name', sortable: true, editable: false, width: 100 },
              { name: 'electionCenterDisplayName', hidden: true },
              { name: 'electionDepartmentDisplayName', hidden: true }
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
            $scope.assignVolunteer(rowId);
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
