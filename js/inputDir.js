/**
 * @author weihualiang
 * @date 2016-08-04
 * @notes 输入框指令
 * 支持数字，字符，电话号码
 */
(function() {
	angular.module("myApp").directive('inputDir', [function() {
		/**
		 * 数字格式化 整形,浮点型
		 * @param {Object} scope
		 * @param {Object} element
		 * @param {Object} attrs
		 * @param {Object} ngModel
		 * @param {Object} numFormats 格式化数据参数: 0-num;1-精度(默认0)
		 */
		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {

			},
			link: function(scope, element, attrs, ngModel) {
				if(!ngModel) {
					return;
				};

				var _obj = JSON.parse(attrs.inputDir);

				//无类型则不做操作
				if(_obj.type === undefined) {
					return;
				};

				//储存旧值
				var _oldValue = '';

				//渲染viewValue
				function setViewFun(value) {
					ngModel.$setViewValue(value);
					element.val(value);
				};

				//必填项
				function requireFun(value) {
					if(ngModel.$isEmpty(value)) {
						ngModel.$setValidity('slrequire', false);
					} else {
						ngModel.$setValidity('slrequire', true);
					};
				};
				if(_obj.require) {
					requireFun('');
				};

				//数字类型  max为最大值 min为最小值
				var numFun = function(value) {
					var _value = value,
						reg;
					if(_obj['int'] !== undefined && _obj['decimal'] !== undefined) {
						reg = new RegExp("^-?\\d{0," + _obj['int'] + "}(\\.\\d{0," + _obj['decimal'] + "})?$");
					} else if(_obj['int']) {
						reg = new RegExp("^-?\\d{0," + _obj['int'] + "}$");
					} else if(_obj['decimal']) {
						reg = new RegExp("^-?\\d*\\.?\\d{0," + _obj['decimal'] + "}$");
					};

					//不满足reg 或者大于最大值，小于最小值
					if(!reg.test(_value) || (_obj.max !== undefined && Number(_value) > _obj.max) || (_obj.min !== undefined && Number(_value) < _obj.min)) {
						_value = _oldValue;
						setViewFun(_value);
					};

					//当等于最大值不能输入.
					if(_obj.max !== undefined && Number(_value) === _obj.max && (/^\d*\.$/).test(_value)) {
						_value = _value.replace('.', '');
						setViewFun(_value);
					};

					_oldValue = _value;
					return _value;
				};

				//字符类型 -- 通用类型 max为最大长度  min为最小长度
				var strFun = function(value) {
					var _value = value;
					if(_obj.max !== undefined) {
						if(_value && _value.length > _obj.max) {
							_value = _value.substr(0, _obj.max);
							setViewFun(_value);
						};
					};
					if(_obj.min !== undefined) {
						if(_value && _value.length >= _obj.min) {
							ngModel.$setValidity("slmin", true);
						} else {
							ngModel.$setValidity("slmin", false);
						};
					};
					return _value;
				};

				//电话类型
				var telFun = function(value) {
					var _value = value;
					if(_value !== undefined && _value.length > 11) {
						_value = _value.substr(0, 11);
						setViewFun(_value);
					};
					if(!(/^\d*$/).test(_value)) {
						_value = _oldValue;
						setViewFun(_value);
					};
					if((/^1[3|4|5|7|8]\d{9}$/).test(_value)) {
						ngModel.$setValidity("sltel", true);
					} else {
						ngModel.$setValidity("sltel", false);
					};
					_oldValue = _value;
					return _value;
				};

				var typeFun = function() {
					switch(_obj.type) {
						case 'num':
							return numFun;
							break;
						case 'str':
							return strFun;
							break;
						case 'tel':
							return telFun;
							break;
						default:
							break;
					};
				};

				var validFun = typeFun();

				var checkModel = function(value) {
					if(_obj.require) {
						requireFun(value);
					};

					return validFun(value);
				};

				ngModel.$parsers.push(checkModel);

			}
		};
	}]);
})();