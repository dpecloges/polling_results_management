"use strict";

angular.module('app.mg.electiondepartment', [
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngSanitize'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          
          .state('app.mg.electiondepartment', {
            abstract: true,
            data: {
              requiresLogin: true,
              title: 'Εκλογικά Τμήματα'
            }
          })
    
          .state('app.mg.electiondepartment.list', {
            url: "electiondepartment/list/",
            data: {
              requiresLogin: true,
              title: 'Αναζήτηση Εκλογικού Τμήματος'
            },
            views: {
              "content@app": {
                templateUrl: "app/mg/electiondepartment/views/list.html",
                controller: 'ElectionDepartmentListController as lc'
              }
            },
            params: {
              successMessage: null
            },
            resolve: {
              security: ['$q', 'authService', function ($q, authService) {
                if (!authService.hasPermission('mg.electiondepartment')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jqgrid',
                  'jqgrid-locale-en'
                ]);
              },
              candidates: function(CandidateService) {
                return CandidateService.getByCurrentElectionProcedure();
              }
            }
          })
          
          .state('app.mg.electiondepartment.view', {
            url: "electiondepartment/view/:id",
            data: {
              requiresLogin: true,
              title: 'Καρτέλα Εκλογικού Τμήματος'
            },
            views: {
              "content@app": {
                templateUrl: "app/mg/electiondepartment/views/view.html",
                controller: 'ElectionDepartmentViewController as vc'
              }
            },
            resolve: {
              security: ['$stateParams', '$q', 'authService', function ($stateParams, $q, authService) {
                if (!authService.hasPermission('mg.electiondepartment')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jquery-maskedinput'
                ])
              },
              electionDepartment: function (ElectionDepartmentService, $stateParams, $window, $q) {
                
                //Αν δεν έχει δοθεί id και δεν έχει πατηθεί το κουμπί "Νέα Εγγραφή", τότε εμφανίζουμε 404.
                if (!$stateParams.id && (!$window.opener || !$window.opener.electionCenterId)) {
                    return $q.reject('NotFound');
                }
                
                if (!$stateParams.id) {
                  return {id: null, contributions: []};
                }
                else {
                  return ElectionDepartmentService.getElectionDepartment($stateParams.id).$promise;
                }
              },
              currentElectionProcedure: function(ElectionProcedureService) {
                return ElectionProcedureService.getCurrent().$promise;
              },
              candidates: function(CandidateService) {
                return CandidateService.getByCurrentElectionProcedure();
              }
            }
          });
      
    });