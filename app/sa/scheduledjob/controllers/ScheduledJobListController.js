angular.module('app.sa.scheduledjob').controller('ScheduledJobListController', [
    '$rootScope',
    '$scope',
    '$log',
    '$translate',
    'ViewJqGridService',
    'SuccessErrorService',
    'authService',
    'lists',
    function ($rootScope, $scope, $log, $translate, ViewJqGridService, SuccessErrorService, authService, lists) {

        $scope.hasPermission = function(permission) {
            return authService.hasPermission(permission);
        };

        $scope.lists = lists;

        $scope.args = {};

        // Παρακολούθηση για σφάλματα στο $rootScope.errorList.
        $rootScope.$watch('errorList', function() {
            SuccessErrorService.onRootScopeError($scope, $rootScope.errorList);
        }, true);

        $scope.clearArguments = function() {
            Object.getOwnPropertyNames($scope.args).forEach(function(val, idx, array) {
                $scope.args[val] = null;
            });
        };

        $scope.scheduledJobListGrid = 'scheduledJobListGrid';

        $scope.msg = {
            jobName: $translate.instant('sa.scheduledjob.list.jobName'),
            status: $translate.instant('sa.scheduledjob.list.status'),
            description: $translate.instant('sa.scheduledjob.list.description'),
            scheduleDate: $translate.instant('sa.scheduledjob.list.scheduleDate'),
            fireDate: $translate.instant('sa.scheduledjob.list.fireDate'),
            startDate: $translate.instant('sa.scheduledjob.list.startDate'),
            endDate: $translate.instant('sa.scheduledjob.list.endDate'),
            errorId: $translate.instant('sa.scheduledjob.list.errorId'),
            errorMessage: $translate.instant('sa.scheduledjob.list.errorMessage'),
            fromJobName: $translate.instant('sa.scheduledjob.list.fromJobName')
        };

        $scope.showError = function (id) {

            var table = $("#" + $scope.scheduledJobListGrid);

            var jobName = ViewJqGridService.getRowCellValue(table, id, 'jobName');
            var status = ViewJqGridService.getRowCellValue(table, id, 'status');
            var statusDescription = ViewJqGridService.getRowCellValue(table, id, 'statusDescription');
            var description = ViewJqGridService.getRowCellValue(table, id, 'description');
            var scheduleDate = ViewJqGridService.getRowCellValue(table, id, 'scheduleDate');
            var fireDate = ViewJqGridService.getRowCellValue(table, id, 'fireDate');
            var startDate = ViewJqGridService.getRowCellValue(table, id, 'startDate');
            var endDate = ViewJqGridService.getRowCellValue(table, id, 'endDate');
            var errorId = ViewJqGridService.getRowCellValue(table, id, 'errorId');
            var errorMessage = ViewJqGridService.getRowCellValue(table, id, 'errorMessage');
            var fromJobName = ViewJqGridService.getRowCellValue(table, id, 'fromJobName');


            var content = '<p>' + $scope.msg.jobName + ': ' + jobName + '</p>' +
                    '<p>' + $scope.msg.description + ': ' + description + '</p>' +
                    '<p>' + $scope.msg.scheduleDate + ': ' + scheduleDate + '</p>' +
                    '<p>' + $scope.msg.fireDate + ': ' + fireDate + '</p>' +
                    '<p>' + $scope.msg.startDate + ': ' + startDate + '</p>' +
                    '<p>' + $scope.msg.endDate + ': ' + endDate + '</p>' +
                    (fromJobName  === '' ? '' : '<p>' + $scope.msg.fromJobName + ': ' + fromJobName + '</p>') +
                    (errorId  === '' ? '' : '<p>' + $scope.msg.errorId + ': ' + errorId + '</p>') +
                    (errorMessage === '' ? '' : '<p>' + $scope.msg.errorMessage + ': ' + errorMessage + '</p>');

            var color;

            if (status === "ADDED") {
                color = '#c79121';
            }
            else if (status === "SCHEDULED") {
                color = '#3276b1';
            }
            else if (status === "RUNNING") {
                color = '#57889c';
            }
            else if (status === "COMPLETED") {
                color = '#739e73';
            }
            else if (status === "FAILED") {
                color = '#a90329';
            }

            $.bigBox({
                title: '<h3>' + statusDescription + '</h3>',
                content: content,
                color: color,
                icon: ""
            });

        };


        $scope.gridData = {
            caption: $translate.instant('global.grid.caption'),
            url: $rootScope.baseUrl + '/dpelapi/system/scheduling/jobs/index',
            excelUrl: $rootScope.baseUrl + '/dpelapi/system/scheduling/jobs/excel',
            colNames: [
                'id',
                $translate.instant('global.grid.actions'),
                $scope.msg.jobName,
                $scope.msg.status,
                'status',
                'statusDescription',
                $scope.msg.description,
                $scope.msg.scheduleDate,
                $scope.msg.fireDate,
                $scope.msg.startDate,
                $scope.msg.endDate,
                $scope.msg.errorId,
                $scope.msg.errorMessage,
                $scope.msg.fromJobName
            ],
            colModel: [
                { name: 'id', hidden: true },
                { name: 'extraActions', fixed: true, hidden: true, align: 'center', width: 80 },
                { name: 'jobName', index: 'jobName', hidden: true, align: 'center', editable: false, width: 60 },
                {
                    name: 'statusFormatted', index: 'status', align: 'center', sortable: true, editable: false, width: 15,
                    formatter: function (cellvalue, options, rowObject) {

                        var result = '';

                        if (rowObject.status === "ADDED") {
                            result = '<i class="fa fa-calendar-o text-warning ui-jqgrid-custom-icon"' +
                                        'data-tooltip-placement="right" data-tooltip-class="tooltip-warning" data-tooltip="' + rowObject.statusDescription + '"></i>';
                        }
                        else if (rowObject.status === "SCHEDULED") {
                            result = '<i class="fa fa-calendar-plus-o text-primary ui-jqgrid-custom-icon"' +
                                        'data-tooltip-placement="right" data-tooltip-class="tooltip-primary" data-tooltip="' + rowObject.statusDescription + '"></i>';
                        }
                        else if (rowObject.status === "RUNNING") {
                            result = '<i class="fa fa-spinner fa-pulse text-info ui-jqgrid-custom-icon"' +
                                        'data-tooltip-placement="right" data-tooltip-class="tooltip-info" data-tooltip="' + rowObject.statusDescription + '"></i>';
                        }
                        else if (rowObject.status === "COMPLETED") {
                            result = '<i class="fa fa-check text-success ui-jqgrid-custom-icon"' +
                                        'data-tooltip-placement="right" data-tooltip-class="tooltip-success" data-tooltip="' + rowObject.statusDescription + '"></i>';
                        }
                        else if (rowObject.status === "FAILED") {
                            result = '<i class="fa fa-times text-danger ui-jqgrid-custom-icon"' +
                                'data-tooltip-placement="right" data-tooltip-class="tooltip-danger" data-tooltip="' + rowObject.statusDescription + '"></i>';
                        }

                        return result;
                    }
                },
                { name: 'status', index: 'status', hidden: true, editable: false, width: 60 },
                { name: 'statusDescription', index: 'statusDescription', hidden: true, editable: false, width: 60 },
                { name: 'description', index: 'description', sortable: true, editable: false, width: 100 },
                { name: 'scheduleDate', index: 'scheduleDate', align: 'center', sortable: true, editable: false, width: 40 },
                { name: 'fireDate', index: 'fireDate', align: 'center', sortable: true, editable: false, width: 40 },
                { name: 'startDate', index: 'startDate', align: 'center', sortable: true, editable: false, width: 40 },
                { name: 'endDate', index: 'endDate', align: 'center', sortable: true, editable: false, width: 40 },
                { name: 'errorId', index: 'errorId', hidden: true, editable: false, width: 60 },
                { name: 'errorMessage', index: 'errorMessage', hidden: true, editable: false, width: 60 },
                { name: 'fromJobName', index: 'fromJobName', hidden: true, editable: false, width: 60 }
            ],
            sortname: 'fireDate',
            sortorder: 'desc'
        };

        /**
         * Ανάκτηση εγγραφών ευρετηρίου με βάση τα τρέχονται φίλτρα
         */
        $scope.retrieveGridData = function() {
            if (!$scope.hasPermission('sys.admin')) {
                return;
            }
            $scope.startIndexLoading();
            ViewJqGridService.retrieveData($("table"), $scope.args);
        };

        /**
         * Έναρξη ένδειξης spinner στην ανάκτηση των εγγραφών του ευρετηρίου
         */
        $scope.startIndexLoading = function() {
            $scope.indexLoading = true;
        };

        /**
         * Λήξη ένδειξης spinner στην ανάκτηση των εγγραφών του ευρετηρίου
         */
        $scope.stopIndexLoading = function() {
            $scope.indexLoading = false;
        };

    }]);
