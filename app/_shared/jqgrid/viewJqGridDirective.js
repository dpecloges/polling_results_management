(function () {
  
  'use strict';
  
  angular.module('app.utils').directive('viewJqGrid', [
    '$rootScope',
    '$compile',
    '$translate',
    '$timeout',
    '$location',
    '$window',
    '$log',
    'SuccessErrorService',
    'ExportService',
    'ViewJqGridService',
    'authService',
    'ENV_VARS',
    function ($rootScope, $compile, $translate, $timeout, $location, $window, $log, SuccessErrorService, ExportService, ViewJqGridService, authService, ENV_VARS) {
      return {
        replace: true,
        restrict: 'E',
        scope: {
          gridId: '@',
          gridData: '=',
          viewUrl: '@',
          printUrl: '@',
          retrieveData: '&',
          multiselect: '=',
          firstAction: '&',
          secondAction: '&',
          loadComplete: '&',
          gridComplete: '&',
          onInit: '&',
          loadError: '&',
          rowAttr: '&?',
          singleClick: '&',
          doubleClick: '&',
          parentWidth: '@',
          successErrorApi: '=',
          onPagingRecords: '&?',
          exportArgs: '&?'
        },
        template: `
                  <div>
                    <success-error alerts="alerts"></success-error>
                    <table></table>
                    <div class="jqgrid-pagination"></div>
                  </div>
                `,
        link(scope, element) {
          
          var table = element.find('table');
          table.attr('id', scope.gridId);
          
          var pagerId = scope.gridId + '-pager';
          element.find('.jqgrid-pagination').attr('id', pagerId);
          
          var widthSelector = scope.parentWidth ? element.find('table').parent() : $('#content');
          
          //Προσθήκη extraActions για άνοιγμα κι εκτύπωση εγγραφής αν είναι δηλωμένες οι παράμετροι viewUrl και printUrl αντίστοιχα.
          //Αυτό αντικαθιστά τυχόν δηλωμένα extraActions στα gridData.
          if (scope.viewUrl || scope.printUrl) {
            var extraActionsList = $.grep(scope.gridData.colModel, function (e) {
              return e.name == 'extraActions';
            });
            if (extraActionsList[0]) {
              extraActionsList[0].formatter = function (cellvalue, options, rowObject) {
                
                var viewAction = '';
                var printAction = '';
                var iconColor = 'blue-color';
                //Αν αφορά πράξη: αν η πράξη είναι διαγραμμένη εμφανίζεται κόκκινο, αν είναι οριστικοποιημένη πράσινο, διαφορετικά μπλε
                if (scope.viewUrl) {
                  var viewIcon = "<i class='fa fa-edit " + iconColor + "' style='font-size:18px;' tooltip='Άνοιγμα' tooltip-placement='right'></i>";
                  viewAction = '<a class="btn btn-link" style="padding:0;" href="#/' + scope.viewUrl + rowObject.id + '" target="_blank">' + viewIcon + '</a>&nbsp;';
                }
                
                if (scope.printUrl) {
                  var printIcon = "<i class='fa fa-print " + iconColor + "' style='font-size:18px;' tooltip='Εκτύπωση' tooltip-placement='right'></i>";
                  printAction = '<a class="btn btn-link" style="padding:0;" ng-click="doPrint(' + rowObject.id + ')">' + printIcon + '</a>&nbsp;';
                }
                
                return viewAction + printAction;
              }
            }
          }
          
          //Μεταβλητή που καθορίζει αν θα τρέξει το initialize του SuccessError στη φόρτωση του grid
          scope.successErrorInitializationDisabled = false;
          
          let shrinkToFit = ((scope.gridData.shrinkToFit === undefined) ? true : scope.gridData.shrinkToFit);
          
          table.jqGrid({
            url: scope.gridData.url,
            datatype: 'json',
            mtype: 'GET',
            multiselect: scope.multiselect,
            caption: scope.gridData.caption,
            sortname: scope.gridData.sortname,
            sortorder: scope.gridData.sortorder,
            recordtext: $translate.instant('global.grid.recordText'),
            emptyrecords: $translate.instant('global.grid.emptyRecords'),
            loadtext: $translate.instant('global.grid.loadText'),
            pgtext: $translate.instant('global.grid.pgText'),
            rownumbers: scope.gridData.rownumbers,
            height: 'auto',
            colNames: scope.gridData.colNames || [],
            colModel: scope.gridData.colModel || [],
            rowNum: scope.gridData.rowNum || 100,
            rowList: scope.gridData.rowList || [100, 200, 500],
            pager: scope.gridData.pager || '#' + pagerId,
            toolbarfilter: true,
            viewrecords: true,
            shrinkToFit: shrinkToFit,
            footerrow: scope.gridData.footerrow,
            jsonReader: {
              root: 'content',
              total: 'totalPages',
              records: 'totalElements',
              page: 'page' + 1
            },
            gridview: true,
            rowattr: function (rd) {
              if (scope.rowAttr) {
                //Custom rowattr function
                return scope.rowAttr({rd: rd});
              }
            },
            gridComplete() {
              //table.jqGrid('getDataIDs').forEach(function(id) {
              //    var extraActions = scope.extraActions({id});
              //    table.jqGrid('setRowData', id, {extraActions});
              //});
              
              //Custom function to be run in grid complete
              scope.gridComplete();
            },
            loadComplete() {
              
              if (ENV_VARS.sessionTimeoutEnabled === 'true') {
                authService.setSessionTimeoutTime();
              }
              
              //Resize grid
              table.jqGrid('setGridWidth', widthSelector.width());
              
              $($('.ui-jqgrid-bdiv').find('table')[0]).css('max-width', 'none');
              
              //Compile the dynamically created elements
              $compile(element.contents())(scope);
              
              if (!scope.successErrorInitializationDisabled) {
                //Clear success-error
                SuccessErrorService.initialize(scope);
              }
              scope.successErrorInitializationDisabled = false;
              
              ViewJqGridService.showLoading(scope.gridId, false);
              
              //Custom function to be run in load complete
              scope.loadComplete();
            },
            loadError: function (xhr, status, error) {
              SuccessErrorService.initialize(scope);
              
              if (!xhr.responseJSON) {
                
                $rootScope.$broadcast('uiErrorOccured', {
                  errorType: 'http',
                  text: $translate.instant('global.grid.general.error')
                });
              }
              else {
                if (xhr.responseJSON.errorId) {
                  
                  $log.error('Error: ' + xhr.responseJSON.errorId);
                  
                  $rootScope.$broadcast('uiErrorOccured', {
                    errorType: 'http',
                    errorId: xhr.responseJSON.errorId,
                    url: xhr.responseJSON.url,
                    status: xhr.status,
                    text: xhr.responseJSON.errorMessage,
                    data: xhr.responseJSON.exception.stackTrace,
                    sqlMessage: xhr.responseJSON.sqlMessage,
                    causeMessage: xhr.responseJSON.causeMessage
                  });
                }
                SuccessErrorService.apiValidationErrors(scope, xhr.responseJSON);
              }
              
              ViewJqGridService.showLoading(scope.gridId, false);
              
              //Custom function to be run in load error
              scope.loadError();
            },
            onSelectRow(rowId) {
              //Custom singleClick function
              scope.singleClick({rowId: rowId});
            },
            ondblClickRow(rowId) {
              if (scope.viewUrl) {
                //Αν είναι δηλωμένο το viewUrl, με διπλό κλικ ανοίγει η εγγραφή.
                $location.path(scope.viewUrl + rowId);
              }
              else {
                //Αλλιώς
                //Custom doubleClick function
                scope.doubleClick({id: rowId});
              }
            },
            loadBeforeSend(xhr, settings) {
              //Prevent grid loading on page load
              this.p.loadBeforeSend = null; //remove event handler
              return false; //don't send load data request
            },
            onPaging(pgButton) {
              //If a custom method is defined on 'onPaging[records]' event, default retrieve is not executed
              if (pgButton == 'records' && scope.onPagingRecords) {
                scope.onPagingRecords();
                return 'stop';
              }
              else {
                if (!$('#' + pgButton).hasClass('ui-state-disabled')) {
                  ViewJqGridService.showLoading(scope.gridId, true);
                }
              }
            },
            onSortCol(index, iCol, sortorder) {
              ViewJqGridService.showLoading(scope.gridId, true);
            }
          });
          
          table.jqGrid('navGrid', '#' + pagerId, {edit: false, add: false, del: true});
          
          if (shrinkToFit && shrinkToFit === true) {
            element.find('.ui-jqgrid-bdiv').addClass('ui-jqgrid-shrinked');
          }
  
          scope.exportToExcelLoading = false;
  
          //Add Export to Excel button
          if(scope.gridData.excelUrl) {
    
            table.jqGrid('navButtonAdd',
                '#' + pagerId,
                {
                  caption: "",
                  buttonicon: "ui-export-to-excel fa fa-file-excel-o",
                  onClickButton: function() {
            
                    if($('#exportToExcelBtn').attr('disabled') == 'disabled') {
                      return;
                    }
            
                    var grid = $(this);
            
                    var columns = grid.closest(".ui-jqgrid-view").find("th:visible");
            
                    var colDefs = columns.map(function() {
                      return $(this).text();
                    }).get();
            
                    var colModel = $(grid.jqGrid('getGridParam', 'colModel'))
                        .filter(function() {
                          return this.hidden !== true;
                        });
            
                    var colMapping = {};
            
                    var rowData = grid.jqGrid('getRowData');
            
                    $.each(colDefs, function(i, v) {
                      colMapping[v.trim()] = colModel[i];
                    });
            
                    var colsFinal = ExportService.generateJqGridColsFinal(colDefs, colModel);
            
                    var title = $(".breadcrumb li:nth-child(2)").text();
                    if(!title) title = grid.closest(".ui-jqgrid-view").find(".ui-jqgrid-title").text();
            
                    var sortColumnName = grid.jqGrid('getGridParam', 'sortname');
                    var sortOrder = grid.jqGrid('getGridParam', 'sortorder');
                    var exportArgs = scope.exportArgs? scope.exportArgs(): scope.$parent.args;
            
                    ExportService.exportDataToExcel(scope, title, exportArgs,
                        JSON.stringify(colsFinal), sortColumnName, sortOrder);
                  },
                  position: "last"
                });
    
          }
  
          table.jqGrid('inlineNav', '#' + pagerId);
          
          element.find('.ui-jqgrid').removeClass('ui-widget ui-widget-content');
          element.find('.ui-jqgrid-view').children().removeClass('ui-widget-header ui-state-default');
          element.find('.ui-jqgrid-labels, .ui-search-toolbar').children().removeClass('ui-state-default ui-th-column ui-th-ltr');
          element.find('.ui-jqgrid-pager').removeClass('ui-state-default');
          element.find('.ui-jqgrid').removeClass('ui-widget-content');
          
          //add classes
          element.find('.ui-jqgrid-htable').addClass('table table-bordered table-hover');
          element.find('.ui-jqgrid-btable').addClass('table table-bordered');
          if (!scope.rowAttr) {
            //Ο πίνακας είναι striped αν δεν έχει δηλωθεί η μέθοδος rowAttr
            element.find('.ui-jqgrid-btable').addClass('table-striped');
          }
          
          element.find('.ui-icon.ui-icon-seek-prev').wrap('<button type="button" class="btn-cr-rounded"><i class="fa fa-backward txt-color-blue"></i></button>');
          element.find('.ui-icon.ui-icon-seek-prev').removeClass();
          
          element.find('.ui-icon.ui-icon-seek-first').wrap('<button type="button" class="btn-cr-rounded"><i class="fa fa-fast-backward txt-color-blue"></i></button>');
          element.find('.ui-icon.ui-icon-seek-first').removeClass();
          
          element.find('.ui-icon.ui-icon-seek-next').wrap('<button type="button" class="btn-cr-rounded"><i class="fa fa-forward txt-color-blue"></i></button>');
          element.find('.ui-icon.ui-icon-seek-next').removeClass();
          
          element.find('.ui-icon.ui-icon-seek-end').wrap('<button type="button" class="btn-cr-rounded"><i class="fa fa-fast-forward txt-color-blue"></i></button>');
          element.find('.ui-icon.ui-icon-seek-end').removeClass();
  
          var exportToExcel = $translate.instant("global.grid.exportToExcel");
          var exportToExcelElement = element.find('.ui-icon.ui-export-to-excel');
  
          var newButton = $('<button>',
              {
                id: 'exportToExcelBtn',
                class: 'btn-cr-rounded ui-jqgrid-pager-custom-btn',
                'data-tooltip-placement': 'right',
                'data-tooltip': exportToExcel,
                'button-prepend': 'fa fa-file-excel-o greenColor',
                'ng-disabled': 'exportToExcelLoading',
                'cr-button-spinner': 'exportToExcelLoading'
              });
  
          exportToExcelElement.replaceWith(newButton);
          
          $timeout(function () {
            //Resize grid to fit page size
            table.jqGrid('setGridWidth', widthSelector.width());
          });
          
          //Also resize grid on window resize
          $(window).on('resize.jqGrid', function () {
            table.jqGrid('setGridWidth', widthSelector.width());
          });
          
          //Resize grid when this event is called.
          $rootScope.$on('resizeModalJqGrid', function () {
            table.jqGrid('setGridWidth', widthSelector.width());
          });
          
          //Resize grid when on toggle menu actions
          $rootScope.$on('menuToggleChanged', function () {
            table.jqGrid('setGridWidth', widthSelector.width());
          });
          
          //Resize grid on tab clicked
          $rootScope.$on('selectedTabChanged', function () {
            table.jqGrid('setGridWidth', widthSelector.width());
          });
          
          //Remove pager buttons
          element.find('.ui-icon.ui-icon-plus').parent().remove();
          element.find('.ui-icon.ui-icon-pencil').parent().remove();
          element.find('.ui-icon.ui-icon-trash').parent().remove();
          element.find('.ui-icon.ui-icon-search').parent().remove();
          element.find('.ui-icon.ui-icon-refresh').parent().remove();
          element.find('.ui-icon.ui-icon-disk').parent().remove();
          element.find('.ui-icon.ui-icon-cancel').parent().remove();
          
          //Enable tooltips [does not work]
          element.find('[data-rel=tooltip]').tooltip({'container': 'body'});
          
          $timeout(function () {
            // Run custom initializing code
            scope.onInit();
            
            //Compile the dynammically created elements
            $compile(element.contents())(scope);
          });
          
          
          //Ανάκτηση αν έχει δηλωθεί
          scope.retrieveData();
          
          
          /*
           * Μέθοδος εκτύπωσης
           */
          scope.doPrint = function (rowId) {
            if (scope.printUrl) {
              $window.open(`#/` + scope.printUrl + rowId, '_blank');
            }
          };
          
          /*
           * Μέθοδοι success/error για κλήση έξω από το directive
           */
          
          scope.initialize = function () {
            SuccessErrorService.initialize(scope);
          };
          
          scope.showSuccess = function (message) {
            SuccessErrorService.showSuccess(scope, message);
          };
          
          scope.apiValidationErrors = function (data) {
            SuccessErrorService.apiValidationErrors(scope, data);
          };
          
          scope.showWarningList = function (warnings) {
            SuccessErrorService.showWarningList(scope, warnings);
          };
          
          scope.addWarningList = function (warnings) {
            SuccessErrorService.addWarningList(scope, warnings);
          };
          
          scope.disableSuccessErrorInitialization = function () {
            scope.successErrorInitializationDisabled = true;
          };
          
          
          scope.successErrorApi = {
            initialize: scope.initialize,
            showSuccess: scope.showSuccess,
            apiValidationErrors: scope.apiValidationErrors,
            showWarningList: scope.showWarningList,
            addWarningList: scope.addWarningList,
            disableSuccessErrorInitialization: scope.disableSuccessErrorInitialization
          };
        }
        
      };
      
    }
  ]);
  
})();
