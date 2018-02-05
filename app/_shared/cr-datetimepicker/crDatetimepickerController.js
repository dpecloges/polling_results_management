(function() {

  'use strict';

  angular.module('app.utils')
    .controller('crDatetimepickerCtrl', ['$scope', '$log', '$timeout', 'DateService', function($scope, $log, $timeout, DateService) {

      $scope.theDate = null;
      $scope.theTimeDescr = null;

      // Watcher για ανίχνευση αλλαγών του model που γίνονται προγραμματιστικά.
      $scope.$watch('model', dateTime => {
        if (!dateTime) return;

        var date = DateService.getFormattedMomentWithTzFromTimestamp($scope.model);
        var time = DateService.getFormattedTimeWithTzFromTimestamp(date);

        if (date !== $scope.theDate) $scope.theDate = date;
        if (time !== $scope.theTimeDescr) $scope.theTimeDescr = time;
      });

      var formatNum = function(n) {
        if (n === null || n === undefined) {
          n = 0;
        }
        return n > 9 ? '' + n : '0' + n;
      };

      // today
      $scope.setToday = function() {
        if ($scope.model === null || $scope.model === undefined) {
          // Update values only the first time
          if ($scope.theDate === null || $scope.theDate === undefined) {
            // SetObjectValue
            $scope.model = DateService.today();
            // Set the Date
            $scope.theDate = $scope.model;
            // Set the Time - set Two digits
            $scope.theTimeDescr = DateService.getFormattedTimeWithTzFromTimestamp($scope.model);
          }
        }
      };


      if ($scope.settoday==true && ($scope.model === null || $scope.model === undefined)) {
        $scope.setToday();
      }

      // Initialize Fields
      $scope.initialSplit = function() {
        if ($scope.model !== null && $scope.model !== undefined) {
          // Update values only the first time
          if ($scope.theDate === null || $scope.theDate === undefined) {
            // Set the Date
            $scope.theDate = new Date($scope.model);
            // Set the Time - set Two digits
            $scope.theTimeDescr = formatNum($scope.theDate.getHours()) + ':' + formatNum($scope.theDate.getMinutes());

          }
        }
      };

      // clear
      $scope.clear = function() {
        $scope.theDate = null;
        $scope.theTimeDescr = null;
      };

      // open/close popup
      $scope.open = function($event) {
        if ($scope.opened) {
          // Prevent datepicker from closing this calendar popup
          $event.preventDefault();
          $event.stopPropagation();
        } else {
          // Delay opening until next tick, otherwise calendar popup will be immediately closed
          $timeout(function() {
            $scope.opened = true;
          });
        }
      };

      $scope.dateChanged = function() {

        var hours = 0;
        var minutes = 0;
        var timeDescrDefined = false;

        if ($scope.theTimeDescr !== null && $scope.theTimeDescr !== undefined) {
          if ($scope.theTimeDescr.indexOf(':') > 0) {
            timeDescrDefined = true;
            hours = $scope.theTimeDescr.slice(0, $scope.theTimeDescr.indexOf(':'));
            minutes = $scope.theTimeDescr.slice($scope.theTimeDescr.indexOf(':') + 1);
          }
        }

        if (!timeDescrDefined) {
            timeDescrDefined = true;
            $scope.theTimeDescr = hours + ":" + minutes;
        }

        if ($scope.theDate && timeDescrDefined) {
            //$scope.model = DateService.getFormattedMomentWithTzFromDateTime($scope.theDate, hours, minutes);
            $scope.model = DateService.getFormattedMomentWithTzFromMomentTime($scope.theDate, hours, minutes);
        } else {
          $scope.model = null;
          $scope.theTimeDescr = null;
        }
      };

      $scope.timeChanged = function() {
        var hours = 0;
        var minutes = 0;
        var timeDescrDefined = false;

        if ($scope.theTimeDescr !== null && $scope.theTimeDescr !== undefined) {
          if ($scope.theTimeDescr.indexOf(':') > 0) {
            timeDescrDefined = true;
            hours = $scope.theTimeDescr.slice(0, $scope.theTimeDescr.indexOf(':'));
            minutes = $scope.theTimeDescr.slice($scope.theTimeDescr.indexOf(':') + 1);
          }
        }
        if ($scope.theDate !== null && $scope.theDate !== undefined && timeDescrDefined) {
            $scope.model = DateService.getFormattedMomentWithTzFromMomentTime($scope.theDate, hours, minutes);
        }
      };

      // Έκθεση δημόσιου API.
      // Χρησιμεύει στην πρόσβαση γονικών directives.
      $scope.api = {
        clear: $scope.clear
      };

    }]);

})();
