
/**
 * @ngdoc function
 * @name graphTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the graphTestApp
 */
 define([
    'scripts/app'
    ],

    function (app) {
        'use strict';


        app.filter('abs', function() {
            return function(input) {
                return (input.replace('-', ''));
            };
        });

        app.filter('toAn', function() {
            return function(input) {
                var an = parseInt(input);
                an = an/12;
                return an;
            };
        });

        

        app.filter('typeName', function() {
            return function(input) {
                var name;
                switch(input){
                    case 'A':
                    name = 'annuel';
                    break;
                    case 'C':
                    name= 'triennal';
                    break;
                    case 'E':
                    name = 'quinquennal';
                    break;

                }
                return name;
            };
        });

        app.filter('slice', function() {
          return function(arr, start, end) {
            return (arr || []).slice(start);
            };
        });
    }
);