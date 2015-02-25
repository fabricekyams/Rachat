define([
	'scripts/app',
	'DocteurCreditJS',
	], function (app,DC) {
	app.factory('DBRead', function($http){

		function DBRead(){
			console.log('Data base reader created');
		}

		DBRead.prototype = {
			getAll : function () {
				$http.get('php/gets.php/?data=all')
                .success(function(response) {
                	return response;
                });
			}
		};

		return DBRead;

	});
});
