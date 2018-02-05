angular.module('app.utils').factory('ViewJqGridService', [
  'authService',
  function(authService) {

    var retrieveData = function(myGrid, args, searchEntity) {
      var searchString = JSON.stringify(args);

      for (var i = 0; i < myGrid.length; i++) {
        if (myGrid[i].grid) {
          showLoading(myGrid[i].getAttribute('id'), true);
          break;
        }
      }
      
      myGrid.jqGrid('setGridParam', {
        ajaxGridOptions: {
          xhrFields: {withCredentials: true},
          beforeSend(xhr) {
            if (authService.getToken()) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + authService.getToken());
            }
          }
        },
        search: true,
        page: 1,
        postData: {searchString, searchEntity}
      })
          .trigger('reloadGrid');
    };

    var getRowObject = function(myGrid, id) {
      return myGrid.jqGrid('getRowData', id);
    };

    var getAllRowIds = function(myGrid) {
      return myGrid.jqGrid('getDataIDs');
    };
    
    var getSelectedRow = function(myGrid) {
      return myGrid.jqGrid('getGridParam', 'selrow');
    };

    var getSelectedRows = function(myGrid) {
      return myGrid.jqGrid('getGridParam', 'selarrrow');
    };

    var getRowCellValue = function(myGrid, rowId, colName) {
      return myGrid.jqGrid('getCell', rowId, colName);
    };

    var hasRows = function(myGrid) {
      return (myGrid.getGridParam('reccount') > 0);
    };

    var resizeGrid = function(myGrid) {
      myGrid.jqGrid('setGridWidth', $('#content').width());
    };

    var clearGrid = function(myGrid) {
      var rowIds = myGrid.jqGrid('getDataIDs');
      //Iterate through the rows and delete each of them
      for (var i = 0, len = rowIds.length; i < len; i++) {
        var currRow = rowIds[i];
        myGrid.jqGrid('delRowData', currRow);
      }
    };

    var reloadGrid = function(myGrid) {
      myGrid.trigger('reloadGrid');
    };

    var getSelectedRowCount = function(myGrid) {
      return myGrid.jqGrid('getGridParam', 'selarrrow').length;
    };

    var getAllRowCount = function(myGrid) {
      return myGrid.jqGrid('getDataIDs').length;
    };
    
    var addNavButton = function(myGrid, options) {
      var opts = options || {};
      var gridId = myGrid.attr('id');
      var gridSelector = '#' + gridId;
      var pagerId = $('[grid-id=' + gridId +']').find('.ui-jqgrid-pager').attr('id');
      var pagerSelector = '#' + pagerId;
      var pagerLeft = pagerId + '_left';
      var pagerLeftSelector = '#' + pagerLeft;
      var tooltipMessage = opts.tooltip || '';
  
      var caption = opts.caption || '';
      var buttonicon = (opts.buttonicon || '');
      var position = opts.position || 'last';
      var noop = function() {};
      var onClickButton = opts.onClickButton || noop;
      
      $(gridSelector).jqGrid('navButtonAdd', pagerSelector, { 
          id: buttonId,
          caption: caption, 
          buttonicon: buttonicon + ' tmpNavButton', 
          position: 'last',
          onClickButton: onClickButton
      });
      
      var buttonId = opts.id? `id="${opts.id}"`: '';
      var tooltip = tooltipMessage? ` data-tooltip-placement="right" data-tooltip="${tooltipMessage}" `: '';
      $(pagerLeftSelector).find('.ui-icon.tmpNavButton').wrap(`<button ${buttonId} class="btn-cr-rounded ui-jqgrid-pager-custom-btn" ${tooltip} button-prepend="${buttonicon}"><i class="${buttonicon}"></i></button>`).removeClass();
    }
    
    var setCell = function(myGrid, rowId, columnName, cellValue) {
      return myGrid.jqGrid('setCell', rowId, columnName, cellValue);
    };

    var showLoading = function(gridId, show) {
      let showLoadingElement = $('#load_' + gridId);
      
      if (show) {
        showLoadingElement.show();
      } else {
        showLoadingElement.hide();
      }
    };

    return {
      retrieveData,
      getRowObject,
      getAllRowIds,
      getSelectedRow,
      getSelectedRows,
      getRowCellValue,
      hasRows,
      resizeGrid,
      clearGrid,
      reloadGrid,
      getSelectedRowCount,
      getAllRowCount,
      showLoading,
      setCell,
      addNavButton,
    };
  }
]);
