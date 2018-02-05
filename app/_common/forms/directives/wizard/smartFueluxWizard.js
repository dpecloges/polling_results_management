'use strict';

angular.module('SmartAdmin.Forms').directive('smartFueluxWizard', function () {
    return {
        restrict: 'A',
        scope: {
            smartWizardCallback: '&',
            editMode: '='
        },
        link: function (scope, element, attributes) {
            
            var wizard = element.wizard();
            var $form = element.find('form');
            
            //Validation στο 'Επόμενο' βήμα
            wizard.on('actionclicked.fu.wizard', function(e, data){
                
                if(data.direction==='next' && !$form.valid()) {
                    stepInvalid(e);
                }
                else {
                    stepValid();
                }
                
            });
            
            // //Παρακολούθηση της τιμής του πεδίου editMode
            // scope.$watch('editMode', function(newValue, oldValue) {
            //    
            //     //Σε επεξεργασία
            //     if(scope.editMode) {
            //         //Ενεργοποίηση όλων των βημάτων
            //         wizard.find('ul.steps li').toggleClass('complete', true);
            //         wizard.on('changed.fu.wizard', function (e, data) {
            //             wizard.find('ul.steps li').toggleClass('complete', true);
            //         });
            //
            //         //Validation στο πάτημα ενός βήματος
            //         wizard.on('stepclicked.fu.wizard', function(e, data){
            //
            //             if(!$form.valid()) {
            //                 stepInvalid(e);
            //             }
            //             else {
            //                 stepValid();
            //             }
            //
            //         });
            //     }
            //    
            // });
            
            //Τερματισμός wizard
            wizard.on('finished.fu.wizard', function (e, data) {
                var formData = {};
                _.each($form.serializeArray(), function(field){
                    formData[field.name] = field.value
                });
                if(typeof scope.smartWizardCallback() === 'function'){
                    scope.smartWizardCallback()(formData)
                }
            });
        }
    }
    
    function stepInvalid(e) {
        $('.clientErrorsDiv').css('visibility', 'visible');
        e.preventDefault();
    }
    
    function stepValid() {
        $('.clientErrorsDiv').css('visibility', 'hidden');
        $(document).find('.has-error').removeClass('has-error');
    }
    
});