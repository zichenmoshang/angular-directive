(function() {
	angular.module('myApp').controller('demoCtrl', ['$scope', function($scope) {
		//时间
		$scope.dateType = 0;
		$scope.bdate = '';
		$scope.edate = '';
		$scope.startFormat = {
			istime: false
		};
		$scope.endFormat = {
			istime: false
		};

		//下拉框
		$scope.dropDownDataList = [{
			id: '1',
			name: '选项1'
		}, {
			id: '2',
			name: '选项2'
		}, {
			id: '3',
			name: '选项3'
		}, {
			id: '4',
			name: '选项4'
		}];
	}]);
})();