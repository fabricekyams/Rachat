
/**
*  Module
*
* Format input amount value into normalize representation format for money value
*/
define([
    'scripts/app',
    
    ],

    function (app) {
    'use strict';
     app.directive("autoNumericFabrice", ['$filter', '$locale', function ($filter, $locale) {
        var p = function (op, attrs) {
            var isNullable = attrs.isNullable || null;
            if (!op || (op === ""))
                return isNullable ? null : 0.0;
            var digits = attrs.nbDecimal || 2;
            var factor = attrs.factor || null;
            var decimalchar = $locale.NUMBER_FORMATS.DECIMAL_SEP;
            var groupchar = $locale.NUMBER_FORMATS.GROUP_SEP;
 
            if ((digits > 0) && (op.indexOf(decimalchar, 0) === -1) && (op.indexOf(groupchar, 0) !== -1)) { // pas de décimal mais bien groupchar
                var posGroup = op.indexOf(groupchar, 0);
                if (posGroup === op.lastIndexOf(groupchar))
                    op = op.replace(groupchar, decimalchar);
            }
 
            var exp = new RegExp("^\\s*([-\\+])?(((\\d+)\\" + groupchar + ")*)(\\d+)"
                                + ((digits > 0) ? "(\\" + decimalchar + "(\\d{1,}))?" : "")
                                + "\\s*$");
            var m = op.match(exp);
            if (m === null)
                return undefined;
            var intermed = m[2] + m[5];
            if (typeof (m[1]) === "undefined") m[1] = ""; // corrige problème mozilla
            var cleanInput = m[1] + intermed.replace(new RegExp("(\\" + groupchar + ")", "g"), "") + ((digits > 0) ? "." + m[7] : 0);
            var num = parseFloat(cleanInput);
            if (isNaN(num))
                return undefined;
            if (factor)
            {
                num = num / factor;
            }
            return num;
        };
 
        var f = function (modelValue, attrs) {
            var nbDecimal = attrs.nbDecimal || 2;
            var factor = attrs.factor || null;
            if (!modelValue)
                return "";
            else {
                var reg = new RegExp("\\d(?=(\\d{3})+\\" + $locale.NUMBER_FORMATS.DECIMAL_SEP + ")", "g");
                modelValue = parseFloat(modelValue); // carefull of type="number", already a string
                if (factor) {
                    modelValue = modelValue * factor;
                }
                return (modelValue).toFixed(nbDecimal).replace('.', $locale.NUMBER_FORMATS.DECIMAL_SEP).replace(reg, '$&' + $locale.NUMBER_FORMATS.GROUP_SEP)
            }
        };
 
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function (v) { return p(v, attrs); });
                ctrl.$formatters.unshift(function (v) { return f(v, attrs); });
                element.on('change', function (e) {
                    var element = e.target;
                    element.value = f(ctrl.$modelValue,attrs);
                });
            }
        };
    }]);

	
});
