angular.module('app').factory('startupService', [
  '$rootScope',
  '$location',
  '$state',
  '$log',
  'authService',
  function ($rootScope, $location, $state, $log, authService) {
    
    var startupFactory = {};
    
    var _initialize = function () {
      
      //Ορισμός urls
      registerUrls();
      
      //Default μηνύματα validation
      registerDefaultValidationMessages();
      
      //Custom validators
      registerCustomValidators();
      
      //Get ids for standard records
      registerStandardRecordsIds();
      
      //Αρχικοποίηση λίστας σφαλμάτων του rootScope
      registerRootErrorList();
      
      //Αρχικοποίηση event που σχετίζονται με το Routing της εφαρμογής
      registerStateEventListeners();
    };
    
    function registerUrls() {
      
      // Εκλογικές Διαδικασίες
      $rootScope.electionProcedureCurrentUrl = $rootScope.baseUrl + '/dpelapi/mg/electionprocedure/current';
      
      // Εκλογικά Κέντρα
      $rootScope.electionCenterIndexUrl = $rootScope.baseUrl + '/dpelapi/mg/electioncenter/index';
      $rootScope.electionCenterExcelUrl = $rootScope.baseUrl + '/dpelapi/mg/electioncenter/excel';
      $rootScope.electionCenterFindUrl = $rootScope.baseUrl + '/dpelapi/mg/electioncenter/find/:id';
      $rootScope.electionCenterSaveUrl = $rootScope.baseUrl + '/dpelapi/mg/electioncenter/save';
      $rootScope.electionCenterDeleteUrl = $rootScope.baseUrl + '/dpelapi/mg/electioncenter/delete/:id';
      $rootScope.electionCenterFindBasicUrl = $rootScope.baseUrl + '/dpelapi/mg/electioncenter/findbasic/:id';
      $rootScope.electionCenterFindAllUrl = $rootScope.baseUrl + '/dpelapi/mg/electioncenter/findall';
      
      // Εκλογικά Τμήματα
      $rootScope.electionDepartmentFindUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/find/:id';
      $rootScope.electionDepartmentFindAllUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/findall';
      $rootScope.electionDepartmentFindByElectionCenterUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/find/electioncenter/:id';
      $rootScope.electionDepartmentSaveUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/save';
      $rootScope.electionDepartmentDeleteUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/delete/:id';
      $rootScope.electionDepartmentIndexUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/index';
      $rootScope.electionDepartmentGenerateSerialNoAndCodeUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/generateserialnoandcode/:electionCenterId';
      $rootScope.electionDepartmentByVolunteerUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/volunteer/:id/round/:round';
      $rootScope.electionDepartmentFullIndexUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/fullindex';
      $rootScope.electionDepartmentExcelUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/excel';
      $rootScope.electionDepartmentResultsIndexUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/resultsindex';
      $rootScope.electionDepartmentResultsExcelUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/resultsexcel';
      $rootScope.notifyPendingContributionUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/:electionDepartmentId/contribution/pending/:contributionId/notify';
      $rootScope.renotifyPendingContributionUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/:electionDepartmentId/contribution/pending/:contributionId/renotify';
      $rootScope.notifyPendingContributionsByElectionDepartmentUrl = $rootScope.baseUrl + '/dpelapi/mg/electiondepartment/:electionDepartmentId/contribution/pending/notify';
      
      // Εθελοντές
      $rootScope.volunteerIndexUrl = $rootScope.baseUrl + '/dpelapi/ext/volunteer/index';
      
      // Περιοχές
      $rootScope.adminUnitFindAllUrl = $rootScope.baseUrl + '/dpelapi/common/adminunits/findall';
      
      // Χώρες
      $rootScope.countryFindAllUrl = $rootScope.baseUrl + '/dpelapi/common/countries/findall';
      
      // Διαπίστευση
      $rootScope.verificationVerifyUrl = $rootScope.baseUrl + '/dpelapi/ep/verification/verify';
      $rootScope.verificationSaveVoterUrl = $rootScope.baseUrl + '/dpelapi/ep/verification/savevoter';
      $rootScope.verificationUndoVoteUrl = $rootScope.baseUrl + '/dpelapi/ep/verification/undovote';
      $rootScope.voterCountUrl = $rootScope.baseUrl + '/dpelapi/ep/verification/votercount';
      
      // Υποψήφιοι
      $rootScope.candidateFindAllUrl = $rootScope.baseUrl + '/dpelapi/rs/candidates/findall';
      $rootScope.candidateFindByElectionProcedureUrl = $rootScope.baseUrl + '/dpelapi/rs/candidates/findcurrent';
      
      // Αποτελέσματα
      $rootScope.resultsSaveUrl = $rootScope.baseUrl + '/dpelapi/rs/submission/save/results';
      $rootScope.resultsFindUrl = $rootScope.baseUrl + '/dpelapi/rs/submission/find/results/:id';
      $rootScope.resultsUploadFile = $rootScope.baseUrl + '/dpelapi/rs/submission/upload';
      $rootScope.resultsDownloadFile = $rootScope.baseUrl + '/dpelapi/rs/submission/download';
      $rootScope.searchResultsUrl = $rootScope.baseUrl + '/dpelapi/rs/result/search';
      $rootScope.scheduleResultsUrl = $rootScope.baseUrl + '/dpelapi/rs/result/schedule';
      $rootScope.unscheduleResultsUrl = $rootScope.baseUrl + '/dpelapi/rs/result/unschedule';
      $rootScope.resultsJobStatusUrl = $rootScope.baseUrl + '/dpelapi/rs/result/jobstatus';
  
      // Πρόοδος Εκλογικής Διαδικασίας
      $rootScope.searchSnapshotsUrl = $rootScope.baseUrl + '/dpelapi/ep/snapshot/search';
      $rootScope.findAllSnapshotsUrl = $rootScope.baseUrl + '/dpelapi/ep/snapshot/findall';
      $rootScope.scheduleSnapshotsUrl = $rootScope.baseUrl + '/dpelapi/ep/snapshot/schedule';
      $rootScope.unscheduleSnapshotsUrl = $rootScope.baseUrl + '/dpelapi/ep/snapshot/unschedule';
      $rootScope.snapshotsJobStatusUrl = $rootScope.baseUrl + '/dpelapi/ep/snapshot/jobstatus';
      
      // Στατιστικά
      $rootScope.statisticsIndexUrl = $rootScope.baseUrl + '/dpelapi/ep/snapshot/statistics/index';
      $rootScope.statisticsExcelUrl = $rootScope.baseUrl + '/dpelapi/ep/snapshot/statistics/excel';
      
      // Εγγραφή Χρήστη
      $rootScope.registrationFindUrl = $rootScope.baseUrl + '/dpelapi/auth/registration/find/:identifier';
      $rootScope.registrationRegisterUrl = $rootScope.baseUrl + '/dpelapi/auth/registration/register';
      
      // Εθελοντές
      $rootScope.usVolunteerIndexUrl = $rootScope.baseUrl + '/dpelapi/us/volunteer/index';
      $rootScope.usVolunteerAssignUrl = $rootScope.baseUrl + '/dpelapi/us/volunteer/assign';
      $rootScope.usVolunteerUnassignUrl = $rootScope.baseUrl + '/dpelapi/us/volunteer/unassign/:volunteerId';
      $rootScope.usVolunteerReassignUrl = $rootScope.baseUrl + '/dpelapi/us/volunteer/reassign';
      $rootScope.usVolunteerNotifyUrl = $rootScope.baseUrl + '/dpelapi/us/volunteer/notify/:volunteerId';
      $rootScope.usVolunteerNotifyAllUrl = $rootScope.baseUrl + '/dpelapi/us/volunteer/notifyall';
      $rootScope.usVolunteerExcelUrl = $rootScope.baseUrl + '/dpelapi/us/volunteer/excel';
      $rootScope.usVolunteerManuallyCreateUserUrl = $rootScope.baseUrl + '/dpelapi/us/volunteer/register';
      
      // Χρήστες
      $rootScope.userIndexUrl = $rootScope.baseUrl + '/dpelapi/auth/users/index';
      $rootScope.userFindUrl = $rootScope.baseUrl + '/dpelapi/auth/users/find/:id';
      $rootScope.userSaveUrl = $rootScope.baseUrl + '/dpelapi/auth/users/save';
      $rootScope.userDeleteUrl = $rootScope.baseUrl + '/dpelapi/auth/users/delete/:id';
      
      // Ρόλοι
      $rootScope.roleFindAllUrl = $rootScope.baseUrl + '/dpelapi/auth/roles/findall';
  
      // Enum
      $rootScope.enumValuesUrl = $rootScope.baseUrl + '/dpelapi/global/enums/getvalues/:enumClass';
      $rootScope.enumsUrl = $rootScope.baseUrl + '/dpelapi/global/enums/get';
    }
    
    function registerStandardRecordsIds() {
    }
    
    function registerDefaultValidationMessages() {
      jQuery.extend(jQuery.validator.messages, {required: 'Το πεδίο είναι υποχρεωτικό.'});
    }
    
    function registerCustomValidators() {
      
      /**
       * Αφαιρεί τα προθέματα τύπων (number:|object:|string:) για τιμή
       * από select option αν προέρχεται από το ngOptions directive της angular.
       */
      var fromNgOption = option => `${option}`.replace(/^(number|object|string):/, '');
      
      /**
       * Έλεγχος ώστε η ημερομηνία να είναι εντός δοθέντους εύρους.
       * Ικανοποίηση συνθήκης εφόσον:
       * - έχει συμπληρωθεί τιμή στην ημερομηνία
       * - αν υπάρχει ελάχιστη ημερομηνία: date <= mindate
       */
      jQuery.validator.addMethod('minDate', (val, el, date = null) => {
        var mindate = date ? moment(date) : date;
        var mDate = moment(val, 'DD/MM/YYYY');
        
        return !mDate.isValid() || (
            !mindate || mDate.isSame(mindate, 'day') || mDate.isAfter(mindate, 'day')
        );
      }, 'Hμερομηνία εκτός ορίων');
      
      /**
       * Έλεγχος ώστε η ημερομηνία να είναι εντός δοθέντους εύρους.
       * Ικανοποίηση συνθήκης εφόσον:
       * - έχει συμπληρωθεί τιμή στην ημερομηνία
       * - αν υπάρχει μέγιστη ημερομηνία: date <= maxdate
       */
      jQuery.validator.addMethod('maxDate', (val, el, date = null) => {
        var maxdate = date ? moment(date) : date;
        var mDate = moment(val, 'DD/MM/YYYY');
        
        return !mDate.isValid() || (
            !maxdate || mDate.isSame(maxdate, 'day') || mDate.isBefore(maxdate, 'day')
        );
      }, 'Hμερομηνία εκτός ορίων');
      
      
      /**
       * Έλεγχος προαπαιτούμενου πεδίου.
       * Μπορεί να δεχτεί και περισσότερα από 1 προαπαιτούμενα.
       */
      jQuery.validator.addMethod('prerequisite', (val, el, params) => {
        if (!val && val !== 0) return true;
        return Array.isArray(params) ?
            params.every(param => !!param || param === 0) :
            !!params || params === 0;
      }, 'Δεν έχει συμπληρωθεί προαπαιτούμενο πεδίο');
      
      
      /**
       * Έλεγχος μέγιστης τιμής που προέρχεται από πεδίο με μάσκα.
       * (μπορεί να περιέχει υπολοιπόμενους χαρακτήρες underscore)
       */
      jQuery.validator.addMethod('maxMasked', function (val, el, param) {
        return this.optional(el) || `${val}`.replace(/_/g, '') <= param;
      }, 'Η τιμή δεν μπορεί να ξεπερνά το {0}');
      
      /**
       * Έλεγχος υποχρεωτικού πεδίου.
       * Λαμβάνει ως λανθάνουσες τιμές και αρνητικούς αριθμούς.
       */
      jQuery.validator.addMethod('required2', function (val, el, param) {
        //Check if dependency is met.
        if (!this.depend(param, el)) return 'dependency-mismatch';
        
        if (el.nodeName.toLowerCase() === 'select') {
          //Could be an array for select-multiple or a string, both are fine this way.
          let v = fromNgOption(jQuery(el).val());
          
          return v && v.length > 0 && (isNaN(v) || v > 0);
        }
        
        if (this.checkable(el)) return this.getLength(val, el) > 0;
        
        return val.length > 0;
      }, 'Το πεδίο είναι υποχρεωτικό.');
    }
    
    /**
     * Καθαρισμός λίστας σφαλμάτων του rootScope
     */
    $rootScope.clearRootErrorList = function () {
      $rootScope.errorList = {};
      $rootScope.errorList.errors = [];
    }
    
    /**
     * Αρχικοποίηση λίστας σφαλμάτων του rootScope
     * Σε αυτή εισάγονται τα σφάλματα από runtime exceptions των κλήσεων στο API
     */
    function registerRootErrorList() {
      
      $rootScope.clearRootErrorList();
      
      /**
       * Εισαγωγή σφάλματος στη λίστα σε περίπτωση που συμβεί κάποιο σχετικό γεγονός
       */
      $rootScope.$on('uiErrorOccured', function (event, data) {
        
        //Εάν υπάρχει ήδη σφάλμα με το ίδιο αναγνωριστικό στη λίστα δεν προστίθεται νέο
        //Περίπτωση σφαλμάτων σε Cache των Requests
        var findError = $rootScope.errorList.errors.filter(function (obj) {
          return obj.errorId === data.errorId;
        })[0];
        
        if (!findError) {
          $rootScope.errorList.errors.push(data);
        }
      });
      
    }
    
    /**
     * Αρχικοποίηση event που σχετίζονται με το Routing της εφαρμογής
     */
    function registerStateEventListeners() {
      
      /**
       * Άδειασμα της λίστας των σφαλμάτων σε περίπτωση που γίνεται αλλαγή σε τρέχον state
       */
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        
        $rootScope.errorList = {};
        $rootScope.errorList.errors = [];
        
        //Ανάκτηση του absolute url του state στο οποίο γίνεται προσπάθεια να μεταφερθούμε
        var absoluteUrl = $state.href(toState.name, toParams, {absolute: true});
        
        //Έλεγχος και προσπάθεια σύνδεσης του χρήστη στην εφαρμογή μέσω του OAM
        //authService.isAuthenticatedUser(absoluteUrl).then(function (response) {
        //});
        
      });
      
      $rootScope.$on('$stateChangeError',
          function (e, toState, toParams, fromState, fromParams, error) {
            
            $log.error('State Change Error [' + toState.name + ']');
            
            if (error === "NotAuthenticated") {
              $state.go(toState.name);
            }
            
            if ((error === "NotAuthorized") || (error.status && error.status === 403)) {
              $state.go("app.misc.error403");
            }
            
            if (error.status && error.status === 400) {
              $state.go("app.misc.error400", {error: error, exception: error.data});
            }
            
            if (error === "NotFound") {
              $state.go("app.misc.error404");
            }
            
            if (error.status && error.status === 500) {
              $state.go("app.misc.error500", {error: error});
            }
            
          });
      
      //Αρχικοποίηση μεταβλητής που δηλώνει ότι εμφανίζεται η επιβεβαίωση για μη αποθηκευμένες αλλαγές.
      $rootScope.confirmingExit = 'NO';
    }
    
    startupFactory.initialize = _initialize;
    
    return startupFactory;
  }
]);
