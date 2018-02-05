/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('app.utils')

        .controller('crTimepickerCtrl', ['$scope', '$log', function ($scope, $log) {


            $scope.theTime = new Date();
    

//            $scope.hstep = 1;
//            $scope.mstep = 1;

//            $scope.options = {
//                hstep: [1, 2, 3],
//                mstep: [1, 5, 10, 15, 25, 30]
//            };

//            $scope.ismeridian = true;
//            $scope.toggleMode = function () {
//                $scope.ismeridian = !$scope.ismeridian;
//            };            
            $scope.changed = function () {
                
            };
            
            $scope.clearer = function () {
                $scope.theTime = null;
            };
            
             //$log.info($scope);
        }]);
