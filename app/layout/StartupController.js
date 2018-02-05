'use strict';

angular.module('app')
    .controller("StartupController", [
      '$scope',
      '$rootScope',
      '$translate',
      '$location',
      '$state',
      '$http',
      '$window',
      '$timeout',
      'authService',
      'NavigationState',
      'ENV_VARS',
      function StartupController($scope, $rootScope, $translate, $location, $state, $http, $window, $timeout, authService, NavigationState, ENV_VARS) {
        
        $scope.version = ENV_VARS.version;
        $scope.sessionTimeoutEnabled = ENV_VARS.sessionTimeoutEnabled;
        
        $scope.hasPermission = function (permission) {
          return authService.hasPermission(permission);
        };
        
        $scope.userFullName = function () {
          return authService.getFullNameToken();
        };
        
        $scope.userElectionCenterName = function () {
          return authService.getElectionCenterName();
        };
        
        $scope.userElectionCenterDisplayName = function () {
          return authService.getElectionCenterDisplayName();
        };
        
        $scope.userElectionDepartmentName = function () {
          return authService.getElectionDepartmentName();
        };
        
        $scope.userElectionDepartmentDisplayName = function () {
          return authService.getElectionDepartmentDisplayName();
        };
  
        $scope.getElectionProcedureRound = function () {
          return authService.getElectionProcedureRound();
        };
        
        $scope.userMinisterial = function () {
          return authService.userMinisterial();
        };
        
        // Τρέχον url
        $scope.path = $location.path();
        $scope.$on('$locationChangeSuccess', function () {
          $scope.path = $location.path();
        });
        
        // Logout από την Εφαρμογή
        $scope.logout = function () {
          authService.logoutToken();
        };
        
        // Home Button Αρχική Σελίδα
        $scope.home = function () {
          $state.go('app.home');
        };
        
        // Register Basic Chosen Attributes at $rootScope
        $scope.registerChosenAttributes = function () {
          
          // Chosen Lite Attributes
          $rootScope.chosenLiteAttrs = {
            allow_single_deselect: true,
            disable_search: true,
            no_results_text: $translate.instant('global.chosen.noResults'),
            placeholder_text_multiple: $translate.instant('global.chosen.placeholderMultiple'),
            placeholder_text_single: $translate.instant('global.chosen.placeholderSingle')
          };
          
          // Chosen Basic Attributes
          $rootScope.chosenAttrs = {
            allow_single_deselect: true,
            search_contains: true,
            no_results_text: $translate.instant('global.chosen.noResults'),
            placeholder_text_multiple: $translate.instant('global.chosen.placeholderMultiple'),
            placeholder_text_single: $translate.instant('global.chosen.placeholderSingle')
          };
          
          // Chosen Basic Attributes with Create Option
          $rootScope.chosenCreateOptionAttrs = {
            allow_single_deselect: true,
            search_contains: true,
            no_results_text: $translate.instant('global.chosen.noResults'),
            placeholder_text_multiple: $translate.instant('global.chosen.placeholderMultiple'),
            placeholder_text_single: $translate.instant('global.chosen.placeholderSingle'),
            create_option_text: $translate.instant('global.chosen.createOption'),
            skip_no_results: true,
            create_option: true,
            persistent_create_option: true
          };
          
          // Chosen Basic Attributes Without Deselect
          $rootScope.chosenNoDeselectAttrs = {
            allow_single_deselect: false,
            search_contains: true,
            no_results_text: ' ',
            placeholder_text_single: ' '
          };
          
          // Chosen Basic Attributes For Delimeter Fields
          $rootScope.chosenDelimAttrs = {
            disable_search: true,
            allow_single_deselect: false,
            placeholder_text_single: ' '
          };
          
          $rootScope.chosenDelimClassesAttrs = {
            disable_search: true,
            allow_single_deselect: false,
            placeholder_text_single: ' ',
            inherit_select_classes: true
          };
          
          // Chosen Basic Attributes For Search from Start Fields
          $rootScope.chosenSearchFromStartAttrs = {
            allow_single_deselect: true,
            no_results_text: $translate.instant('global.chosen.noResults'),
            placeholder_text_multiple: $translate.instant('global.chosen.placeholderMultiple'),
            placeholder_text_single: $translate.instant('global.chosen.placeholderSingle'),
            enable_split_word_search: false
          };
          
        };
        
        // Chosen attributes
        $scope.registerChosenAttributes();
        
        
        //Επιστροφή στην κορυφή της σελίδας
        $scope.backToTop = function () {
          $('html,body,.scroll-area').animate({scrollTop: 0}, 1000);
        };
        
        
        /*  ______    _ _ _     _____                                 _ _     _       
           |  ____|  | (_) |   |  __ \                               (_) |   | |      
           | |__   __| |_| |_  | |__) |___  ___ _ __   ___  _ __  ___ _| |__ | |_   _ 
           |  __| / _` | | __| |  _  // _ \/ __| '_ \ / _ \| '_ \/ __| | '_ \| | | | |
           | |___| (_| | | |_  | | \ \  __/\__ \ |_) | (_) | | | \__ \ | |_) | | |_| |
           |______\__,_|_|\__| |_|  \_\___||___/ .__/ \___/|_| |_|___/_|_.__/|_|\__, |
                                               | |                               __/ |
                                               |_|                              |___/ */
        
        /**
         * Διαχείριση του αριστερού μενού κατά την επιτυχή μετάβαση από ένα state σε άλλο.
         */
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          
          $timeout(function () {
            
            var menu = angular.element('ul#cr-menu');
            var page = menu.find('a[data-cr-view="' + NavigationState[toState.name] + '"]').parent();
            var section = page.closest('li[data-menu-collapse]');
            
            if ($scope.$id !== event.targetScope.$id) {
              
              var openArray;
              
              if (section[0]) {
                /*
                 * Κανονικό state, όπως app.mg.electioncenter.list
                 */
                
                //Εύρεση όλων των ανοιχτών στοιχείων εκτός του τρέχοντος.
                openArray = menu.find('li[data-menu-collapse].open').not('#' + section[0].id);
                
                //Κλείσιμο των στοιχείων αυτών.
                openArray.smartCollapseToggle();
                
                //Άνοιγμα/κλείσιμο του τρέχοντος στοιχείου υπό περιπτώσεις
                if (openArray.length > 0 || (!!fromParams.forceSectionSmartCollapseToggle && !section.hasClass('open'))) {
                  section.smartCollapseToggle();
                }
                if (fromState.name.length === 6 && !section.hasClass('open')) {
                  //Ένα 'γονικό' state (πχ. app.mg) έχει 6 χαρακτήρες.
                  section.smartCollapseToggle();
                }
              }
              else {
                /*
                 * 'Γονικό' state, όπως app.mg
                 */
                
                //Κλείσιμο όλων των ανοιχτών στοιχείων.
                openArray = menu.find('li[data-menu-collapse].open');
                openArray.smartCollapseToggle();
              }
              
              //Διαχείριση των έντονων / μη έντονων γραμμάτων.
              menu.find('li').removeClass('active');
              page.addClass('active');
              page.parents('li').addClass('active');
            }
            
          });
          
        });
        
        /**
         * Διαχείριση του αριστερού μενού κατά την αρχική φόρτωση της σελίδας.
         */
        $rootScope.$on('$viewContentLoaded', function (event) {
          
          $timeout(function () {
            
            var currentStateName = $state.$current.self.name;
            var page = angular.element('ul#cr-menu').find('a[data-cr-view="' + NavigationState[currentStateName] + '"]').parent();
            var section = page.closest('li[data-menu-collapse]');
            
            //Στην πρώτη φόρτωση της σελίδας η $viewContentLoaded καλείται δύο φορές:
            //Μία για το scope της τρέχουσας σελίδας και μία για το scope του StartupController.
            //Με τον παρακάτω έλεγχο 'πιάνουμε' την περίπτωση του StartupController.
            
            if ($scope.$id === event.targetScope.$id) {
              //Άνοιγμα του τρέχοντος στοιχείου
              section.smartCollapseToggle();
              
              //Ορισμός του τρέχοντος στοιχείου σε έντονο
              page.addClass('active');
              page.parents('li').addClass('active');
            }
            
          });
          
        });
      }
    
    ]);
