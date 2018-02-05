/**
 * Angular-UI-Toggle
 * Display a simple UI-Toggle control
 *
 * @see <a href="https://github.com/adamgian/angular-ui-toggle">Angular-UI-Toggle</a>
 *
 * @param {boolean} [ngModel] Model to bind to
 * @param {string} [class] Optional class style to apply
 * @param {boolean} [disabled=false] Whether to disable the toggle
 * @param {boolean} [ngDisabled=false] Alternate binding for `disabled`
 * @param {function} [ngChange] Function to call as ({value}) on value change
 */
angular.module('app.utils').directive('uiToggle', [function() {
  return {
    restrict: 'E',
    scope: {
      label: '@?',
      class: '@?',
      disabled: '=ngDisabled',
      ngChange: '&?',
      ngModel: '=',
    },
    template: `
    <label class="ui-toggle-text">{{label}}</label>
    <span class="ui-toggle" ng-class="class" ng-click="toggleState()">
      <input type="checkbox"
        ng-model="ngModel"
        ng-disabled="disabled">
      <div class="ui-toggle__track"></div>
      <div class="ui-toggle__thumb"></div>
    </span>
    `,
    controller($scope) {
      $scope.toggleState = () => {
        if ($scope.ngChange) $scope.ngChange({ value: $scope.ngModel });
      };
    },
  };
}]);
