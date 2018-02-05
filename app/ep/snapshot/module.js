"use strict";

angular.module('app.ep.snapshot', [
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngSanitize'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          
          .state('app.ep.snapshot', {
            abstract: true,
            data: {
              requiresLogin: true,
              title: 'Εξέλιξη Διαδικασίας'
            }
          })
          
          .state('app.ep.snapshot.view', {
            url: "snapshot/view/",
            data: {
              requiresLogin: true,
              title: 'Εξέλιξη Διαδικασίας'
            },
            views: {
              "content@app": {
                templateUrl: "app/ep/snapshot/views/view.html",
                controller: 'SnapshotViewController as vc'
              }
            },
            resolve: {
              security: ['$stateParams', '$q', 'authService', function ($stateParams, $q, authService) {
                if (!authService.hasPermission('ep.snapshot')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              currentElectionProcedure: ElectionProcedureService => ElectionProcedureService.getCurrent().$promise,
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jquery-maskedinput'
                ])
              }
            }
          });
      
    });