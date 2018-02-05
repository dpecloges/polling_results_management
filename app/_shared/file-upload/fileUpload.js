angular.module('app.utils')
  .directive('fileUpload', [function() {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        value: '=',
      },
      link(scope, element, attrs) {
        element.bind('change', event => {
          scope.value = event.target.files[0];
        });
      }
    };
  }]);
