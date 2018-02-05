"use strict";

angular.module('app.ep.verification', [
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngSanitize'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          
          .state('app.ep.verification', {
            abstract: true,
            data: {
              requiresLogin: true,
              title: 'Διαπίστευση'
            }
          })
          
          .state('app.ep.verification.view', {
            url: "verification/view/",
            data: {
              requiresLogin: true,
              title: 'Διαπίστευση'
            },
            views: {
              "content@app": {
                templateUrl: "app/ep/verification/views/view.html",
                controller: 'VerificationViewController as vc'
              }
            },
            resolve: {
              security: ['$stateParams', '$q', 'authService', function ($stateParams, $q, authService) {
                if (!authService.hasPermission('ep.verification')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              electionDepartments: function (authService, ElectionDepartmentService) {
                let userElectionDepartmentId = authService.getElectionDepartmentId();
                let userElectionCenterId = authService.getElectionCenterId();
                
                if (userElectionDepartmentId) {
                  return [];
                }
                else if (userElectionCenterId) {
                  return ElectionDepartmentService.getByElectionCenter(userElectionCenterId);
                }
                else {
                  return ElectionDepartmentService.getAll();
                }
              },
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jquery-maskedinput'
                ])
              }
            }
          });
      
    });