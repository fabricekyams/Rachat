define([
	'scripts/app',
	'DocteurCreditJS',
	'scripts/models/Financement.js'
	], function (app,DC) {
	app.factory('Rachat', function (Financement){

		function Rachat(capital, rate, duration, date newRate){
			this.rate = newRate;
			this.prototype = new Financement(22000000, rate, duration, date, newDate);
		};
		Rachat.prototype= {
			getcap: function () {
				console.log(this.capital);
			}
		};

		return Rachat;

	});
});
