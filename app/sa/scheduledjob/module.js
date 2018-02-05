angular.module('app.sa.scheduledjob', [
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngSanitize'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          .state('app.sa.scheduledjob', {
            abstract: true,
            data: {
              requiresLogin: true,
              title: 'Προγραμματισμένες Εργασίες'
            }
          })
          .state('app.sa.scheduledjob.list', {
            url: 'scheduledjob/list/',
            data: {
              requiresLogin: true,
              title: 'Αναζήτηση Εργασιών'
            },
            views: {
              'content@app': {
                templateUrl: 'app/sa/scheduledjob/views/list.html',
                controller: 'ScheduledJobListController as lc'
              }
            },
            resolve: {
              security: ['$q', 'authService', function ($q, authService) {
                if (!authService.hasPermission('sys.admin')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register(['jqgrid', 'jqgrid-locale-en']);
              },
              lists: function (EnumService) {
                var lists = {};
                lists.scheduledJobStatus = EnumService.getValues('system.core.enums.ScheduledJobStatus');
                return lists;
              }
            }
          })
          .state('app.sa.scheduledjob.view', {
            url: "scheduledjob/view/:jobGroup",
            data: {
              requiresLogin: true,
              title: 'Προγραμματισμός Εργασιών'
            },
            views: {
              "content@app": {
                templateUrl: "app/sa/scheduledjob/views/view.html",
                controller: 'ScheduledJobViewController as vc'
              }
            },
            resolve: {
              security: ['$stateParams', '$q', 'authService', function ($stateParams, $q, authService) {
                if (!authService.hasPermission('sys.admin')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jquery-maskedinput'
                ])
              },
              jobStatus: ['$stateParams', '$q', 'ResultService', 'SnapshotService', function($stateParams, $q, ResultService, SnapshotService) {
                if ($stateParams.jobGroup && $stateParams.jobGroup === 'calculate_results') {
                  return ResultService.getJobStatus();
                }
                else if ($stateParams.jobGroup && $stateParams.jobGroup === 'calculate_snapshots') {
                  return SnapshotService.getJobStatus();
                }
                else {
                  return $q.reject('NotFound');
                }
              }]
            }
          });
    });
