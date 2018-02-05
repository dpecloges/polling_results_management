angular.module('app.sa', [
  'app.sa.scheduledjob'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          .state('app.sa', {
            url: "/sa/",
            data: {
              title: 'Διαχείριση Συστήματος'
            },
            views: {
              "content@app": {
                templateUrl: "app/_shared/top-modules/blank.html"
              }
            },
            resolve: {
              security: ['$q', 'authService', function ($q, authService) {
                if (!authService.hasPermission('sys')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jqgrid',
                  'jqgrid-locale-en'
                ]);
              }
            }
          });
    });