angular.module('app.ep.statistics', [
    'ui.router',
    'ngResource',
    'ui.bootstrap',
    'ngSanitize'
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('app.ep.statistics', {
        abstract: true,
        data: { requiresLogin: true, title: 'Στατιστικά' }
      })
      .state('app.ep.statistics.view', {
        url: 'statistics/view/',
        data: { requiresLogin: true, title: 'Στατιστικά' },
        views: {
          'content@app': {
            templateUrl: 'app/ep/statistics/views/view.html',
            controller: 'StatisticsViewController as vc'
          }
        },
        resolve: {
          security: ['$stateParams', '$q', 'authService', function($stateParams, $q, authService) {
            if (!authService.hasPermission('ep.snapshot')) {
              return $q.reject('NotAuthorized');
            }
          }],
          currentElectionProcedure: ElectionProcedureService => ElectionProcedureService.getCurrent().$promise,
          SnapshotType: EnumService => EnumService.getValues('ep.core.enums.SnapshotType').$promise,
          srcipts: lazyScript => lazyScript.register(['jqgrid', 'jqgrid-locale-en']),
        }
      });
  });
