angular.module('app.rs', [
    'app.rs.submission',
    'app.rs.display',
    'app.rs.electiondepartment'
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('app.rs', {
        url: '/rs/',
        data: { title: 'Αποτελέσματα' },
        views: {
          'content@app': {
            templateUrl: 'app/_shared/top-modules/blank.html'
          }
        },
        resolve: {
          security: ['$q', 'authService', function($q, authService) {
            if (!authService.hasPermission('rs')) {
              return $q.reject('NotAuthorized');
            }
          }],
        }
      });
  });
