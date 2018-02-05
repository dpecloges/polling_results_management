'use strict';

/**
 * Directive για jqGrid το οποίο θα διαχειρίζεται local data (clientArray)
 */
angular.module('app.utils').directive('localJqGrid', [
    '$rootScope',
    '$compile',
    '$timeout',
    function ($rootScope, $compile, $timeout) {
        var jqGridCounter = 0;

        return {
            replace: true,
            restrict: 'E',
            scope: {
                gridId: '@',
                gridData: '='
            },
            template: '<div>' +
                '<table></table>' +
                '<div class="jqgrid-pagination"></div>' +
                '</div>',
            controller: function($scope){

                //Διατήρηση στο $scope της τρέχουσας γραμμής που βρίσκεται υπό επεξεργασία
                //έτσι ώστε να μην επιτρέπεται επεξεργασία άλλης γραμμής εάν δεν έχει ολοκληρωθεί
                $scope.currentEditingRow = null;

                //Επεξεργασία γραμμής
                $scope.editRow  = function(rowId){
                    if (!$scope.currentEditingRow) {
                        var aButtonElement = jQuery.find('table#'+$scope.gridId+' a#jEditButton_'+rowId);
                        jQuery.fn.fmatter.rowactions.call(aButtonElement, "edit");
                        $scope.currentEditingRow = rowId;
                    }
                };

                //Καταχώρηση των αλλαγών στη γραμμή
                $scope.saveRow  = function(rowId){
                    var aButtonElement = jQuery.find('table#'+$scope.gridId+' a#jSaveButton_'+rowId);
                    jQuery.fn.fmatter.rowactions.call(aButtonElement, "save");
                };

                //Ακύρωση των αλλαγών στη γραμμή
                $scope.restoreRow  = function(rowId){
                    var aButtonElement = jQuery.find('table#'+$scope.gridId+' a#jCancelButton_'+rowId);
                    jQuery.fn.fmatter.rowactions.call(aButtonElement, "cancel");
                };
            },
            link: function (scope, element) {

                var table = element.find('table');
                table.attr('id', scope.gridId);

                var pagerId = scope.gridId + '-pager';

                element.find('.jqgrid-pagination').attr('id', pagerId);

                var widthSelector = element.find('table').parent();

                var localActionsList = $.grep(scope.gridData.colModel, function(e) {
                    return e.name == 'localActions';
                });
                if(localActionsList[0]) {
                    localActionsList[0].formatter = function(cellvalue, options, rowObject) {

                        var be = '<a id="jEditButton_'+options.rowId+'" class="btn btn-link ui-inline-edit" style="padding:1px;" ng-click="editRow('+options.rowId+')"><i class="fa fa-edit" style="color:navy;font-size:18px;" data-rel="tooltip" title="Επεξεργασία"></i></a>';
                        var se = '<a id="jSaveButton_'+options.rowId+'" class="btn btn-link ui-inline-save" style="padding:1px;display:none" ng-click="saveRow('+options.rowId+')"><i class="fa fa-check" style="color:darkgreen;font-size:18px;" data-rel="tooltip" title="Καταχώριση"></i></a>';
                        var ca = '<a id="jCancelButton_'+options.rowId+'" class="btn btn-link ui-inline-cancel" style="padding:1px;display:none" ng-click="restoreRow('+options.rowId+')"><i class="fa fa-times" style="color:red;font-size:18px;" data-rel="tooltip" title="Ακύρωση"></i></a>';

                        return "<div style='margin: 0 auto;'>" + be + se + ca + "</div>";

                    };
                    localActionsList[0].formatoptions = {
                        keys: true,
                        afterSave: function () {
                            scope.currentEditingRow = null;
                        },
                        afterRestore: function () {
                            scope.currentEditingRow = null;
                        },
                        url: "clientArray" //Η διαχείριση των όρων γραμματικής γίνεται ασύγχρονα
                    }
                }


                table.jqGrid({
                    caption: scope.gridData.caption,
                    data : scope.gridData.data,
                    datatype : "local",
                    height : '100%',
                    colNames : scope.gridData.colNames || [],
                    colModel : scope.gridData.colModel || [],
                    rowNum : 1000,
                    rowList : [10, 20, 30],
                    pager : (scope.gridData.hidePager == true ? '' : '#' + pagerId),
                    sortname: scope.gridData.sortname,
                    sortorder: scope.gridData.sortorder,
                    toolbarfilter : true,
                    viewrecords : true,
                    //editurl : "dummy.html",
                    editurl: 'clientArray',
                    multiselect : scope.gridData.multiselect,
                    autowidth : true,
                    shrinkToFit : scope.gridData.shrinkToFit,
                    beforeSelectRow(rowId, e) {

                    }
                });
                table.jqGrid('navGrid', '#' + pagerId, {
                    edit : false,
                    add : false,
                    del : true
                });
                table.jqGrid('inlineNav', '#' + pagerId);

                element.find(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
                element.find(".ui-jqgrid-view").children().removeClass("ui-widget-header ui-state-default");
                element.find(".ui-jqgrid-labels, .ui-search-toolbar").children().removeClass("ui-state-default ui-th-column ui-th-ltr");
                element.find(".ui-jqgrid-pager").removeClass("ui-state-default");
                element.find(".ui-jqgrid").removeClass("ui-widget-content");

                // add classes
                element.find(".ui-jqgrid-htable").addClass("table table-bordered table-hover");
                element.find(".ui-jqgrid-btable").addClass("table table-bordered table-striped");

                element.find(".ui-pg-div").removeClass().addClass("btn btn-sm btn-primary");
                element.find(".ui-icon.ui-icon-plus").removeClass().addClass("fa fa-plus");
                element.find(".ui-icon.ui-icon-pencil").removeClass().addClass("fa fa-pencil");
                element.find(".ui-icon.ui-icon-trash").removeClass().addClass("fa fa-trash-o");
                element.find(".ui-icon.ui-icon-search").removeClass().addClass("fa fa-search");
                element.find(".ui-icon.ui-icon-refresh").removeClass().addClass("fa fa-refresh");
                element.find(".ui-icon.ui-icon-disk").removeClass().addClass("fa fa-save").parent(".btn-primary").removeClass("btn-primary").addClass("btn-success");
                element.find(".ui-icon.ui-icon-cancel").removeClass().addClass("fa fa-times").parent(".btn-primary").removeClass("btn-primary").addClass("btn-danger");

                element.find(".ui-icon.ui-icon-seek-prev").wrap("<div class='btn btn-sm btn-default'></div>");
                element.find(".ui-icon.ui-icon-seek-prev").removeClass().addClass("fa fa-backward");

                element.find(".ui-icon.ui-icon-seek-first").wrap("<div class='btn btn-sm btn-default'></div>");
                element.find(".ui-icon.ui-icon-seek-first").removeClass().addClass("fa fa-fast-backward");

                element.find(".ui-icon.ui-icon-seek-next").wrap("<div class='btn btn-sm btn-default'></div>");
                element.find(".ui-icon.ui-icon-seek-next").removeClass().addClass("fa fa-forward");

                element.find(".ui-icon.ui-icon-seek-end").wrap("<div class='btn btn-sm btn-default'></div>");
                element.find(".ui-icon.ui-icon-seek-end").removeClass().addClass("fa fa-fast-forward");

                element.find('.ui-jqgrid-bdiv').addClass(scope.gridData.customClass);

                $timeout(function() {
                    //Resize grid to fit page size
                    table.jqGrid('setGridWidth', widthSelector.width());
                });

                //Also resize grid on window resize
                $(window).on('resize.jqGrid', function() {
                    table.jqGrid('setGridWidth', widthSelector.width());
                });

                //Resize grid when on toggle menu actions
                $rootScope.$on('menuToggleChanged', function() {
                    table.jqGrid('setGridWidth', widthSelector.width());
                });

                $compile(element.contents())(scope);
            }
        }
}]);