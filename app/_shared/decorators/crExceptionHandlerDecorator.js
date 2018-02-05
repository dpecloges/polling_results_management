'use strict';

/**
 * Exception Handler Decorator
 * Redirect to Page 501 if Angular or Javascript Errors Occure
 */
angular.module('app')
    .config(function($provide) {
        $provide.decorator('$exceptionHandler', ['$log', '$delegate', '$injector',
            function($log, $delegate, $injector) {

                return function(exception, cause) {

                    var $state = $injector.get("$state");
                    var $rootScope = $injector.get("$rootScope");

                    $delegate(exception, cause);

                    var scopeError = $(cause).hasClass("ng-scope");

                    if (!cause || cause === false) {
                        $rootScope.$broadcast('uiErrorOccured', {
                            errorType: "js",
                            exception: exception
                        });
                    }
                    else {
                        $state.go('app.misc.error501', {
                            exception: exception,
                            cause: cause
                        });
                    }
                };
            }
        ]);
    });