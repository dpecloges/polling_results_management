(function () {
  
  'use strict';
  
  var app = angular.module('app', [
    'ngAnimate',
    'restangular',
    'ui.router',
    'pascalprecht.translate',
    'localytics.directives',
    'angular-button-spinner',
    'ui.bootstrap',
    'ngBootbox',
    'ui.mask',
    'SmartAdmin',
    'app.config',
    'app.layout',
    'app.misc',
    'app.index',
    'app.mg',
    'app.ep',
    'app.rs',
    'app.us',
    'app.sa',
    'app.utils',
    'app.auth',
    'LocalStorageModule',
    'ngCookies',
    'ui.bootstrap.datetimepicker',
    'ngMask',
    'ngFileSaver',
    'lr.upload',
    'angular-jwt',
    'chart.js'
  ])
      .config(function($provide, $httpProvider, $translateProvider, $logProvider, localStorageServiceProvider, jwtOptionsProvider, ENV_VARS) {
        
        // Enable debugging level ($log.debug) on messages
        $logProvider.debugEnabled(ENV_VARS.debug);
        
        localStorageServiceProvider.setPrefix('dp');
        localStorageServiceProvider.setStorageType('localStorage');
        
        /**
         * Messages
         */
        $translateProvider.useStaticFilesLoader({files: [{prefix: 'build/msg-', suffix: '.json'}]});
        
        $translateProvider.preferredLanguage('el');
        
        // Enable escaping of HTML
        $translateProvider.useSanitizeValueStrategy('escape');
        
        $translateProvider.useLoaderCache(true);
        
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        
        // Dev User Interceptor in Http Requests
        // $httpProvider.interceptors.push('dev UserInterceptor');
        
        // Jwt Token Interceptor
        jwtOptionsProvider.config({
          whiteListedDomains: [ENV_VARS.authDomain],
          tokenGetter: ['authService', function (authService) {
            return authService.getToken();
          }],
          unauthenticatedRedirector: ['$state', function ($state) {
            if($state.current.name !== 'app.auth.login') {
              $state.go('app.auth.login', {reloadWindow: true}, {notify: true, reload: true});
            }
          }]
        });
        
        $httpProvider.interceptors.push('jwtInterceptor');
        
        // Error Interceptor to catch Errors in Http Requests
        $httpProvider.interceptors.push('errorInterceptor');
        
        $httpProvider.useApplyAsync(true);
                
        /**
         * Override Date prototype here.
         * Uses moment.js output format.
         */
        Date.prototype.toJSON = function () {
          return moment(this).format();
        };
        
      })
      
      .run(['$rootScope', '$state', '$stateParams', 'startupService', 'authManager',
        function ($rootScope, $state, $stateParams, startupService, authManager) {
          
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          
          // Security
          authManager.checkAuthOnRefresh();
          
          authManager.redirectWhenUnauthenticated();
          
          //authService.fillAuthData();
          
          // General initialization
          startupService.initialize();
          
        }
      ]);
  
})();
