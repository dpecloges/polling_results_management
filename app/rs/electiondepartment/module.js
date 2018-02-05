"use strict";

angular.module('app.rs.electiondepartment', [
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngSanitize'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          
          .state('app.rs.electiondepartment', {
            abstract: true,
            data: {
              requiresLogin: true,
              title: 'Εκλογικά Τμήματα'
            }
          })
    
          .state('app.rs.electiondepartment.list', {
            url: "electiondepartment/list/",
            data: {
              requiresLogin: true,
              title: 'Αναζήτηση Εκλογικού Τμήματος'
            },
            views: {
              "content@app": {
                templateUrl: "app/rs/electiondepartment/views/list.html",
                controller: 'RsElectionDepartmentListController as lc'
              }
            },
            resolve: {
              security: ['$q', 'authService', function ($q, authService) {
                if (!authService.hasPermission('rs.result')) {
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