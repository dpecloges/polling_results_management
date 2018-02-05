/**
 * Error Interceptor to handle errors happening in Http Requests
 * Internal Server Errors 500 etc.
 */
angular.module('app').factory('errorInterceptor',
    ['$q', '$rootScope', '$log', '$location', '$translate',
    function ($q, $rootScope, $log, $location, $translate) {

        return {
            request: function (config) {
                return config || $q.when(config);
            },
            requestError: function (request) {
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {

                var responseData = (response.data ? response.data : {});

                //Response Error Status 406
                //Ο χρήστης δεν είναι συνδεδεμένος στον OAM
                //Γίνεται redirection στο location του response
                if (response && response.status === 406) {
                    window.location.replace(response.data.location);
                }

                //Εάν το επιστρεφόμενο response είναι σε μορφή arraybuffer
                //(προς το παρόν στη διαδικασία δημιουργίας excel αρχείων)
                //πραγματοποιείται μετατροπή του σε μορφή JSON object ώστε
                //να είναι εφικτή η ομοιόμορφη διαχείριση τους
                if (response && response.config && response.config.responseType === "arraybuffer" && response.data) {

                    var responseDataView = new DataView(response.data);
                    var decoder = new TextDecoder("utf-8");
                    var responseDataString = decoder.decode(responseDataView);
                    responseData = JSON.parse(responseDataString);

                    //Συντόμευση του url στις μεθόδους δημιουργίας excel αρχείων
                    if (responseData && responseData.url) {
                        var indexOf = responseData.url.indexOf('excel?model');
                        if (indexOf > -1) {
                            responseData.url = responseData.url.substring(0, indexOf + 6);
                        }
                    }
                }

                if (response && response.status === 403) {
                    if (response.data && response.data.errorId) {
                        $log.error("Error 403: " + response.data.errorId);
                    }
                    $location.path('/403');
                }

                if (response && (response.status >= 500)) {
                    //Log the error to browser console
                    $log.error("Error 500: " + responseData.errorId);
                    //Broadcast the error
                    $rootScope.$broadcast('uiErrorOccured', {
                        errorType: "http",
                        errorId: responseData.errorId,
                        url: responseData.url,
                        status: response.status,
                        text: (responseData.errorMessage ? responseData.errorMessage : $translate.instant('global.error.generalError')),
                        data: (responseData.exception ? responseData.exception.stackTrace : null),
                        sqlMessage: responseData.sqlMessage,
                        causeMessage: responseData.causeMessage
                    });
                }

                return $q.reject(response);
            }
        };
    }]);
