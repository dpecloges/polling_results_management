angular.module('app.rs')
  .directive('breadcrumb', [function() {
    return {
      restrict: 'E',
      template: `
        <ul id="breadcrumbs-four" class="breadcrumb-ul">
          <li ng-repeat="item in crumbs">
            <span><a class="cr-breadcrumbs-a" ng-click="clicked(item)">{{item.text}}</a></span>
          </li>
        </ul>
      `,
      scope: {
        crumbs: '=',
        onClick: '&?',
      },
      link(scope) {
        scope.clicked = item => {
          if (scope.onClick) {
            scope.onClick({ item });
          }
        };
      }
    };
  }]);
