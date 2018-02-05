angular.module('app.us.volunteer').controller('VolunteerListController', [
  '$rootScope',
  '$scope',
  '$translate',
  '$stateParams',
  '$compile',
  '$ngBootbox',
  'ViewJqGridService',
  'SuccessErrorService',
  'authService',
  'DisplayResultOption',
  'currentElectionProcedure',
  'UsVolunteerService',
  'VolunteerAssignmentDialog',
  'NotifyAllVolunteersDialog',
  'ManualUserCreationDialog',
  'VolunteerReassignmentDialog',
  function(
    $rootScope, $scope, $translate, $stateParams, $compile, 
    $ngBootbox, ViewJqGridService, SuccessErrorService, authService, DisplayResultOption, 
    currentElectionProcedure, UsVolunteerService, VolunteerAssignmentDialog, NotifyAllVolunteersDialog, ManualUserCreationDialog,
    VolunteerReassignmentDialog) {

    $scope.DisplayResultOption = DisplayResultOption;
    
    $scope.gridId = 'usVolunteerListGrid';
    $scope.gridPagerId = 'usVolunteerListGrid-pager';
    $scope.gridSelector = '#' + $scope.gridId;
    $scope.gridPagerSelector = '#' + $scope.gridPagerId;
    
    $scope.hasPermission = function(permission) {
      return authService.hasPermission(permission);
    };
    
    $scope.departmentFiltersDisabled = true;

    // Παρακολούθηση για σφάλματα στο $rootScope.errorList.
    $rootScope.$watch('errorList', function() {
      SuccessErrorService.onRootScopeError($scope, $rootScope.errorList);
    }, true);
    
    // Απενεργοποίηση και καθαρισμός φίλτρων ΕΤ αν το contributionAssigned δεν είναι true
    $scope.contributionAssignedChanged = function() {
      if ($scope.args.contributionAssigned) {
        $scope.departmentFiltersDisabled = false;
      } else {
        $scope.departmentFiltersDisabled = true;
        $scope.clearDepartmentArguments();
      }
    };
    
    /*
     * Εμφάνιση μηνύματος επιτυχίας αν υπάρχει στα stateParams
     */
    if ($stateParams.successMessage) {
      SuccessErrorService.showSuccess($scope, $stateParams.successMessage);
    }
    
    // Label για την επιλογή 'Όλα' των select menus
    var allOptionName = $translate.instant('global.all');
    
    // Γενική τοποθεσία ΕΤ (Ελλάδα, εξωτερικό)
    $scope.departmentLocations = [
      {
        id: DisplayResultOption.ALL,
        name: $translate.instant('rs.display.view.args.all'),
      },
      {
        id: DisplayResultOption.GREECE,
        name: $translate.instant('rs.display.view.args.greece'),
      },
      {
        id: DisplayResultOption.ABROAD,
        name: $translate.instant('rs.display.view.args.abroad'),
      }
    ];
    // Default επιλογή γενικής τοποθεσίας
    $scope.departmentLocation = DisplayResultOption.GREECE;
    
    // Επιλογές ανάθεσης εθελοντή σε τμήμα (contributionAssigned) 
    var ContributionAssignedOption = {
        ALL: '',
        YES: true,
        NO: false
    };
    $scope.contributionAssignedOptions = [
      {id: ContributionAssignedOption.ALL, name: $translate.instant('us.volunteer.list.args.contributionAssigned.ALL')},
      {id: ContributionAssignedOption.YES, name: $translate.instant('us.volunteer.list.args.contributionAssigned.YES')},
      {id: ContributionAssignedOption.NO, name: $translate.instant('us.volunteer.list.args.contributionAssigned.NO')}
    ];
    
    $scope.showAdminUnit = true;
    
    // Labels τιμών για την κατάσταση ενεργοποίησης χρήστη (contributionStatus)
    var contributionStatuses = ['WITHOUT_ACCESS', 'PENDING' , 'EMAIL_SENT' ,'REGISTRATION_COMPLETED'];
    var _contributionStatusOptions = [{id: '', name: allOptionName}];
    var contributionStatusNames = {};
    contributionStatuses.forEach((st) => {
      contributionStatusNames[st] = $translate.instant('us.volunteer.list.grid.contributionStatus.' + st);
      _contributionStatusOptions.push({id: st, name: contributionStatusNames[st]});
    });
    $scope.contributionStatusOptions = _contributionStatusOptions;
    var contributionStatusFormatter = (val, opts, row) => contributionStatusNames[val] || ''; 
    
    // Labels τιμών για τον τύπο μέλους ΕΤ (contributionType)
    var contributionTypes = ['CANDIDATE_REPRESENTATIVE', 'COMMITTEE_LEADER', 'COMMITTEE_LEADER_VICE', 'COMMITTEE_MEMBER', 'ID_VERIFIER', 'ID_VERIFIER_VICE', 'TREASURER'];
    var _contributionTypeOptions = [{id: '', name: allOptionName}];
    var contributionTypeNames = {};
    contributionTypes.forEach((type) => {
      contributionTypeNames[type] = $translate.instant('us.volunteer.list.grid.contributionType.' + type);
      _contributionTypeOptions.push({id: type, name: contributionTypeNames[type]});
    });
    $scope.contributionTypeOptions = _contributionTypeOptions;
    var contributionTypeFormatter = (val, opts, row) => contributionTypeNames[val] || '';
    
    // Formatter για στήλες με τιμές ναι/όχι  
    var booleanFormatter = (val, opts, row) => $translate.instant('common.args.' + (val? 'yes': 'no'));
    
    // Default τιμές κριτηρίων / αρχικοποίηση chosen components για την αποφυγή σφάλματος τύπου off-by-one
    $scope.args = {
        contributionAssigned: ContributionAssignedOption.NO,
        contributionStatus: '',
        contributionType: '',
        foreign: false
    };
    
    // Extra actions στο επίπεδο γραμμής του grid
    var extraActions = ['assign', 'unassign', 'reassign', 'notify', 'notifyAgain', 'viewUser', 'createUser'];
    // Αρχικοποίηση των tooltips, για να μην παράγονται εκ νέου σε κάθε γραμμή
    var extraActionTooltips = {};
    extraActions.forEach((action) => { extraActionTooltips[action] = $translate.instant('us.volunteer.list.grid.extraActions.' + action) });
    // Formatter της στήλης "extraActions" με χρήση του οποίου γίνεται η προβολή των διαθέσιμων επιλογών γραμμής
    var extraActionsFormatter = function(cellvalue, options, rowObject) {
      
      var tooltip = '';
      var icon = '';
      var linkAction = '';
      
      if (!rowObject.electionDepartmentId && $scope.hasPermission('mg.electiondepartment')) {
        tooltip = extraActionTooltips['assign'];
        linkAction = `ng-click="assignVolunteer(${rowObject.id})"`;
        icon = 'plus';
      } else if (rowObject.contributionStatus === 'PENDING' && $scope.hasPermission('sa.email')) {
        tooltip = extraActionTooltips['notify'];
        linkAction = `ng-click="notifyVolunteer(${rowObject.id})"`;
        icon = 'send-o';
      } else if (rowObject.contributionStatus === 'EMAIL_SENT' && $scope.hasPermission('sa.email')) {
        tooltip = extraActionTooltips['notifyAgain'];
        linkAction = `ng-click="notifyVolunteer(${rowObject.id})"`;
        icon = 'send-o';
      }
      
      var addUnassignAction = rowObject.electionDepartmentId != null;
      var addReassignAction = rowObject.electionDepartmentId != null;
      var addCreateUserAction = rowObject.electionDepartmentId &&
          (rowObject.contributionStatus === 'PENDING' || rowObject.contributionStatus === 'EMAIL_SENT');
  
      var extraActionsHtml = '';
      
      if (linkAction) {
        var extraActionsHtml =
            `<a class="btn btn-link" style="padding:0;" ${linkAction}>
           <i class="fa fa-${icon}" style="font-size:18px;" tooltip="${tooltip}" tooltip-placement="right"></i>
         </a>&nbsp;`;
      }
      
      if (addUnassignAction && $scope.hasPermission('mg.electiondepartment')) {
        extraActionsHtml += 
        `&nbsp;<a class="btn btn-link" style="padding:0;" ng-click="unassignVolunteer(${rowObject.id})">
           <i class="fa fa-undo" style="font-size:18px; color: gray" tooltip="${extraActionTooltips.unassign}" tooltip-placement="right"></i>
         </a>&nbsp;`;
      }
      
      if (addReassignAction && $scope.hasPermission('mg.electiondepartment')) {
        extraActionsHtml += 
        `&nbsp;<a class="btn btn-link" style="padding:0;" ng-click="reassignVolunteer(${rowObject.id})">
           <i class="fa fa-exchange" style="font-size:18px; " tooltip="${extraActionTooltips.reassign}" tooltip-placement="right"></i>
         </a>&nbsp;`;
      }
      
      if (addCreateUserAction && $scope.hasPermission('sa.user')) {
        extraActionsHtml += 
        `&nbsp;<a class="btn btn-link" style="padding:0;" ng-click="manuallyCreateUser(${rowObject.id})">
           <i class="fa fa-user-plus" style="font-size:18px;" tooltip="${extraActionTooltips.createUser}" tooltip-placement="right"></i>
         </a>&nbsp;`;
      }
      
      return extraActionsHtml;
    };
    
    /**
     * Αλλαγές στα φίλτρα κατά την αλλαγή του φίλτρου γενικής τοποθεσίας.
     */
    $scope.departmentLocationOptionsChanged = option => {
      
      switch (option) {
        case DisplayResultOption.GREECE:
          $scope.showAdminUnit = true;
          $scope.args.foreign = false;
          break;
        case DisplayResultOption.ABROAD:
          $scope.showAdminUnit = true;
          $scope.args.foreign = true;
          break;
        case DisplayResultOption.ALL:
          $scope.args.foreign = null;
        case '':
        default:
          $scope.showAdminUnit = false;
      }
      
      $scope.clearAdminUnit();
    };

    $scope.gridData = {
      caption: $translate.instant('global.grid.caption'),
      url: $rootScope.usVolunteerIndexUrl,
      excelUrl: $rootScope.usVolunteerExcelUrl,
      shrinkToFit: false,
      colNames: [
        'id',
        'electionCenterId',
        'electionDepartmentId',
        'identifier',
        $translate.instant('global.grid.actions'),
        
        $translate.instant('common.lastName'),
        $translate.instant('common.firstName'),
        $translate.instant('common.email'),
        $translate.instant('common.eklSpecialNo'),
        $translate.instant('us.volunteer.list.grid.electionCenterCode'),
        
        $translate.instant('us.volunteer.list.grid.electionCenterName'),
        $translate.instant('us.volunteer.list.grid.electionDepartmentCode'),
        $translate.instant('us.volunteer.list.grid.electionDepartmentName'),
        $translate.instant('us.volunteer.list.grid.contributionType'),
        $translate.instant('us.volunteer.list.grid.contributionStatus'),
        
        $translate.instant('us.volunteer.list.grid.emailSentDate'),
        $translate.instant('us.volunteer.list.grid.registrationDate'),  
        $translate.instant('us.volunteer.list.grid.foreign'),
        $translate.instant('common.foreignCountry'),
        $translate.instant('common.foreignCity'),
        
        $translate.instant('common.geographicalUnit'),
        $translate.instant('common.decentralAdmin'),
        $translate.instant('common.region'),
        $translate.instant('common.regionalUnit'),
        $translate.instant('common.municipality'),
        
        $translate.instant('common.municipalUnit'),
        'electionCenterDisplayName',
        'electionDepartmentDisplayName'
      ],
      colModel: [
        { name: 'id', hidden: true },
        { name: 'electionCenterId', hidden: true },
        { name: 'electionDepartmentId', hidden: true },
        { name: 'identifier', hidden: true },
        { name: 'extraActions', sortable: false, fixed: true, align: 'center', width: 100, formatter: extraActionsFormatter },
        { name: 'lastName', index: 'lastName', sortable: true, editable: false, width: 150 },
        { name: 'firstName', index: 'firstName', sortable: true, editable: false, width: 150 },
        { name: 'email', index: 'email', sortable: true, editable: false, width: 150 },
        { name: 'eklSpecialNo', index: 'eklSpecialNo', sortable: true, editable: false, width: 150 },
        { name: 'electionCenterCode', index: 'electionCenterCode', sortable: true, editable: false, width: 100 },
        { name: 'electionCenterName', index: 'electionCenterName', sortable: true, editable: false, width: 200 },
        { name: 'electionDepartmentCode', index: 'electionDepartmentCode', sortable: true, editable: false, width: 100 },
        { name: 'electionDepartmentName', index: 'electionDepartmentName', sortable: true, editable: false, width: 200 },
        { name: 'contributionType', index: 'contributionType', sortable: true, editable: false, width: 100, formatter: contributionTypeFormatter },
        { name: 'contributionStatus', index: 'contributionStatus', sortable: true, editable: false, width: 150, formatter: contributionStatusFormatter },
        { name: 'emailSentDate', index: 'emailSentDate', sortable: true, editable: false, width: 150 },
        { name: 'registrationDate', index: 'registrationDate', sortable: true, editable: false, width: 150 },
        { name: 'foreign', index: 'foreign', sortable: true, editable: false, align: 'center', width: 150, formatter: booleanFormatter },
        { name: 'foreignCountry', index: 'foreignCountry', sortable: true, editable: false, width: 150 },
        { name: 'foreignCity', index: 'foreignCity', sortable: true, editable: false, width: 150 },
        { name: 'geographicalUnit', index: 'geographicalUnit', sortable: true, editable: false, width: 150 },
        { name: 'decentralAdmin', index: 'decentralAdmin', sortable: true, editable: false, width: 150 },
        { name: 'region', index: 'region', sortable: true, editable: false, width: 150 },
        { name: 'regionalUnit', index: 'regionalUnit', sortable: true, editable: false, width: 150 },
        { name: 'municipality', index: 'municipality', sortable: true, editable: false, width: 150 },
        { name: 'municipalUnit', index: 'municipalUnit', sortable: true, editable: false, width: 150 },
        { name: 'electionCenterDisplayName', hidden: true },
        { name: 'electionDepartmentDisplayName', hidden: true }
      ],
      sortname: 'lastName',
      sortorder: 'asc'
    };

    var processGridArgs = function() {
      var unprocessedArgs = ['contributionAssigned', 'foreign'];
      var processedArgs = {};
      Object.getOwnPropertyNames($scope.args).forEach(val => {
        if (unprocessedArgs.includes(val)) {
          processedArgs[val] = $scope.args[val];
        } else {
          processedArgs[val] = $scope.args[val] || null;
        }
      });
      
      return processedArgs;
    };
    
    // Συνάρτηση που επιστρέφει το αντικείμενο παραμέτρων για το export σε excel
    $scope.exportArgs = function() {
      return processGridArgs();
    };
    
    $scope.retrieveGridData = function() {
      if (!$scope.hasPermission('ext.volunteer')) {
        return;
      }
      $scope.startIndexLoading();
      ViewJqGridService.retrieveData($($scope.gridSelector), processGridArgs());
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
      $compile(angular.element($scope.gridSelector + ' td[aria-describedby=usVolunteerListGrid_extraActions] a'))($scope);
      $scope.indexLoading = false;
      
      
    };
    
    $scope.onGridInit = function() {
      var jqTable = $('#' + $scope.gridId);
      var notifyAllButton = {
          id: 'notifyall',
          buttonicon: 'fa fa-send-o blueColor',
          tooltip: $translate.instant('us.volunteer.list.grid.notifyall'),
          onClickButton: $scope.notifyAll
      };
      if ($scope.hasPermission('sa.email')) {
        ViewJqGridService.addNavButton(jqTable, notifyAllButton);
      }
    };

    /**
     * Εμφάνιση σφάλματος στην ανάκτηση των εγγραφών του ευρετηρίου
     */
    $scope.errorIndexLoading = function() {
      $scope.indexLoading = false;
    };
    
    $scope.setClear = adminUnitFn => {
      $scope.clearAdminUnit = adminUnitFn;
    };
    
    // Καθαρισμός των φίλτρων που αφορούν αποκλειστικά εθελοντές ενταγμένους σε τμήματα
    $scope.clearDepartmentArguments = () => {
      $scope.clearAdminUnit();
      $scope.args.contributionType = '';
      $scope.args.contributionStatus = '';
    };
    
    $scope.clearArguments = () => {
      Object.getOwnPropertyNames($scope.args).forEach(val => {
        $scope.args[val] = null;
      });
      $scope.args.contributionAssigned = ContributionAssignedOption.NO;
      $scope.args.contributionType = '';
      $scope.args.contributionStatus = '';
      $scope.args.foreign = false;
      
      $scope.clearAdminUnit();
      $scope.showAdminUnit = true;
      $scope.departmentLocation = DisplayResultOption.GREECE;
    };
    
    $scope.assignVolunteer = function(rowId) {
  
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      
      var jqTable = $('#' + $scope.gridId);
      var volunteer = ViewJqGridService.getRowObject(jqTable, rowId);
      
      var assignmentDialog = VolunteerAssignmentDialog.open(volunteer, currentElectionProcedure);
      assignmentDialog.result.then((electionDepartment) => { 
          ViewJqGridService.reloadGrid(jqTable);
          var assignment = angular.extend({}, volunteer);
          assignment.electionCenterId = electionDepartment.electionCenterId;
          assignment.electionCenterCode = electionDepartment.electionCenterCode;
          assignment.electionCenterName = electionDepartment.electionCenterName;
          assignment.electionDepartmentId = electionDepartment.id;
          assignment.electionDepartmentCode = electionDepartment.code;
          assignment.electionDepartmentName = electionDepartment.name;
          assignment.electionCenterDisplayName = electionDepartment.electionCenterDisplayName;
          assignment.electionDepartmentDisplayName = electionDepartment.electionDepartmentDisplayName;
          SuccessErrorService.showSuccess($scope, $translate.instant('us.volunteer.list.grid.extraActions.assign.success', assignment));
        });
    };
    
    var doUnassignVolunteer = function(rowId) {
  
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      
      var jqTable = $('#' + $scope.gridId);
      var volunteer = ViewJqGridService.getRowObject(jqTable, rowId);
      
      UsVolunteerService.unassignVolunteer(rowId).then(function(data) {
        ViewJqGridService.reloadGrid(jqTable);
        SuccessErrorService.showSuccess($scope, $translate.instant('us.volunteer.list.grid.extraActions.unassign.success', volunteer));
      }).catch(function(result) {
        SuccessErrorService.apiValidationErrors($scope, result.data);
      });
      
    };
    
    var doNotifyVolunteer = function(rowId) {
  
      if (!$scope.hasPermission('sa.email')) {
        return;
      }
      
      var jqTable = $('#' + $scope.gridId);
      var volunteer = ViewJqGridService.getRowObject(jqTable, rowId);
      
      UsVolunteerService.notifyVolunteer(rowId).then(function(data) {
        ViewJqGridService.reloadGrid(jqTable);
        SuccessErrorService.showSuccess($scope, $translate.instant('us.volunteer.list.grid.extraActions.notify.success', volunteer));
      }).catch(function(result) {
        SuccessErrorService.apiValidationErrors($scope, result.data);
      });
      
    }; 
    
    var confirmAndDo = function(messageKey, fn, rowId) {
      
      var jqTable = $('#' + $scope.gridId);
      var volunteer = ViewJqGridService.getRowObject(jqTable, rowId);
      
      //Bootbox επιβεβαίωσης
      $ngBootbox.customDialog({
        message: $translate.instant(messageKey, volunteer),
        buttons: {
          confirm: {
            label: $translate.instant('global.confirm'),
            className: 'btn-success',
            callback: function () {
              fn(rowId);
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
    
    $scope.unassignVolunteer = function(rowId) {
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      confirmAndDo('us.volunteer.list.grid.extraActions.unassign.confirm', doUnassignVolunteer, rowId);
    };
    
    $scope.notifyVolunteer = function(rowId) {
      if (!$scope.hasPermission('sa.email')) {
        return;
      }
      confirmAndDo('us.volunteer.list.grid.extraActions.notify.confirm', doNotifyVolunteer, rowId);
    };
    
    $scope.notifyAll = function() {
      if (!$scope.hasPermission('sa.email')) {
        return;
      }
      var notifyAllDialog = NotifyAllVolunteersDialog.open();
      
      notifyAllDialog.result.then(function(response) {
        var pending = response.pending;
        var notified = response.notified;
        UsVolunteerService.notifyAllVolunteers(pending, notified);
      })
      
    };
    
    $scope.manuallyCreateUser = function(rowId) {
  
      if (!$scope.hasPermission('sa.user')) {
        return;
      }
      
      var jqTable = $('#' + $scope.gridId);
      var volunteer = ViewJqGridService.getRowObject(jqTable, rowId);
      var manualUserCreationDialog = ManualUserCreationDialog.open(volunteer);
      
      manualUserCreationDialog.result.then(function(response) {
        ViewJqGridService.reloadGrid(jqTable);
        SuccessErrorService.showSuccess($scope, $translate.instant('us.volunteer.list.grid.extraActions.createUser.success', volunteer));
      })
      
    };
    
    $scope.reassignVolunteer = function(rowId) {
  
      if (!$scope.hasPermission('mg.electiondepartment')) {
        return;
      }
      
      var jqTable = $('#' + $scope.gridId);
      var volunteer = ViewJqGridService.getRowObject(jqTable, rowId);
      
      var reassignmentDialog = VolunteerReassignmentDialog.open(volunteer, currentElectionProcedure);
      reassignmentDialog.result.then((toElectionDepartment) => { 
          ViewJqGridService.reloadGrid(jqTable);
          var assignment = angular.extend({}, volunteer);
          assignment.electionCenterId = toElectionDepartment.electionCenterId;
          assignment.electionCenterCode = toElectionDepartment.electionCenterCode;
          assignment.electionCenterName = toElectionDepartment.electionCenterName;
          assignment.electionDepartmentId = toElectionDepartment.id;
          assignment.electionDepartmentCode = toElectionDepartment.code;
          assignment.electionDepartmentName = toElectionDepartment.name;
          SuccessErrorService.showSuccess($scope, $translate.instant('us.volunteer.list.grid.extraActions.reassign.success', assignment));
        });
    };
    
  }
]);
