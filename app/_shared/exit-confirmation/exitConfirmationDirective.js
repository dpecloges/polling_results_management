'use strict';

angular.module('app.utils').directive('exitConfirmation', [
    '$ngBootbox',
    '$rootScope',
    '$state',
    '$translate',
    function($ngBootbox, $rootScope, $state, $translate) {
    
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            
            //Ανάκτηση φόρμας από το name attribute του element που έχει δηλωμένο το directive.
            var form = scope[attrs.name];
            
            //Προσθήκη listener πριν την αλλαγή state
            var cleanupFunc = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
                
                //Εξαίρεση των μεταβάσεων που προσδιορίζουν την παράμετρο action με τιμές init, save και cancel
                if(toParams.action && (toParams.action === 'init' || toParams.action === 'save' || toParams.action === 'cancel')) {
                    form.$dirty = false;
                }
                
                //Αν έχει αλλάξει κάποιο πεδίο της φόρμας
                if(form.$dirty) {
                    
                    //Ορισμός μεταβλητής confirmingExit σε ΝΑΙ
                    $rootScope.confirmingExit = 'YES';
                    
                    //Δε συνεχίζει η μετάβαση στο state προορισμού.
                    event.preventDefault();
                    
                    //Bootbox επιβεβαίωσης
                    $ngBootbox.customDialog({
                        message: $translate.instant('global.exitConfirmation.message'),
                        className: '',
                        buttons: {
                            confirm: {
                                label: $translate.instant('global.confirm'),
                                className: 'btn-success',
                                callback: function() {
                                    //Ορισμός του $dirty σε false για να μη βγει ξανά η επιβεβαίωση.
                                    form.$dirty = false;
                                    
                                    //Ορισμός μεταβλητής confirmingExit σε OXI
                                    $rootScope.confirmingExit = 'NO';
                                    
                                    //Καθαρισμός του listener
                                    cleanupFunc();
                                    
                                    //Μετάβαση στο state προορισμού
                                    $state.go(toState, toParams);
                                }
                            },
                            cancel: {
                                label: $translate.instant('global.cancel'),
                                className: 'btn-danger',
                                callback: function() {
                                    //Δε γίνεται καμία ενέργεια.
                                }
                            }
                        }
                    });
                    
                }
                else {
                    //Ορισμός μεταβλητής confirmingExit σε OXI
                    $rootScope.confirmingExit = 'NO';
                    
                    //Καθαρισμός του listener
                    cleanupFunc();
                }
            });
            
            
            //Αλλαγή της σειράς των listeners πάνω στο $stateChangeStart
            //Ο παρών listener μπαίνει πρώτος στη λίστα.
            //http://stackoverflow.com/questions/17451382/angularjs-on-event-handler-trigger-order
            //Dirty hack
            var listenersArray = $rootScope.$$listeners.$stateChangeStart;
            var listener = listenersArray[listenersArray.length - 1];
            listenersArray.splice(listenersArray.length - 1, 1);
            listenersArray.unshift(listener);
            
            
            
            //Εμφάνιση ειδοποίησης στην αλλαγή της σελίδας
            //Δεν παίζει πολύ καλά
            
            //window.onbeforeunload = function() {
            //    if(form.$dirty) {
            //        return "Changes have been made.";
            //    }
            //};
            
            //$(window).bind("beforeunload",function(event) {
            //    if(form.$dirty) {
            //        return "Changes have been made.";
            //    }
            //});
            
        }
    };
    
}]);