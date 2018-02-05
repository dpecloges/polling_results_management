angular.module('app.us', [
    'app.us.volunteer',
    'app.us.user'
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('app.us', {
        url: '/us/',
        data: { title: 'Διαχείριση Εθελοντών/Χρηστών' },
        views: {
          'content@app': {
            templateUrl: 'app/_shared/top-modules/blank.html'
          }
        },
        resolve: {
          security: ['$q', 'authService', function($q, authService) {
            if (!authService.hasPermission('sa')) {
              return $q.reject('NotAuthorized');
            }
          }],
        }
      });
  });
