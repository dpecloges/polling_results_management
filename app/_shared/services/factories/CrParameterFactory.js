angular.module('app.utils').factory('CrParameter', [
    '$resource',
    '$rootScope',
    function($resource, $rootScope) {
        
        return $resource($rootScope.crParameterById, null,
                {
                    'getByCategory':{
                        url: $rootScope.crParameterByIdUrl,
                        method: "GET",
                        isArray: true,
                        cache: true
                    },
                    'getByCode':{
                        url: $rootScope.crParameterByCodeUrl,
                        method: "GET",
                        isArray: true,
                        cache: true
                    },
                    'getByIds':{
                        url: $rootScope.crParameterByIds,
                        method: "GET",
                        isArray: true,
                        cache: true
                    }
                }
        );
    }
]);