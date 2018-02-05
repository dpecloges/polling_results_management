"use strict";

angular.module('app.us.volunteer', [
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngSanitize'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          
          .state('app.us.volunteer', {
            abstract: true,
            data: {
              requiresLogin: true,
              title: 'Εθελοντές'
            }
          })
          
          .state('app.us.volunteer.list', {
            url: "volunteer/list/",
            data: {
              requiresLogin: true,
              title: 'Αναζήτηση Εθελοντή'
            },
            views: {
              "content@app": {
                templateUrl: "app/us/volunteer/views/list.html",
                controller: 'VolunteerListController as lc'
              }
            },
            params: {
              successMessage: null
            },
            resolve: {
              security: ['$stateParams', '$q', 'authService', function($stateParams, $q, authService) {
                if (!authService.hasPermission('ext.volunteer')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jqgrid',
                  'jqgrid-locale-en'
                ]);
              },
              currentElectionProcedure: function (ElectionProcedureService) {
                return ElectionProcedureService.getCurrent().$promise;
              }
            }
          })
    });
