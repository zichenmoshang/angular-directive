/**
 * @author weihualiang
 * @date 2016-08-03
 * @notes 日期指令
 * 支持时间段选择
 */
(function() {
	//时间指令
	/**
	 * dateHeadShow {Boolean} true 显示本日、本周、本月、本年、自定义  false 自定义
	 * headType {Int} 默认选择  0本日、1本周、2本月、3本年、4自定义
	 * startDate {String} 开始时间   {require}
	 * endDate {String} 结束时间 {require}
	 * startFormat {Object} 开始时间 format 
	 * endFormat {Object} 结束时间 format
	 * format 参数:{
	 *   @param format 默认:YYYY-MM-DD,
	 *   @param min 限制最小日期  默认自增,
	 *   @param max 限制最大日期  默认不限制,
	 *   @param istime 是否显示时间 true-显示 
	 * }
	 * 
	 */
	angular.module("myApp").directive('dateDir', [function() {
		var dateFun = function(scope, element, attrs) {
			//如果显示，初始化日期类型
			if(!!scope.dateHeadShow) {
				scope.headList = [{
					name: '本日',
					flag: 0
				}, {
					name: '本周',
					flag: 1
				}, {
					name: '本月',
					flag: 2
				}, {
					name: '本年',
					flag: 3
				}, {
					name: '自定义',
					flag: 4
				}];
				if(scope.headType !== undefined) {
					scope.dateHead = scope.headList[scope.headType].name;
				} else {
					scope.dateHead = scope.headList[4].name;
				};
				//选择时间段
				scope.selectHead = function(head, e) {
					e.stopPropagation();
					scope.dateHead = head.name;
					scope.headType = head.flag;
					scope.headListShow = false;
					getTimeQuantum(head.flag);
				};
				scope.showHeadList = function(e) {
					e.stopPropagation();
					scope.headListShow = !scope.headListShow;
				};
				scope.mouseleave = function(e) {
					e.stopPropagation();
					scope.headListShow = false;
				};
			};

			//生成标识id
			var id = {
				start: "start_" + new Date().getTime(),
				end: "end_" + new Date().getTime()
			};

			element.find('input').eq(0).attr("id", id.start);
			element.find('input').eq(1).attr("id", id.end);

			//开始时间回调
			var chooseStart = function(date) {
				scope.startDate = date;
				scope.config.end.min = date;
				loadLaydate([1]);
				scope.$apply();
			};
			//结束时间回调
			var chooseEnd = function(date) {
				scope.endDate = date;
				scope.config.start.max = date;
				loadLaydate([0]);
				scope.$apply();
			};

			//设置默认时间格式
			if(scope.startFormat === undefined) {
				scope.startFormat = {};
				scope.endFormat = {};
			};
			if(typeof scope.startFormat.format === "undefined" || scope.startFormat.length < 5) {
				scope.startFormat.format = "YYYY-MM-DD";
			};
			if(typeof scope.endFormat.format === "undefined" || scope.endFormat.length < 5) {
				scope.endFormat.format = "YYYY-MM-DD";
			};

			//laydate参数
			scope.config = {
				start: {
					format: scope.startFormat.format,
					elem: "#" + id.start,
					choose: chooseStart,
					//min: scope.startFormat.min || "", //设定最小日期为当前日期
					//max: scope.startFormat.max || '', //最大日期
					istime: scope.startFormat.istime || false,
					istoday: true,
				},
				end: {
					format: scope.endFormat.format,
					elem: "#" + id.end,
					choose: chooseEnd,
					//min: scope.endFormat.min || "", //设定最小日期为当前日期
					//max: scope.endFormat.max || '', //最大日期
					istime: scope.endFormat.istime || false,
					istoday: true,
				}
			};

			//修改时间段
			var getTimeQuantum = function(flag) {
				var _date = new Date();
				switch(flag) {
					case 0:
						//本日
						var _value = _date.Format('yyyy-MM-dd');
						scope.startDate = _value;
						scope.endDate = _value;
						scope.config.start.min = scope.config.start.max = _value;
						scope.config.end.min = scope.config.end.max = _value;
						break;
					case 1:
						//本周
						var _day = _date.getDay() === 0 ? 7 : _date.getDay();
						_date.setDate(_date.getDate() - _day + 1);
						scope.startDate = _date.Format('yyyy-MM-dd');
						_date.setDate(_date.getDate() + 6);
						scope.endDate = _date.Format('yyyy-MM-dd');
						scope.config.start.min = scope.config.start.max = scope.startDate;
						scope.config.end.min = scope.config.end.max = scope.endDate;
						break;
					case 2:
						//本月
						_date.setDate(1);
						scope.startDate = _date.Format('yyyy-MM-dd');
						_date = new Date(_date.getFullYear(), _date.getMonth() + 1, 0);
						scope.endDate = _date.Format('yyyy-MM-dd');
						scope.config.start.min = scope.config.start.max = scope.startDate;
						scope.config.end.min = scope.config.end.max = scope.endDate;
						break;
					case 3:
						//本年
						var _year = _date.getFullYear();
						_date = new Date(_year, 0, 1);
						scope.startDate = _date.Format('yyyy-MM-dd');
						_date = new Date(_year, 12, 0);
						scope.endDate = _date.Format('yyyy-MM-dd');
						scope.config.start.min = scope.config.start.max = scope.startDate;
						scope.config.end.min = scope.config.end.max = scope.endDate;
						break;
					case 4:
						//自定义
						scope.config.start.min = scope.startFormat.min || "";
						scope.config.start.max = scope.startFormat.max || scope.endDate;
						scope.config.end.min = scope.startFormat.min || scope.startDate;
						scope.config.end.max = scope.startFormat.max || "";
						break;
					default:
						break;
				};
				//loadLaydate([0, 1]);
			};
			
			//加载config参数
			//@param arr {Array} [0,1] 开始时间 结束时间
			var loadLaydate = function(arr) {
				if(arr.indexOf(0) > -1) {
					laydate(scope.config.start);
				};
				if(arr.indexOf(1) > -1) {
					laydate(scope.config.end);
				};
			};
			
			scope.dateClick = function(arr){
				loadLaydate(arr);
			};
			
			//初始化时间
			if(scope.headType === undefined) {
				getTimeQuantum(4);
			} else {
				getTimeQuantum(scope.headType);
			};
		};

		return {
			restrict: 'ACME',
			replace: true,
			scope: {
				dateHeadShow: '@',
				headType: '=',
				startDate: '=',
				endDate: '=',
				startFormat: '=',
				endFormat: '='
			},
			template: '<div class="search-group PT10 clearfix dis-inline">' +
				'<div class="sel fl" ng-if="dateHeadShow" ng-click="showHeadList($event)" ng-mouseleave="mouseleave($event)">' +
				'<span class="sel-span" ng-bind="dateHead"></span>' +
				'<ul ng-show="headListShow">' +
				'<li ng-repeat="head in headList" ng-bind="head.name" ng-click="selectHead(head,$event)"></li>' +
				'</ul>' +
				'<i class="sel-icon"></i>' +
				'</div>' +
				'<div class="fl sel-date">' +
				'<input type="text" class="date laydate-icon" ng-model="startDate" ng-click="dateClick([0])" readonly="readonly" />' +
				'<i class="fm">−</i>' +
				'<input type="text" class="date laydate-icon" ng-model="endDate" ng-click="dateClick([1])" readonly="readonly"/>' +
				'<div>' +
				'<div>',
			link: function(scope, element, attrs) {
				//日期格式化
				Date.prototype.Format = function(fmt) {
					var o = {
						"M+": this.getMonth() + 1, //月份 
						"d+": this.getDate(), //日 
						"h+": this.getHours(), //小时 
						"m+": this.getMinutes(), //分 
						"s+": this.getSeconds(), //秒 
						"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
						"S": this.getMilliseconds() //毫秒 
					};
					if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
					for(var k in o)
						if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
					return fmt;
				};

				dateFun(scope, element, attrs);

			}
		};
	}]);
})();