'use strict';

angular.module('app.utils').directive('crCheckbox', function () {
    
    return {
        restrict: 'E',                
        templateUrl: 'app/_shared/cr-checkbox/cr-checkbox.tpl.html',
        replace: true,
        scope: {
            model: '=',
            name: '@',
            disabled: '=ngDisabled', 
            change: '&',
            changeable: "&?",
            description: '@'
        }
    };
    
    //The change() function is called on the ng-change of the checkbox, but strangely if the model is accessed inside it, it still has the previous value.
    //Enclosing the function contents in a $timeout fixes the problem.
});