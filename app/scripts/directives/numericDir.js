/**
 * Module
 *
 * Parse strings Value Contained in range input to numeric for numeric input value
 */

define([
    'scripts/app'
    ],
    function (app) {
    'use strict';
   app.directive('toNumeric',function(){
   	return {
   		 restrict: 'M', // E = Element, A = Attribute, C = Class, M = Comment
   		link: function($scope, iElm, iAttrs, controller) {
   			$scope.$watch('refinancing.initMortgage.initRate', function(newVal){
                $scope.refinancing.initMortgage.initRate = parseFloat(newVal);
            });

            $scope.$watch('refinancing.initMortgage.duration', function(newVal){
            	$scope.refinancing.initMortgage.duration = parseInt(newVal);
        	});
            $scope.$watch('refinancing.refMortgage.duration', function(newVal){
              if (newVal<72) {
                newVal = 72;
              }else{
                if(newVal>360){
                  newVal = 360;
                }
              };
              $scope.refinancing.refMortgage.duration = parseInt(newVal);
          });

        	$scope.$watch('refinancing.refMortgage.initRate', function(newVal){
            	$scope.refinancing.refMortgage.initRate= parseFloat(newVal);
        	});
   		}
   	};
   });

    /*app.directive('autoNumeric', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
                console.log(iElm.attr('id'));
                iElm.autoNumeric('init');
                $scope.$watch('financement.capital', function(newVal){
                   if(typeof($scope.financement.capital)=='string'){
                       $scope.financement.capital = parseFloat($scope.financement.capital.replace(/[,]/gim, ""));
                       console.log('je teste le string');
                   }
                       console.log('j update');

                    iElm.autoNumeric('update');
                   
                 });

            }
        };
    });
    */
});