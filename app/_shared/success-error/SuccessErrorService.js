'use strict';

angular.module('app.utils').service('SuccessErrorService', ['$translate', '$log',
    function($translate, $log) {
        
        function initialize(scope) {
            scope.alerts = [];
        }
        
        function showSuccess(scope, message) {
            viewAlert(scope, 'success', true, false, message);
        }
        function showSuccessList(scope, message) {
            viewAlert(scope, 'success', true, true, message);
        }
        function addSuccess(scope, message) {
            viewAlert(scope, 'success', false, false, message);
        }
        function addSuccessList(scope, message) {
            viewAlert(scope, 'success', false, true, message);
        }
        
        function showError(scope, message) {
            viewAlert(scope, 'error', true, false, message);
        }
        function showErrorList(scope, message) {
            viewAlert(scope, 'error', true, true, message);
        }
        function addError(scope, message) {
            viewAlert(scope, 'error', false, false, message);
        }
        function addErrorList(scope, message) {
            viewAlert(scope, 'error', false, true, message);
        }
        
        function showInfo(scope, message) {
            viewAlert(scope, 'info', true, false, message);
        }
        function showInfoList(scope, message) {
            viewAlert(scope, 'info', true, true, message);
        }
        function addInfo(scope, message) {
            viewAlert(scope, 'info', false, false, message);
        }
        function addInfoList(scope, message) {
            viewAlert(scope, 'info', false, true, message);
        }
        
        function showWarning(scope, message) {
            viewAlert(scope, 'warning', true, false, message);
        }
        function showWarningList(scope, message) {
            viewAlert(scope, 'warning', true, true, message);
        }
        function addWarning(scope, message) {
            viewAlert(scope, 'warning', false, false, message);
        }
        function addWarningList(scope, message) {
            viewAlert(scope, 'warning', false, true, message);
        }
        
        function apiValidationErrors(scope, data, mainMsg) {
            if(data.errors) {
                var errorMsg = mainMsg ? (mainMsg + '<br/>') : '';
                
                for(var i = 0; i < data.errors.length; i++) {
                    errorMsg += data.errors[i].errorMessage;
                    if(i < data.errors.length) errorMsg += '<br/>';
                }
                
                addError(scope, errorMsg);
            }
            else {
                $log.error('Υπάρχει bug στον κώδικα ή πρόβλημα στα δεδομένα.');
            }
        }
        
        
        function viewAlert(scope, type, doClear, isList, message) {
            
            //Καθαρισμός alerts αν έχει δηλωθεί ή αρχικοποίησή τους αν δεν έχουν ήδη οριστεί.
            if(doClear || !scope.alerts) {
                initialize(scope)
            }
            
            //Αν έχει δοθεί λίστα μηνυμάτων, τότε αυτά ενώνονται σε ένα string διαχωρισμένο με <br/>.
            if(isList) {
                message = concatMessageList(message);
            }
            
            if(type === 'success') {
                var successMsg = message || $translate.instant('global.save.success');
                scope.alerts.push({type: 'success', msg: successMsg});
            }
            else if(type === 'error') {
                scope.alerts.push({type: 'danger', msg: message});
            }
            else if(type === 'info') {
                scope.alerts.push({type: 'info', msg: message});
            }
            else if(type === 'warning') {
                scope.alerts.push({type: 'warning', msg: message});
            }
        }
        
        /**
         * Show runtime errors occured in API calls and stored in $rootScope.errorList
         * @param scope
         * @param errors
         */
        function onRootScopeError(scope, {errors = []}) {
            
            scope.alerts = scope.alerts || [];
            
            if(!errors.length) return;
            
            // For each error in the list a new danger alert is being constructed
            // Attributes shown are errorId, errorStatus, errorUrl, errorText and errorSqlMessage
            errors.forEach(function(error, i) {
                if(error.errorType === "http") {
                    // Http Errors
                    if(!error.errorId) {
                        scope.alerts.push({
                            type: 'danger',
                            msg: error.text
                        });
                    }
                    else {
                        scope.alerts.push({
                            type: 'danger',
                            msg: "<strong>" + $translate.instant('global.error.errorId') + ": " + error.errorId + "</strong>" +
                            "<br/>" + $translate.instant('global.error.status') + ": " + error.status +
                            " - " + $translate.instant('global.error.url') + ": " + error.url +
                            " - " + error.text + (error.sqlMessage ? (" - " + error.sqlMessage) : "") + (error.causeMessage ? (" - " + error.causeMessage) : "")
                        });
                    }
                }
                else {
                    // Javascript Errors
                    scope.alerts.push({
                        type: 'danger',
                        msg: "<strong>" + $translate.instant('global.page501.exception.message') + ": " + error.exception.message + "</strong>" +
                        "<br/>" + $translate.instant('global.page501.exception.fileName') + ": " + error.exception.fileName +
                        "<br/>" + $translate.instant('global.page501.exception.filePosition') + ": " + error.exception.lineNumber + "/" + error.exception.columnNumber +
                        "<br/>" + $translate.instant('global.page501.exception.stack') + "<pre>" + error.exception.stack + "</pre>"
                    });
                }
            });
        }
        
        function concatMessageList(messageList) {
            var message = '';
            
            for(var i = 0; i < messageList.length; i++) {
                message += messageList[i];
                if(i < message.length) message += '<br/>';
            }
            
            return message;
        }
        
        
        return {
            initialize,
            showSuccess,
            showSuccessList,
            addSuccess,
            addSuccessList,
            showError,
            showErrorList,
            addError,
            addErrorList,
            showInfo,
            showInfoList,
            addInfo,
            addInfoList,
            showWarning,
            showWarningList,
            addWarning,
            addWarningList,
            apiValidationErrors,
            onRootScopeError
        };
    }
]);
