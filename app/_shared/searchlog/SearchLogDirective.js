angular.module('app.utils')
  .directive('searchLog', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        args: '=',
        show: '=',
        idSuffix: '@',
        entity: '@',
      },
      controller: 'SearchLogController',
      template: `
        <article class="col-sm-12" ng-show="show">
          <view-jq-grid
            parent-width="true"
            grid-id="search-log-{{idSuffix}}"
            grid-data="gridData"
            single-click="fillArguments(rowId)"
            load-complete="formatArguments()" />
        </article>
      `,
      link(scope, element) {
        // hide jqGrid column names
        element.find('.ui-jqgrid-hdiv').hide();
      },
    };
  });
