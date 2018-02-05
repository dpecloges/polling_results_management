"use strict";

angular.module('app.auth', ['ui.router']);


angular.module('app.auth').config(function ($stateProvider) {
  
  $stateProvider
      .state('app.auth', {
        abstract: true,
        data: {
          title: 'Auth'
        }
      })
      .state('app.auth.login', {
        url: '/login',
        data: {
          title: 'Login'
        },
        views: {
          "content@app": {
            templateUrl: 'app/auth/views/login.html',
            controller: 'LoginController as lc'
          }
        },
        params: {
          reloadWindow: false
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
      .state('app.auth.register', {
        url: '/register/:id',
        data: {
          title: 'Register'
        },
        views: {
          "content@app": {
            templateUrl: 'app/auth/views/register.html',
            controller: 'RegistrationController as lc'
          }
        },
        resolve: {
          registerUser: ['$q', '$stateParams', 'RegistrationService', function ($q, $stateParams, RegistrationService) {
            return RegistrationService.findRegistration($stateParams.id)
                .then(function (result) {
                  return result;
                })
                .catch(function (error) {
                  if (error && error.data && error.data.errors) {
                    if (error.data.errors[0].errorCode === 'INVALID_IDENTIFIER') {
                      return $q.reject('NotFound');
                    }
                    else if (error.data.errors[0].errorCode === 'REGISTRATION_COMPLETED') {
                      return {
                        username: '',
                        errorCode: error.data.errors[0].errorCode,
                        errorMessage: error.data.errors[0].errorMessage
                      }
                    }
                  }
                });
          }],
          error: function ($stateParams) {
            return $stateParams.error;
          },
          exception: function ($stateParams) {
            return $stateParams.exception;
          }
        }
      })
});