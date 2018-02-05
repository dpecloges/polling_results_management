angular.module('app.index', [
  'ui.router'
])
    .config(function ($stateProvider) {
      
      $stateProvider
          
          .state('app.home', {
            url: "/",
            data: {
              requiresLogin: true,
              title: 'Εκλογές για τον Πρόεδρο του Νέου Φορέα'
            },
            views: {
              "content@app": {
                templateUrl: "app/_shared/top-modules/blank.html"
              }
            }
          })
          
          .state('app.index', {
            url: "/index",
            data: {
              requiresLogin: true,
              title: 'Εκλογές για τον Πρόεδρο του Νέου Φορέα'
            },
            views: {
              "content@app": {
                templateUrl: "app/_shared/top-modules/blank.html"
              }
            }
          });
    });
