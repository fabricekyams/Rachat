/**
 * Module
 *
 * All jquery plugins
 */

define([
    'scripts/app'
    ],

    function (app) {
    'use strict';

    /**
     * Show date table picker.
     * Maximum day is today
     */
    app.directive('beforeToday', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
              iElm.keydown(function(event) { 
                  return false;
              });
                iElm.datetimepicker({
                   format:'d/m/Y',
                    step:30,
                    lang:'fr',
                    timepicker:false,
                    maxDate: 0,
                    scrollInput : false,
                    defaultDate: new Date()
                  });
            }
        };
    });

    /**
     * Show date table picker.
     * Maximum day is today
     */
    app.directive('afterToday', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
              iElm.keydown(function(event) { 
                  return false;
              });
                iElm.datetimepicker({
                   format:'d/m/Y',
                    step:30,
                    lang:'fr',
                    timepicker:false,
                    minDate: 0,
                    scrollInput : false,
                    defaultDate: new Date()
                  });
            }
        };
    });

    app.directive('beforeTodayAdmin', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
              iElm.keydown(function(event) { 
                  return false;
              });
                iElm.datetimepicker({
                   format:'Y-m-d',
                    step:30,
                    lang:'fr',
                    timepicker:false,
                    maxDate: 0,
                    scrollInput : false,
                    defaultDate: new Date()
                  });
            }
        };
    });

    app.directive('isloading', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
                $scope.$watch('loaded', function(newVal){
                  if(newVal){
                    iElm.fadeOut();
                  }
                });
            }
        };
    });

    app.directive('isloaded', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
                $scope.$watch('loaded', function(newVal){
                  if(newVal){
                    iElm.fadeIn();
                  }
                });
            }
        };
    });

    app.directive('start', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
                $scope.$watch('started', function(newVal){
                  if(newVal){
                    iElm.fadeIn();
                  }
                });
            }
        };
    });


});