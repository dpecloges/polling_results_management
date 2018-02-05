"use strict";

angular.module('app.us.user', [
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngSanitize'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          
          .state('app.us.user', {
            abstract: true,
            data: {
              requiresLogin: true,
              title: 'Χρήστες'
            }
          })
          
          .state('app.us.user.list', {
            url: "user/list/",
            data: {
              requiresLogin: true,
              title: 'Αναζήτηση Χρήστη'
            },
            views: {
              "content@app": {
                templateUrl: "app/us/user/views/list.html",
                controller: 'UserListController as lc'
              }
            },
            params: {
              successMessage: null
            },
            resolve: {
              security: ['$stateParams', '$q', 'authService', function($stateParams, $q, authService) {
                if (!authService.hasPermission('sa.user')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jqgrid',
                  'jqgrid-locale-en'
                ]);
              },
              electionCenters: function (ElectionCenterService) {
                return ElectionCenterService.getAll();
              },
              electionDepartments: function (ElectionDepartmentService) {
                return ElectionDepartmentService.getAll();
              }
            }
          })
          
          .state('app.us.user.view', {
            url: "user/view/:id",
            data: {
              requiresLogin: true,
              title: 'Καρτέλα Χρήστη'
            },
            views: {
              "content@app": {
                templateUrl: "app/us/user/views/view.html",
                controller: 'UserViewController as vc'
              }
            },
            params: {
              successMessage: null
            },
            resolve: {
              security: ['$stateParams', '$q', 'authService', function($stateParams, $q, authService) {
                if (!authService.hasPermission('sa.user')) {
                  return $q.reject('NotAuthorized');
                }
              }],
              srcipts: function (lazyScript) {
                return lazyScript.register([
                  'jquery-maskedinput'
                ])
              },
              user: function (UserService, $stateParams) {
                return (!$stateParams.id) ? {id: null} : UserService.getUser($stateParams.id).$promise;
              },
              electionDepartments: function (ElectionDepartmentService) {
                return ElectionDepartmentService.getAll();
              },
              roles: function (RoleService) {
                return RoleService.getAll();
              },
            }
          });
      
    });
