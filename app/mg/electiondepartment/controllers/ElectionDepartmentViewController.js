angular.module('app.mg.electiondepartment').controller('ElectionDepartmentViewController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$state',
  '$window',
  '$ngBootbox',
  '$translate',
  '$filter',
  'ElectionDepartmentService',
  'AddContributionService',
  'SuccessErrorService',
  'ElectionCenterService',
  'ContributionType',
  'authService',
  'electionDepartment',
  'currentElectionProcedure',
  'candidates',
  function ($scope, $rootScope, $stateParams, $state, $window, $ngBootbox, $translate, $filter,
            ElectionDepartmentService, AddContributionService, SuccessErrorService, ElectionCenterService, ContributionType,
            authService, electionDepartment, currentElectionProcedure, candidates) {
    
    //View state
    $scope.viewState = 'app.mg.electiondepartment.view';
    
    //Αντικείμενο εγγραφής
    $scope.electionDepartment = electionDepartment;
  
    $scope.hasPermission = function (permission) {
      return authService.hasPermission(permission);
    };
    
    // Ανάκτηση του id του Εκλογικού Κέντρου από το $window.opener
    // εφόσον η καρτέλα έχει ανοιχτεί μέσα από το Ε.Κ.
    // και εφόσον πρόκειται για νέα εγγραφή
    if (!$stateParams.id && $window.opener && $window.opener.electionCenterId) {
      $scope.electionDepartment.electionCenterId = $window.opener.electionCenterId;
    }
    
    //Ανάκτηση στοιχείων γονικού εκλογικού κέντρου
    if($scope.electionDepartment.electionCenterId) {
      ElectionCenterService.getElectionCenterBasic($scope.electionDepartment.electionCenterId).$promise.then(function(result) {
        $scope.parentElectionCenter = result;
      });
    }
    
    //Στη νέα εγγραφή, αρχικοποίηση αύξοντα αριθμού και κωδικού
    if(!$stateParams.id) {
      ElectionDepartmentService.generateSerialNoAndCode($scope.electionDepartment.electionCenterId).$promise.then(function(result) {
        $scope.electionDepartment.serialNo = result.serialNo;
        $scope.electionDepartment.code = result.code;
      });
    }
    
    //Τρέχουσα εκλογική διαδικασία
    $scope.currentElectionProcedure = currentElectionProcedure;
    
    //Υποψήφιοι
    $scope.candidates = candidates;
    
    //Modal εισαγωγής contribution
    $scope.selectedContributionType = null;
    
    $scope.openAddContributionModal = function () {
  
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      
      if(!$scope.selectedContributionType) {
        $ngBootbox.alert($translate.instant('mg.electiondepartment.view.contributions.add.alert.noType'));
      }
      else if($scope.selectedContributionType === 'CANDIDATE_REPRESENTATIVE' && !$scope.selectedContributionCandidateId) {
        $ngBootbox.alert($translate.instant('mg.electiondepartment.view.contributions.add.alert.noCandidate'));
      }
      else {
        AddContributionService.openModal($scope.selectedContributionType, $scope.selectedContributionCandidateId, $scope.electionDepartment, $scope.currentElectionProcedure);
      }
    };
    
    $scope.getContributionTypeText = function (type) {
      return $translate.instant(ContributionType[type].messageKey);
    };
    
    $scope.getCandidateFullName = function(candidateId) {
      if(!candidateId) {
        return '';
      }
      else {
        let matchedCandidates = $filter("filter")($scope.candidates, {id : candidateId});
        return (matchedCandidates && matchedCandidates.length) ? '(' + matchedCandidates[0].lastName + ' ' + matchedCandidates[0].firstName + ')' : '';
      }
    };
    
    $scope.removeContribution = function (contribution) {
  
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      
      //Bootbox επιβεβαίωσης
      $ngBootbox.customDialog({
        message: $translate.instant('mg.electiondepartment.view.contributions.remove.message'),
        className: '',
        buttons: {
          confirm: {
            label: $translate.instant('global.confirm'),
            className: 'btn-success',
            callback: function () {
              //Εύρεση της θέσης του contribution
              var contributionIndex = $scope.electionDepartment.contributions.indexOf(contribution);
              if (contributionIndex > -1) {
                //Αφαίρεση του contribution
                $scope.electionDepartment.contributions.splice(contributionIndex, 1);
              }
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
    
    /*
     * Αποθήκευση
     */
    $scope.saveElectionDepartment = function () {
  
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      
      //Εκκίνηση spinner
      $scope.saveLoading = true;
      
      //Αρχικοποίηση success-error
      SuccessErrorService.initialize($scope);
      
      //Αποθήκευση
      ElectionDepartmentService.saveElectionDepartment($scope.electionDepartment).$promise
          .then(function (result) {
            //Ορισμός αποθηκευμένου αντικειμένου
            $scope.electionDepartment = result;
            
            //Μετάβαση στο state με το νέο id
            $state.go($scope.viewState, {id: $scope.electionDepartment.id}, {notify: false});
            
            //Μήνυμα επιτυχίας
            SuccessErrorService.showSuccess($scope);
            
            //Ορισμός κατάστασης φόρμας σε μη dirty
            $scope.electionDepartmentForm.$dirty = false;
          })
          .catch(function (result) {
            //Μήνυμα σφάλματος
            SuccessErrorService.apiValidationErrors($scope, result.data);
          })
          .finally(function (result) {
            //Σταμάτημα spinner
            $scope.saveLoading = false;
          });
    };
    
    /*
     * Διαγραφή
     */
    $scope.deleteElectionDepartment = function () {
  
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      
      //Bootbox επιβεβαίωσης
      $ngBootbox.customDialog({
        message: $translate.instant('mg.electiondepartment.view.delete.confirmation'),
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
              ElectionDepartmentService.deleteElectionDepartment($scope.electionDepartment.id).$promise
                  .then(function (result) {
                    //Μήνυμα επιτυχίας
                    var successMessage = $translate.instant('mg.electiondepartment.view.delete.success');
                    
                    //Μετάβαση στην καρτέλα του γονικού εκλογικού κέντρου
                    $state.go('app.mg.electioncenter.view', {id: $scope.electionDepartment.electionCenterId, successMessage: successMessage}, {
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
    
    $scope.notifyPendingContribution = function(contribution) {
      if (!$scope.hasPermission('sa.email')) {
        return;
      }
      
      //Bootbox επιβεβαίωσης
      $ngBootbox.customDialog({
        message: $translate.instant('mg.electiondepartment.view.contribution.activate.pending.confirmation'),
        className: '',
        buttons: {
          confirm: {
            label: $translate.instant('global.confirm'),
            className: 'btn-success',
            callback: function () {
              //Εύρεση της θέσης του contribution
              var contributionIndex = $scope.electionDepartment.contributions.indexOf(contribution);
              if (contributionIndex > -1) {
                // Αποστολή ενημερωτικού email
                ElectionDepartmentService.notifyPendingContribution($scope.electionDepartment.id, contribution.id).then(function(data) {
                  SuccessErrorService.showSuccess($scope, $translate.instant('mg.electiondepartment.view.contribution.activate.sentNotification'));
                });
              }
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
    
    $scope.renotifyPendingContribution = function(contribution) {
      if (!$scope.hasPermission('sa.email')) {
        return;
      }
      
      //Bootbox επιβεβαίωσης
      $ngBootbox.customDialog({
        message: $translate.instant('mg.electiondepartment.view.contribution.activate.emailSent.confirmation'),
        className: '',
        buttons: {
          confirm: {
            label: $translate.instant('global.confirm'),
            className: 'btn-success',
            callback: function () {
              //Εύρεση της θέσης του contribution
              var contributionIndex = $scope.electionDepartment.contributions.indexOf(contribution);
              if (contributionIndex > -1) {
                // Αποστολή ενημερωτικού email
                ElectionDepartmentService.renotifyPendingContribution($scope.electionDepartment.id, contribution.id).then(function(data) {
                  SuccessErrorService.showSuccess($scope, $translate.instant('mg.electiondepartment.view.contribution.activate.sentNotification'));
                });
              }
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
    
    $scope.notifyPendingContributionsByElectionDepartment = function(contribution) {
    	  if (!$scope.hasPermission('sa.email')) {
    	    return;
    	  }
    	  
    	  //Bootbox επιβεβαίωσης
    	  $ngBootbox.customDialog({
    	    message: $translate.instant('mg.electiondepartment.view.contribution.activate.pending.all.confirmation'),
    	    className: '',
    	    buttons: {
    	      confirm: {
    	        label: $translate.instant('global.confirm'),
    	        className: 'btn-success',
    	        callback: function () {
    	          ElectionDepartmentService.notifyPendingContributionsByElectionDepartment($scope.electionDepartment.id).then(function(data) {
    	            
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
  }
]);
