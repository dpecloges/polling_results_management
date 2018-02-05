angular.module('app.utils').factory('ClientValidationService', [
    
    function() {
        
        var errorPlacement = function(error, element) {

            var elementName = (element.name === undefined ? element[0].name : element.name);
            var elementLocalName = (element.localName === undefined ? element[0].localName : element.localName);
            var elementSelector = $(elementLocalName + "[name=" + elementName + "]");

            error.appendTo(elementSelector.closest("div"));
        };

        var highlight = function(element) {
            $(element).closest('.form-group').addClass('has-error');
            $(element).closest('form').find('.clientErrorsDiv').addClass('clientErrorsDiv-visible');
        };

         var unhighlight = function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        };

        var success = function(label, element) {
            $(element).closest('.form-group').removeClass('has-error');
            label.remove();
        };

        var resetMessages = function(){
            $('.clientErrorsDiv').removeClass('clientErrorsDiv-visible');
        }

        return {
            errorPlacement: errorPlacement,
            highlight: highlight,
            unhighlight: unhighlight,
            success: success,
            resetMessages:resetMessages
        };
    }
]);