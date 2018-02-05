"use strict";

angular.module('app.misc', ['ui.router']);


angular.module('app.misc').config(function ($stateProvider) {
  
  $stateProvider
      .state('app.misc', {
        abstract: true,
        data: {
          title: 'Miscellaneous'
        }
      })
      
      .state('app.misc.error400', {
        url: '/400',
        params: {
          error: null,
          exception: null
        },
        data: {
          title: 'Error 400'
        },
        views: {
          "content@app": {
            templateUrl: 'app/misc/views/error400.html',
            controller: ['$scope', 'error', 'exception',
              function ($scope, error, exception) {
                
                $scope.error = error;
                $scope.exception = exception;
                
                if (error && error.config && error.config.url) {
                  $scope.errorUrl = error.config.url;
                }
              }]
          }
        },
        resolve: {
          error: function ($stateParams) {
            return $stateParams.error;
          },
          exception: function ($stateParams) {
            return $stateParams.exception;
          }
        }
      })
      
      .state('app.misc.error403', {
        url: '/403',
        data: {
          title: 'Error 403'
        },
        views: {
          "content@app": {
            templateUrl: 'app/misc/views/error403.html'
          }
        }
      })
      
      .state('app.misc.error404', {
        url: '/404',
        data: {
          title: 'Error 404'
        },
        views: {
          "content@app": {
            templateUrl: 'app/misc/views/error404.html',
            controller: ['$scope', '$state', 'authService',
              function ($scope, $state, authService) {
                $state.go('app.index', {notify: true});
              }]
          }
        }
      })
      
      
      .state('app.misc.error422', {
        url: '/422',
        params: {
          exception: null,
          cause: null
        },
        data: {
          title: 'Error 422'
        },
        views: {
          "content@app": {
            templateUrl: 'app/misc/views/error422.html',
            controller: ['$scope', 'exception', 'cause',
              function ($scope, exception, cause) {
                $scope.exception = exception;
                $scope.cause = cause;
              }]
          }
        },
        resolve: {
          exception: function ($stateParams) {
            return $stateParams.exception;
          },
          cause: function ($stateParams) {
            return $stateParams.cause;
          }
        }
      })
      
      .state('app.misc.error500', {
        url: '/500',
        params: {
          error: null
        },
        data: {
          title: 'Error 500'
        },
        views: {
          "content@app": {
            templateUrl: 'app/misc/views/error500.html',
            controller: ['$scope', 'error',
              function ($scope, error) {
                
                $scope.error = error;
                
                $scope.fullStackText = "";
                
                var fullStack = error.data.exception.stackTrace;
                
                for (var i = 0; i < fullStack.length; i++) {
                  $scope.fullStackText += fullStack[i].className + " [" + fullStack[i].methodName + ":" + fullStack[i].lineNumber + "]\r\n";
                }
              }]
          }
        },
        resolve: {
          error: function ($stateParams) {
            return $stateParams.error;
          }
        }
      })
      
      .state('app.misc.error501', {
        url: '/501',
        params: {
          exception: null,
          cause: null
        },
        data: {
          title: 'Error 501'
        },
        views: {
          "content@app": {
            templateUrl: 'app/misc/views/error501.html',
            controller: ['$scope', 'exception', 'cause',
              function ($scope, exception, cause) {
                $scope.exception = exception;
                $scope.cause = cause;
              }]
          }
        },
        resolve: {
          exception: function ($stateParams) {
            return $stateParams.exception;
          },
          cause: function ($stateParams) {
            return $stateParams.cause;
          }
        }
      })
      
      .state('app.misc.blank', {
        url: '/blank',
        data: {
          title: 'Blank'
        },
        views: {
          "content@app": {
            templateUrl: 'app/misc/views/blank.html'
          }
        }
      })
  
});