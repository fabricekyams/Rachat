'use strict';

/**
 * @ngdoc overview
 * @name graphTestApp
 * @description
 * # graphTestApp
 *
 * Main module of the application.
 */

define([
  'angularAMD',
  'angular-route',
  'angular-cookies',
  'angular-resource',
  'angular-sanitize',
  'angular-touch',
  'jquery',
  'ss',
  'shim',
  'highcharts',
  'modernizr',
  'moment'
   ], function (angularAMD) {
  var app = angular.module('graphTestApp', [
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch' 

    ]);
  app.config(function ($routeProvider) {
      $routeProvider
        .when('/main', angularAMD.route( {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerUrl: 'scripts/controllers/main'
        }))
        .when('/admin', angularAMD.route( {
          templateUrl: 'views/admin.html',
          controller: 'AdminCtrl',
          controllerUrl: 'scripts/controllers/admin'
        }))
        .otherwise( {
          redirectTo: '/main'
        });
      
    });

    return angularAMD.bootstrap(app);
});
