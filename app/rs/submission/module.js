angular.module('app.rs.submission', [
    'ui.router',
    'ngResource',
    'ui.bootstrap',
    'ngSanitize',
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('app.rs.submission', {
        abstract: true,
        data: {
          requiresLogin: true,
          title: 'Αποστολή Αποτελεσμάτων'
        }
      })
      .state('app.rs.submission.view', {
        url: 'submission/view/:id',
        data: {
          requiresLogin: true,
          title: 'Καρτέλα Αποστολής Αποτελεσμάτων'
        },
        views: {
          'content@app': {
            templateUrl: 'app/rs/submission/views/view.html',
            controller: 'SubmissionViewController as vc'
          }
        },
        params: { successMessage: null },
        resolve: {
          security: ['$stateParams', '$q', 'authService', function($stateParams, $q, authService) {
            if (!authService.hasPermission('rs.submission')) {
              return $q.reject('NotAuthorized');
            }
          }],
          electionDepartment(authService, ElectionDepartmentService, ResultService) {
            const edId = authService.getElectionDepartmentId();
            return edId ? ResultService.get(edId) : {};
          },
          electionDepartments(authService, ElectionDepartmentService) {
            const edId = authService.getElectionDepartmentId();
            const ecId = authService.getElectionCenterId();
            
            if (edId) {
              return [];
            } else if (ecId) {
              return ElectionDepartmentService.getByElectionCenter(ecId);
            } else {
              return ElectionDepartmentService.getAll();
            }
          },
          currentElectionProcedure: ElectionProcedureService => ElectionProcedureService.getCurrent().$promise,
        }
      });
  });
