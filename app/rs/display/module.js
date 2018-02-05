angular.module('app.rs.display', [
    'ui.router',
    'ngResource',
    'ui.bootstrap',
    'ngSanitize',
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('app.rs.display', {
        abstract: true,
        data: {
          requiresLogin: true,
          title: 'Προβολή Αποτελεσμάτων'
        }
      })
      .state('app.rs.display.view', {
        url: 'display/view/:id',
        data: {
          requiresLogin: true,
          title: 'Καρτέλα Προβολής Αποτελεσμάτων'
        },
        views: {
          'content@app': {
            templateUrl: 'app/rs/display/views/view.html',
            controller: 'DisplayViewController as vc'
          }
        },
        params: {
          successMessage: null,
        },
        resolve: {
          security: ['$stateParams', '$q', 'authService', function ($stateParams, $q, authService) {
            if (!authService.hasPermission('rs.result')) {
              return $q.reject('NotAuthorized');
            }
          }],
          currentElectionProcedure: ElectionProcedureService => ElectionProcedureService.getCurrent().$promise,
        }
      });
  });
