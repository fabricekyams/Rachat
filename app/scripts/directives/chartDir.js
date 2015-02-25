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
	app.directive('ghVisualization', function(){
		var margin = 20,
	    width = 960,
	    height = 500 - .5 - margin
		return {
			scope: {
				val: '=',//,
				type: '=',
				field: '='
			}, // {} = isolate, true = child, false/undefined = no change
			 restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			 
			link: function(scope, element, attrs, controller) {
				    var a = 0;
	    			var b = 1;
	    			var chart;
				element.append('<div id="'+attrs.val+'" style="max-width:1100px; margin-top:20px"></div>');

				scope.$watch('val', function (newVal) {

					if(newVal!== undefined && chart === undefined){
						chart = new Highcharts.Chart(scope.val);
					}
					if(chart !== undefined){

							a+=1;
		                setTimeout(function(){
								if( a===b){
									for (var i = 0; i < chart.series.length; i++) {
										chart.series[i].setData(scope.val.series[i].data,false);
									};
									chart.redraw();
									a=0;
									b=1;
								}else{
									b+=1;
								}
		                },500);
					}


				});
		
			}
		};
	});

	app.directive('ghIndVisualization', function(){
		var margin = 20,
	    width = 960,
	    height = 500 - .5 - margin
		return {
			scope: {
				val: '=',//,
				type: '=',
				field: '='
			}, // {} = isolate, true = child, false/undefined = no change
			 restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			 
			link: function(scope, element, attrs, controller) {
				    var a = 0;
	    			var b = 1;
	    			var chart;
				element.append('<div id="'+attrs.val+'" style="width:1500px; margin-top:20px"></div>');

				scope.$watch('val', function (newVal) {

					if(newVal!== undefined && chart === undefined){
						chart = new Highcharts.Chart(scope.val);
					}
					if(chart !== undefined){

							a+=1;
		                setTimeout(function(){
								if( a===b){
									for (var i = 0; i < chart.series.length; i++) {
										chart.series[i].setData(scope.val.series[i].data,false);
									};
									chart.redraw();
									a=0;
									b=1;
								}else{
									b+=1;
								}
		                },500);
					}


				});
		
			}
		};
	});
});
