angular.module('app.rs')
  .directive('sidebar', [function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        id: '@',
        opened: '=',
      },
      template: `
        <div id="{{id}}" class="sidenav" ng-class="{ 'sidenav-open': opened }">
          <a href="javascript:void(0)" class="closebtn"" ng-click="close()">
            <i class="fa fa-times"></i>
          </a>
          <div ng-transclude></div>
        </div>
        <div ng-class="{ 'overlay': opened }"><div>
      `,
      link(scope, element, attrs) {
        scope.close = () => {
          scope.opened = false;
        };
      }
    };
  }]);
