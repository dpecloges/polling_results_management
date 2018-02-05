/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

//angular.module('app.utils')
//        //global configuration for timepicker within the app.utils module
//        .config(function (timepickerConfig) {
//            // global ορισμός του format
//            // το ορίζουμε δυναμικά και σε κάθε controller μέσω του timeOptions.format
//         
//
//        });

angular.module('app.utils')

        .directive('crTimepicker', function () {
            return {
                restrict: 'E',
                //                template: '<div class="row">' +
                //                            '<div class="col-md-6">' +
                //                                '<p class="input-group">' +
                //                                    '<input type="text" class="form-control" timepicker-popup="{{format}}" ng-model="dt" is-open="opened" timepicker-options="options" ng-required="true" />' +
                //                                    '<span class="input-group-btn">' +
                //                                    '<button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
                //                                    '</span>' +
                //                                '</p>' +
                //                            '</div>' +
                //                        '</div>',
                templateUrl: 'app/_shared/cr-timepicker/cr-timepicker.tpl.html',
                replace: false,
                controller: 'crTimepickerCtrl',
                scope: {
                    model: "=",
                    disabled: '=ngDisabled'
                }

            };
        });