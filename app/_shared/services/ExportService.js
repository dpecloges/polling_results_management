/**
 * Service μεθόδων για τις μεθόδους εξαγωγής δεδομένων
 */
angular.module('app.utils').service('ExportService', [
    '$rootScope',
    '$http',
    '$log',
    '$translate',
    'FileSaver',
    'SuccessErrorService',
    function($rootScope, $http, $log, $translate, FileSaver, SuccessErrorService) {

        /**
         * JqGrid Column Generation
         * @param colDefs
         * @param colModel
         * @returns {*}
         */
        function generateJqGridColsFinal(colDefs, colModel) {

            return $.map(colDefs, function (v, k) {
                var type = typeof(colModel[k].formatter) != "undefined" ? colModel[k].formatter : "string";
                if (typeof(type) == "function") {
                    if (typeof(colModel[k].edittype != "undefined" && colModel[k].edittype == "checkbox")) {
                        type = "string";
                    }
                }

                if (colModel[k].name == "someUniqueColumnName") {
                    type = "blank";
                }

                return {
                    type: type,
                    width: typeof(colModel[k].width) != "undefined" ? colModel[k].width : null,
                    align: typeof(colModel[k].align) != "undefined" ? colModel[k].align : "left",
                    name: v,
                    alias: colModel[k].name
                };
            });

        }

        /**
         * @deprecated
         * JqGrid Data Generation
         *
         * Ενδεικτικό παράδειγμα χρήσης
         * var data = grid.tableToJSON({
         *               headings: colDefs,
         *               ignoreHiddenRows: true,
         *               ignoreEmptyRows: true,
         *               onlyColumns: columns.map(function () {
         *               return $(this).index();
         *         }).get()
         *  });
         *
         *  data = ExportService.generateJqGridData(colMapping, rowData, data);
         *
         * @param colMapping
         * @param rowData
         * @param data
         * @returns {*}
         */
        function generateJqGridData(colMapping, rowData, data) {

            return $.map(data, function (d, i) {

                var newObj = {};

                $.each(d, function (kk, vv) {
                    newObj[kk] = vv;
                    if (vv == null || vv.length < 1) {
                        var mdl = colMapping[kk.trim()];
                        if (typeof(mdl.edittype) != "undefined" && mdl.edittype == "icon") {
                            newObj[kk] = $(rowData[i][mdl.name]).data("original-title");
                        }
                        if (typeof(mdl.edittype) != "undefined" && mdl.edittype == "checkbox") {
                            newObj[kk] = rowData[i][mdl.name];
                        }
                    }
                });

                return newObj;
            });
        }

        /**
         * @deprecated
         * Αποθήκευση δεδομένων από jqGrid σε αρχείο Excel
         *
         * Ενδεικτικό παράδειγμα χρήσης
         * ExportService.exportJqGridDataToExcel(scope, title, JSON.stringify(colsFinal), JSON.stringify(data));
         *
         * @param scope Scope του ListJqGridDirective
         * @param title Τίτλος και όνομα αρχείου
         * @param columns Περιγραφή στηλών
         * @param data Δεδομένα γραμμών
         */
        function exportJqGridDataToExcel(scope, title, columns, data) {

            scope.exportToExcelLoading = true;

            $http({
                url: $rootScope.exportDataToExcelUrl,
                params: {
                },
                method: 'POST',
                data: {
                    title: title,
                    model: columns,
                    data: data
                },
                responseType: 'arraybuffer'
            }).then(function (response) {

                var file = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                var excelFileName = title + "_" + moment(new Date()).format('DD_MM_YYYY_HH_mm_ss') + ".xlsx";

                FileSaver.saveAs(file, excelFileName);

                $log.info("Excel file was created: " + excelFileName);

            }).catch(function (response) {

                $log.error(response);

            }).finally(function() {

                scope.exportToExcelLoading = false;
            });

        }

        /**
         * Αποθήκευση δεδομένων ευρετηρίου σε αρχείο Excel βάση των ορισμάτων
         *
         * @param scope Scope του ListJqGridDirective
         * @param title Τίτλος και όνομα αρχείου
         * @param args Ορίσματα ανάκτησης δεδομένων
         * @param columns Περιγραφή στηλών
         * @param sortColumnName Στήλη ταξινόμησης
         * @param sortOrder Σειρά ταξινόμησης
         */
        function exportDataToExcel(scope, title, args, columns, sortColumnName, sortOrder) {

            SuccessErrorService.initialize(scope);

            scope.exportToExcelLoading = true;
            
            $http({
                url: scope.gridData.excelUrl,
                params: {
                    title: title,
                    searchString: JSON.stringify(args),
                    sidx: sortColumnName,
                    sord: sortOrder
                },
                data: {model: columns},
                method: 'POST',
                responseType: 'arraybuffer'
            }).then(function (response) {

                var file = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                var excelFileName = title + "_" + moment(new Date()).format('DD_MM_YYYY_HH_mm_ss') + ".xlsx";

                FileSaver.saveAs(file, excelFileName);

                $log.info("Excel file was created: " + excelFileName);

            }).catch(function (response) {

                if (response && response.data) {

                    var responseData = convertErrorFromArrayBufferToJson(response.data);

                    SuccessErrorService.apiValidationErrors(scope, responseData,
                        $translate.instant('global.grid.exportToExcel.error'));
                }

            }).finally(function() {

                scope.exportToExcelLoading = false;
            });

        }

        /**
         * Δημιουργία αντικειμένου JSON για σφάλμα το οποίο είναι
         * κωδικοποιημένο ως binary (μορφή arraybuffer)
         * @param data
         */
        function convertErrorFromArrayBufferToJson(data) {

            var responseDataView = new DataView(data);
            var decoder = new TextDecoder("utf-8");
            var responseDataString = decoder.decode(responseDataView);

            return JSON.parse(responseDataString);
        }

        //Exposed functions
        return {
            generateJqGridColsFinal: generateJqGridColsFinal,
            generateJqGridData: generateJqGridData,
            exportJqGridDataToExcel: exportJqGridDataToExcel,
            exportDataToExcel: exportDataToExcel,
            convertErrorFromArrayBufferToJson: convertErrorFromArrayBufferToJson
        };
    }
]);