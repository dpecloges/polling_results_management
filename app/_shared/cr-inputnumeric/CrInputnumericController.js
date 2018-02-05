
'use strict';

angular.module('app.utils').controller('CrInputnumericController', function($scope){
	
	var maxDigits = $scope.maxDigits? parseInt($scope.maxDigits): '';
	var reg = maxDigits? new RegExp('^[0-9]{0,' + maxDigits + '}$'): new RegExp('^[0-9]+$');
	
	$scope.$watch('value', function(newValue, oldValue){
		if(typeof $scope.value != typeof undefined && $scope.value != null && $scope.value.length > 0){
			if(!reg.test($scope.value)){
				$scope.value = $scope.value.slice(0, -1);
			}
		}
	});
});