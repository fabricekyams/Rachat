'use strict';

/**
*  Module
*
* Render Graphics
*/
define([
    'scripts/app',
    
    ],

    function (app) {
    'use strict';
    app.directive('generalResults',  function(){
    	// Runs during compile
    	return {
    		// name: '',
    		// priority: 1,
    		// terminal: true,
    		// scope: {}, // {} = isolate, true = child, false/undefined = no change
    		// controller: function($scope, $element, $attrs, $transclude) {},
    		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    		//template: '<p></p>',
    		templateUrl: 'views/templates/generalResults.html',
    		// replace: true,
    		// transclude: true,
    		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    		link: function($scope, iElm, iAttrs, controller) {
    			console.log(iElm);
    		}
    	};
    });

    app.directive('storyResults',  function(){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // scope: {}, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            //template: '<p></p>',
            templateUrl: 'views/templates/storyResults.html',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {
                
            }
        };
    });
});
