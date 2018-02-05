"use strict";

angular.module('app.mg.electioncenter', [
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngSanitize'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          
          .state('app.mg.electioncenter', {
            abstract: true,
            data: {
              requiresLogin: true,
              title: 'Εκλογικά Κέντρα'
            }
          })
          
          .state('app.mg.electioncenter.list', {
            url: "electioncenter/list/",
            data: {
              requiresLogin: true,
              title: 'Αναζήτηση Εκλογικού Κέντρου'
            },
            views: {
              "content@app": {
                templateUrl: "app/mg/electioncenter/views/list.html",
                controller: 'ElectionCenterListController as lc'
              }
            },
            params: {
              successMessage: null
            },
            resolve: {
              security: ['$q', 'authService', function ($q, authService) {
                if (!authService.hasPermission('mg.electioncenter')) {
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
          })
          
          .state('app.mg.electioncenter.view', {
            url: "electioncenter/view/:id",
            data: {
              requiresLogin: true,
              title: 'Καρτέλα Εκλογικού Κέντρου'
            },
            views: {
              "content@app": {
                templateUrl: "app/mg/electioncenter/views/view.html",
                controller: 'ElectionCenterViewController as vc'
              }
            },
            params: {
              successMessage: null
            },
            resolve: {
              security: ['$stateParams', '$q', 'authService', function ($stateParams, $q, authService) {
                if (!authService.hasPermission('mg.electioncenter')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jquery-maskedinput'
                ])
              },
              electionCenter: function (ElectionCenterService, $stateParams) {
                if (!$stateParams.id) {
                  return {id: null};
                }
                else {
                  return ElectionCenterService.getElectionCenter($stateParams.id).$promise;
                }
              },
              currentElectionProcedure: function (ElectionProcedureService) {
                return ElectionProcedureService.getCurrent().$promise;
              }
            }
          });
      
    });