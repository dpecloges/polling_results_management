(function () {
  
  'use strict';
  
  angular.module('app.layout', ['ui.router'])
      .config(function ($stateProvider, $urlRouterProvider) {
        
        $stateProvider
            .state('app', {
              abstract: true,
              views: {
                root: {
                  templateUrl: 'app/layout/layout.tpl.html',
                  controller: 'StartupController'
                }
              },
              resolve: {
                scripts: lazyScript => lazyScript.register(['sparkline', 'easy-pie'])
              }
            });
        
        
        $urlRouterProvider.when('', '/index');
        //Redirect to page not found 404 if state could not be resolved by router
        $urlRouterProvider.otherwise("404");
        
      });
  
})();
