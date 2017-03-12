(function(){
	angular.module("myApp").directive('dropDown', ['$timeout', function($timeout) {
		/**
		 * @param {Boolean} multiple 是否多选
		 * @param {String} name datalist中显示的名称
		 * @param {Array} datalist 数据数组
		 * @param {obj} data 选中的数据
		 * */
		return {
			restrict: 'E',
			replace: true,
			scope: {
				multiple: '@',
				name: '@',
				datalist: '=',
				data: '='
			},
			template: '<div tabindex="0" class="dropdown" ng-blur="divblur($event)">' +
				'<input type="text" ng-model="dropdownData" readonly="readonly">' +
				'<a ng-click="switchShow()"></a>' +
				'<ul ng-show="dropdownShow">' +
				'<li><input tabindex="-1" ng-blur="inputblur($event)" type="text" ng-model="filterData" ng-change="change()"></li>' +
				'<li class="textoverflow" ng-repeat="data in datalist | filter : filterData as dataFilterList" ng-bind="data[name]" ng-click="select(data,$index)"></li>' +
				'</ul>' +
				'</div>',
			link: function(scope, element, attr) {
				//键值
				var keyValue = {
					up: 38, //向上键
					down: 40, //向下键
					enter: 13 //回车键
				};
				//当前所在坐标  从1开始 去除首个输入li input
				var currentli = 1;
				//下拉框是否显示
				scope.dropdownShow = false;
				//过滤数据
				scope.filterData = '';
				//展示所选数据
				scope.dropdownData = '';
				//选择方法
				var select = function() {
					if(scope.multiple === 'false') {
						//单选
						return function(data, $index) {
							//赋值
							scope.dropdownData = data[scope.name];
							scope.data = data;
							//关闭下拉框并清空过滤数据
							scope.dropdownShow = false;
							scope.filterData = '';
							//如果所选li与当前li不一致，修改currentli
							if((currentli - 1) !== $index) {
								element.find('li').eq(currentli).removeClass('hover');
								currentli = $index + 1;
							};
						};
					} else {
						//复选
						//选择数据集
						scope.data = [];
						return function(data, $index) {
							var i = scope.data.indexOf(data);
							if(i > -1) {
								//如果有，去除
								scope.dropdownData = scope.dropdownData.replace(data[scope.name], '');
								scope.data.splice(i, 1);
							} else {
								//如果没有，添加
								scope.dropdownData += data[scope.name];
								scope.data.push(data);
							};
							//如果所选和currentli不一致，修改hover状态
							if((currentli - 1) !== $index) {
								element.find('li').eq(currentli).removeClass('hover');
								currentli = $index + 1;
								element.find('li').eq(currentli).addClass('hover');
							};
							//修改所选状态
							element.find('li').eq(currentli).toggleClass('active');
						};
					}
				};
				//点击选中
				scope.select = select();
				//切换显示下拉列表
				scope.switchShow = function() {
					//清除过滤数据
					scope.filterData = '';
					scope.dropdownShow = !scope.dropdownShow;
					//给currentli赋状态
					if(scope.dropdownShow) {
						element.find('li').eq(currentli).addClass('hover');
					};
				};
	
				//移除隐藏
				scope.divblur = function(event) {
					if(event.relatedTarget === element.find('input')[1]) {
						return;
					} else {
						scope.dropdownShow = false;
						scope.filterData = '';
					}
				};
				//移除隐藏
				scope.inputblur = function(event) {
					if(event.relatedTarget === element[0]) {
						return;
					} else {
						scope.dropdownShow = false;
						scope.filterData = '';
					}
				};
	
				element.bind('keyup', function(event) {
					event.stopPropagation();
					event.preventDefault();
					switch(event.which) {
						case keyValue.up:
							//上移
							var li = element.find('li');
							if(currentli === 1) {
								return;
							} else {
								li.eq(currentli--).removeClass('hover');
								li.eq(currentli).addClass('hover');
							};
							break;
						case keyValue.down:
							//下移
							var li = element.find('li');
							if(currentli === (li.length - 1)) {
								return;
							} else {
								li.eq(currentli++).removeClass('hover');
								li.eq(currentli).addClass('hover');
							};
							break;
						case keyValue.enter:
							//选中
							scope.select(scope.dataFilterList[currentli - 1], currentli - 1);
							scope.$digest();
							break;
						default:
							break;
					};
	
				});
	
				//当过滤数据发生变化时，修改currentli
				scope.change = function() {
					var li = element.find('li');
					if(li.length >= 2) {
						$timeout(function() {
							currentli = 1;
							element.find('li').eq(currentli).addClass('hover');
						}, 0)
					};
				};
			}
		};
	
	}]);
})();
