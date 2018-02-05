angular.module('app.mg', [
  'app.mg.electioncenter',
  'app.mg.electiondepartment'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          .state('app.mg', {
            url: '/mg/',
            data: {
              title: 'Διαχείριση'
            },
            views: {
              'content@app': {
                templateUrl: 'app/_shared/top-modules/blank.html'
              }
            },
            resolve: {
              security: ['$q', 'authService', function ($q, authService) {
                if (!authService.hasPermission('mg')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: lazyScript => lazyScript.register(['jqgrid', 'jqgrid-locale-en'])
            }
          });
      
    });
