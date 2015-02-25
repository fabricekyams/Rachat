define([
	'scripts/app',
	'DocteurCreditJS',
	'scripts/models/Financement.js'
	], function (app,DC) {
	app.factory('Rachat', function (Financement){

		function Rachat(capital, rate, duration, date, newDate =  new Date(), newRate=0){
			
			this.prototype = new Financement(capital, rate, duration, date, newDate, newRate);
		}

		return Rachat;

	});
});
