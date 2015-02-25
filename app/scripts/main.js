require.config({
    baseUrl: "",    
    paths: {
        'angular': 				'../bower_components/angular/angular',
        'jquery': 				"../bower_components/jquery/dist/jquery",
        'angular-route': 		'../bower_components/angular-route/angular-route',
   		'angular-cookies' : 	"../bower_components/angular-cookies/angular-cookies",
    	'angular-resource': 	"../bower_components/angular-resource/angular-resource",
   		'angular-sanitize' : 	"../bower_components/angular-sanitize/angular-sanitize",
   		'angular-touch' : 		"../bower_components/angular-touch/angular-touch",
   		'bootstrap' : 			"../bower_components/bootstrap/dist/js/bootstrap",
   		'datetimepicker': 		"../vendors/datepicker/jquery.datetimepicker",
    	'autoNumeric': 			"../vendors/autonumeric/autoNumeric",
    	'highcharts': 			"../vendors/highchart/highcharts",
        'angularAMD': 			'../vendors/angularAmd/angularAMD',
        'shim':                 "../vendors/shim/es5-shim.min",
        'ss':                   "../vendors/ss/ss.min",
        'DocteurCreditJS':        "../vendors/DocteurCredit/DocteurCreditJS.min", 
        'modernizr':        "../vendors/modernizr/modernizr.min",
        'moment':        "../vendors/moment/moment.min",
        'docxgen':        "../vendors/docxgen/docxgen.min"
    },
    shim: {
    	'angularAMD': ['angular'],
    	'angular-route': ['angular'],
    	'angular-cookies': ['angular'],
    	'angular-resource': ['angular'],
    	'angular-sanitize': ['angular'],
    	'angular-touch': ['angular'],
    	'bootstrap' : ['jquery'],
    	'datetimepicker' : ['jquery'],
    	'autonumeric' : ['jquery'],
    	'highcharts' : ['jquery']
    },
    deps: ['scripts/app']
});
