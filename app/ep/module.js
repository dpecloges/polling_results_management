angular.module('app.ep', [
    'app.ep.verification',
    'app.ep.snapshot',
    'app.ep.statistics'
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('app.ep', {
        url: '/ep/',
        data: {
          title: 'Εκλογική Διαδικασία'
        },
        views: {
          'content@app': {
            templateUrl: 'app/_shared/top-modules/blank.html'
          }
        },
        resolve: {
          security: ['$q', 'authService', function($q, authService) {
            if (!authService.hasPermission('ep')) {
              return $q.reject('NotAuthorized');
            }
          }],
          srcipts: lazyScript => lazyScript.register(['jqgrid', 'jqgrid-locale-en'])
        }
      });
  });
