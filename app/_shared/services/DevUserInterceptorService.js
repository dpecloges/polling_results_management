/**
 * Dev User Http Interceptor
 * Session Timeout Refresh
 */
angular.module('app').factory('devUserInterceptor',
    ['$rootScope', '$cookies', '$injector', 'ENV_VARS',
    function ($rootScope, $cookies, $injector, ENV_VARS) {

        return {
            request: function (config) {

                config.headers = config.headers || {};

                var jwt = $cookies.get('access_token');

                if (jwt) {
                    config.headers['Authorization'] = 'Bearer ' + jwt;
                }

                return config;
            },
            response: function (response) {

                // Session Timeout Refresh
                if (ENV_VARS.sessionTimeoutEnabled === 'true') {
                    if (response && response.status && response.status === 200) {
                        if (response.config && response.config.url && response.config.url.indexOf($rootScope.baseUrl + '/cregapi/') > -1) {
                            var authService = $injector.get("authService");
                            authService.setSessionTimeoutTime();
                        }
                    }
                };

                return response || $q.when(response);
            }
        };
    }]);
