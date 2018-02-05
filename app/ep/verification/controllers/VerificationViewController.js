angular.module('app.ep.verification').controller('VerificationViewController', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$state',
  '$translate',
  '$timeout',
  '$window',
  '$ngBootbox',
  '$filter',
  'VerificationService',
  'SuccessErrorService',
  'ViewJqGridService',
  'authService',
  'electionDepartments',
  function ($scope, $rootScope, $stateParams, $state, $translate, $timeout, $window, $ngBootbox, $filter,
            VerificationService, SuccessErrorService, ViewJqGridService, authService, electionDepartments) {
    
    $scope.electionDepartments = electionDepartments;
    
    $scope.hasPermission = function (permission) {
      return authService.hasPermission(permission);
    };
    
    $scope.userElectionDepartmentId = authService.getElectionDepartmentId();
    
    $scope.args = {};
    
    $scope.verify = function() {
  
      if (!$scope.hasPermission('ep.verification')) {
        return;
      }
      
      SuccessErrorService.initialize($scope);
      $scope.searching = true;
      $scope.verificationResult = null;
      $scope.voter = null;
      
      VerificationService.verify($scope.args).$promise
          .then(function(result) {
              $scope.verificationResult = result;
              
              if($scope.verificationResult.hasVoterRecord) {
                //Υπάρχει ψηφίσας
                $scope.hasVotedMessage = $translate.instant('ep.verification.view.alert.hasVoted.message');
                $scope.hasVotedDateTime = $translate.instant('ep.verification.view.alert.hasVoted.dateTime', {voteDateTime: $filter('date')($scope.verificationResult.voteDateTime, 'dd/MM/yyyy HH:mm')});
                $scope.hasVotedElectionDepartmentName = $translate.instant('ep.verification.view.alert.hasVoted.electionDepartmentName', {voteElectionDepartmentName: $scope.verificationResult.voteElectionDepartmentName});
                
                $scope.voter = {
                  id: $scope.verificationResult.voterId,
                  electorId: $scope.verificationResult.electorId,
                  eklSpecialNo: $scope.verificationResult.eklSpecialNo,
                  member: $scope.verificationResult.voterMember,
                  electionDepartmentId: $scope.verificationResult.voterElectionDepartmentId,
                  verificationNumber: $scope.verificationResult.voterVerificationNumber
                };
              }
              else {
                //Δεν υπάρχει ψηφίσας
                $scope.voter = {
                  electorId: $scope.verificationResult.electorId,
                  eklSpecialNo: $scope.verificationResult.eklSpecialNo,
                  member: $scope.verificationResult.preregistrationMember,
                };
                
                if($scope.userElectionDepartmentId) {
                  $scope.voter.electionDepartmentId = $scope.userElectionDepartmentId;
                }
              }
              
              $scope.voter.address = $scope.verificationResult.voterAddress;
              $scope.voter.addressNo = $scope.verificationResult.voterAddressNo;
              $scope.voter.city = $scope.verificationResult.voterCity;
              $scope.voter.postalCode = $scope.verificationResult.voterPostalCode;
              $scope.voter.country = $scope.verificationResult.voterCountry;
              $scope.voter.cellphone = $scope.verificationResult.voterCellphone;
              $scope.voter.email = $scope.verificationResult.voterEmail;
              $scope.voter.idType = $scope.verificationResult.voterIdType;
              $scope.voter.idNumber = $scope.verificationResult.voterIdNumber;
              
              if($scope.verificationResult.hasPreregistrationRecord || $scope.verificationResult.hasVoterRecord) {
                $scope.voter.payment = $scope.verificationResult.voterPayment;
              }
              else {
                $scope.voter.payment = $scope.verificationResult.defaultPayment;
              }
              
          })
          .catch(function(result) {
              SuccessErrorService.apiValidationErrors($scope, result.data);
          })
          .finally(function(result) {
              $scope.searching = false;
          });
    };
    
    $scope.getHasPreregistrationLabel = function() {
      return ($scope.verificationResult && $scope.verificationResult.hasPreregistrationRecord) ? $translate.instant('global.yes') : $translate.instant('global.no');
    };
    
    $scope.clearArguments = function () {
      Object.getOwnPropertyNames($scope.args).forEach(function (val, idx, array) {
        $scope.args[val] = null;
      });
      
      SuccessErrorService.initialize($scope);
      $scope.verificationResult = null;
      $scope.voter = null;
    };
    
    $scope.saveVoter = function() {
  
      if (!$scope.hasPermission('ep.voter')) {
        return;
      }
      
      let successMessage = !$scope.voter.id ? $translate.instant('ep.verification.view.createVoter.success') : $translate.instant('ep.verification.view.updateVoter.success');
      SuccessErrorService.initialize($scope);
      $scope.saveLoading = true;
      
      VerificationService.saveVoter($scope.voter).$promise
          .then(function (result) {
            SuccessErrorService.showSuccess($scope, successMessage);
            $scope.voter = result;
          })
          .catch(function (result) {
            SuccessErrorService.apiValidationErrors($scope, result.data);
          })
          .finally(function (result) {
            $scope.saveLoading = false;
          });
    };
    
    $scope.userNoDepartmentOrInVoterDepartment = function() {
      return (!$scope.userElectionDepartmentId || ($scope.voter.electionDepartmentId === $scope.userElectionDepartmentId));
    };
    
    $scope.undoVoteExecution = function(undoReason) {
      
      if (!$scope.hasPermission('ep.voter.undo')) {
        return;
      }
      
      SuccessErrorService.initialize($scope);
      $scope.undoLoading = true;
      
      VerificationService.undoVote($scope.voter.id, undoReason).$promise
          .then(function (result) {
            SuccessErrorService.showSuccess($scope, $translate.instant('ep.verification.view.undoVote.success'));
            $scope.voter = null;
            $scope.verificationResult = null;
          })
          .catch(function (result) {
            SuccessErrorService.apiValidationErrors($scope, result.data);
          })
          .finally(function (result) {
            $scope.undoLoading = false;
          });
          
    };
    
  }
]);
