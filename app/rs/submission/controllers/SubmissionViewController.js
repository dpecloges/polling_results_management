angular.module('app.rs.submission').controller('SubmissionViewController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$state',
  '$translate',
  '$timeout',
  '$window',
  '$ngBootbox',
  '$http',
  'FileSaver',
  'authService',
  'SuccessErrorService',
  'ResultService',
  'VerificationService',
  'electionDepartment',
  'electionDepartments',
  'currentElectionProcedure',
  'AttachmentType',
  function($scope, $rootScope, $stateParams, $state, $translate, $timeout, $window, $ngBootbox, $http, FileSaver, authService,
      SuccessErrorService, ResultService, VerificationService, electionDepartment, electionDepartments, currentElectionProcedure, AttachmentType) {

    $scope.hasPermission = permission => authService.hasPermission(permission);
    
    // Τρέχουσα εκλογική διαδικασία
    $scope.currentElectionProcedure = currentElectionProcedure;

    $scope.userHasElectionDepartment = !!authService.getElectionDepartmentId();
    $scope.electionDepartment = electionDepartment;
    $scope.electionDepartments = electionDepartments;
    $scope.AttachmentType = AttachmentType;

    // Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }
    
    // Ανάκτηση αριθμού διαπιστευμένων
    if (electionDepartment.id) {
      VerificationService.getVoterCount(electionDepartment.id)
        .then(({ count, allowsInconsistentSubmission }) => {
          $scope.voterCount = count;
          $scope.allowsInconsistentSubmission = allowsInconsistentSubmission;
        })
        .catch(({ data }) => {
          SuccessErrorService.apiValidationErrors($scope, data);
        });
    }
    
    /**
     * Υπολογισμός έγκυρων (= ψηφίσαντες - άκυρα + λευκά).
     * Γίνεται χρήση της $timeout ώστε να λαμβάνονται υπόψιν
     * όλες οι ανανεωμένες τιμές.
     *
     * @return {Number} Σύνολο έγκυρων ψήφων
     */
    $scope.calculateValidVotes = () => {
      $timeout(() => {
        $scope.electionDepartment.validVotes = Number($scope.electionDepartment.totalVotes) -
          Number($scope.electionDepartment.invalidVotes) -
          Number($scope.electionDepartment.whiteVotes);
      });
    };

    /**
     * Αποστολή Αποτελεσμάτων
     */
    $scope.submit = () => {
      if (!$scope.hasPermission('rs.submission')) {
        return;
      }
      
      if (!$scope.electionDepartment.attachmentName) {
        // Bootbox επιβεβαίωσης
        $ngBootbox.customDialog({
          message: $translate.instant('rs.submission.view.confirmSubmit'),
          className: '',
          buttons: {
            confirm: {
              label: $translate.instant('global.confirm'),
              className: 'btn-success',
              callback() {
                $scope.save();
              }
            },
            cancel: {
              label: $translate.instant('global.cancel'),
              className: 'btn-danger',
            }
          }
        });
      } else {
        $scope.save();
      }
    };
    
    /**
     * Αποθήκευση Αποτελεσμάτων
     */
    $scope.save = () => {
      if (!$scope.hasPermission('rs.submission')) {
        return;
      }
      
      if (!$scope.allowsInconsistentSubmission && $scope.voterCount !== Number($scope.electionDepartment.totalVotes)) {
        SuccessErrorService.showError($scope, $translate.instant('rs.submission.view.error.inconsistentVotes'));
        return;
      }
      
      $scope.saveLoading = true;
      SuccessErrorService.initialize($scope);

      // Αποθήκευση
      ResultService.save($scope.electionDepartment)
        .then(electionDepartment => {
          $scope.electionDepartment = electionDepartment;
          SuccessErrorService.showSuccess($scope);

          // Ορισμός κατάστασης φόρμας σε μη dirty
          $scope.electionDepartmentForm.$dirty = false;
        })
        .catch(({ data }) => {
          SuccessErrorService.apiValidationErrors($scope, data);
        })
        .finally(() => {
          $scope.saveLoading = false;
        });
    };

    $scope.setElectionDepartment = id => {
      if (id) {
        ResultService.get(id)
          .then(electionDepartment => {
            $scope.electionDepartment = electionDepartment;
          })
          .catch(({ data }) => {
            SuccessErrorService.apiValidationErrors($scope, data);
          });
          
        VerificationService.getVoterCount(id)
          .then(({ count, allowsInconsistentSubmission }) => {
            $scope.voterCount = count;
            $scope.allowsInconsistentSubmission = allowsInconsistentSubmission;
          })
          .catch(({ data }) => {
            SuccessErrorService.apiValidationErrors($scope, data);
          });
      }
    };

    $scope.onUploadStart = attachmentType => {
      SuccessErrorService.initialize($scope);
      
      switch (attachmentType) {
        case AttachmentType.RESULTS:
          $scope.uploadingAccessFile1 = true;
          break;
        case AttachmentType.CASHIER:
          $scope.uploadingAccessFile2 = true;
          break;
      }
    };

    $scope.onUploadSuccess = ({ data }) => {
      SuccessErrorService.showSuccess($scope, data.success);
      ResultService.get($scope.electionDepartment.id)
        .then(({ attachmentName, attachmentTwoName }) => {
          $scope.electionDepartment.attachmentName = attachmentName;
          $scope.electionDepartment.attachmentTwoName = attachmentTwoName;
        });
    };

    $scope.onUploadError = ({ data }) => {
      SuccessErrorService.apiValidationErrors($scope, data);
    };

    $scope.onUploadComplete = attachmentType => {
      switch (attachmentType) {
        case AttachmentType.RESULTS:
          $scope.uploadingAccessFile1 = false;
          break;
        case AttachmentType.CASHIER:
          $scope.uploadingAccessFile2 = false;
          break;
      }
    };
    
    $scope.downloadFile = attachmentType => {
      if (!$scope.hasPermission('rs.submission')) {
        return;
      }
      
      $http({
        url: `${$rootScope.resultsDownloadFile}/${$scope.electionDepartment.id}/${attachmentType}`,
        method: 'GET',
        responseType: 'arraybuffer'
      })
      .then(({ data }) => {
        const file = new Blob([data], { type: 'text/plain' });
        
        switch (attachmentType) {
          case AttachmentType.RESULTS:
            FileSaver.saveAs(file, $scope.electionDepartment.attachmentName);
            break;
          case AttachmentType.CASHIER:
            FileSaver.saveAs(file, $scope.electionDepartment.attachmentTwoName);
            break;
        }
      })
      .catch(response => {
        if (response && response.data) {
          const responseDataView = new DataView(response.data);
          const decoder = new TextDecoder('utf-8');
          const responseDataString = decoder.decode(responseDataView);
          const responseData = JSON.parse(responseDataString);
          SuccessErrorService.apiValidationErrors(scope, responseData);
        }
      });
    };

  }
]);
