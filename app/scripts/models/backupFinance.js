define([
	'scripts/app',
	'DocteurCreditJS',
	], function (app,DC) {
	app.factory('Financement', function(){

		function Financement(capital, rate, duration, date, newDate =  new Date(), newRate=0){
			this.init();
			this.iniCapital = capital;
			this.capital = capital;

			this.rate = rate;
			this.initRate = this.radefine([
	'scripts/app',
	'DocteurCreditJS',
	], function (app,DC) {
	app.factory('Financement', function(){

		function Financement(capital, rate, duration, date, newDate =  new Date(), newRate=0){
			
			this.initCapital = capital;
			this.capital = capital;

			this.rate = rate;
			this.initRate = this.rate;

			this.newRate = newRate;
			this.initNewRate = newRate;
			
			this.duration = duration;
			this.initDuration = duration;
			
			this.date = date;
			this.dateString = date.toLocaleDateString();;
			
			this.newDate = newDate;
			this.newDateString = newDate.toLocaleDateString();
			
			this.monthlyPayment = 0;
			this.durationLeft = 0;
			this.SRD =0;
			this.indem = 0;
			this.amortization = [];
			this.type = 'fixe';
			this.refType = 'fixe';
			this.update();
		}

		Financement.prototype = {
			/* body... */

			update: function () {
				this.duration = this.initDuration;
				this.newRate = Math.pow(1 + (this.initNewRate/100), 1 / 12) - 1;
				this.date = new Date(this.formatDate(this.dateString));
				this.newDate = new Date(this.formatDate(this.newDateString));
				this.rate = Math.pow(1 + (this.initRate/100), 1 / 12) - 1;
				this.setDurationLeft();
				this.setSRD();
				this.setCapital();
				this.setMonthlyPayment();
				this.setAmortization();
			},
			setCapital : function () {

				if (this.date.getTime() != this.newDate.getTime()){
					this.setIndem();
					this.capital = this.SRD + this.indem + 330;
					this.rate =this.newRate;
					this.duration = this.durationLeft;

				}	
			},

			setSRD : function(){
				var period = this.duration - this.durationLeft;
				this.SRD = DC.CreditUtil.calculCapital(this.rate, this.duration, period)*this.initCapital;
			},
			setMonthlyPayment : function(){
				this.monthlyPayment = DC.CreditUtil.calculMensualite(this.rate, this.duration)*this.capital;
			},

			setAmortization : function () {
				this.amortization=[];
				for (var i = 0; i < this.durationLeft; i++) {
					this.amortization[i]={};
					this.amortization[i].month='mois: '+(i+1);
					this.amortization[i].dateTerme=this.getDateTerme(i+1);
					this.amortization[i].interest=this.getInterest(i);
					this.amortization[i].capital=this.getCapital(i);
					this.amortization[i].SRD=DC.CreditUtil.calculCapital(this.rate, this.duration, i+1)*this.capital;;
					this.amortization[i].monthlyPayment=this.monthlyPayment;
					this.amortization[i].totalPayment=this.monthlyPayment*(i+1);
					this.amortization[i].totalInterest=this.getTotalInterest(i);

				};
			},
			getYearsAmortization : function(){
				return 'ok';
			},
			setDurationLeft : function () {
				var month = (this.newDate.getFullYear() - this.date.getFullYear())*12;
				month-= (this.date.getMonth() - this.newDate.getMonth());
				this.durationLeft = this.initDuration-month;
			},
			getInterest : function (periode) {
					return this.rate*(DC.CreditUtil.calculCapital(this.rate, this.duration, periode)*this.capital);

			},
			getCapital : function (periode) {
					return this.monthlyPayment - this.getInterest(periode);
			},
			getDateTerme : function (periode) {
				var date = new Date(this.newDate.getTime());
				date.setMonth(date.getMonth()+periode);
				return date.toLocaleDateString();

			},
			getTotalInterest: function (periode) {
				var totInterest;
				if(periode>0){
					totInterest = this.amortization[periode-1].totalInterest+this.getInterest(periode);
				}else{
					totInterest = this.getInterest(periode)
				}
				return totInterest;
			},
			setIndem : function (argument) {
				var period = this.duration - this.durationLeft;
				this.indem = this.SRD*this.rate*3;
			},
			round : function (argument) {
				// round à la 5eme decimal
			},
			formatDate : function (date) {
				date.replace('/[-]gi/', '/');
				var datetab = date.split('/');
				var i = datetab[0];
				datetab[0]= datetab[1];
				datetab[1]=i;
				return datetab.join("/");

			},


		};

		return Financement;

	});
});
te;

			this.newRate = newRate;
			this.initNewRate = newRate;
			
			this.duration = duration;
			this.initDuration = duration;
			
			this.date = date;
			this.dateString = date.toLocaleDateString();;
			
			this.newDate = newDate;
			this.newDateString = newDate.toLocaleDateString();
			
			this.monthlyPayment = 0;
			this.durationLeft = 0;
			this.SRD =0;
			this.indem = 0;
			this.amortization = [];
			this.type = 'fixe';
			this.refType = 'fixe';
			this.update();
		}

		Financement.prototype = {
			/* body... */
			init: function(){
				this.mortgage = new Financement(this.initCapital, this. initRate, this.initDuration);

			},
			update: function () {
				this.duration = this.initDuration;
				this.newRate = Math.pow(1 + (this.initNewRate/100), 1 / 12) - 1;
				this.date = new Date(this.formatDate(this.dateString));
				this.newDate = new Date(this.formatDate(this.newDateString));
				this.rate = Math.pow(1 + (this.initRate/100), 1 / 12) - 1;
				this.setDurationLeft();
				this.setSRD();
				this.setCapital();
				this.setMonthlyPayment();
				this.setAmortization();
			},
			setCapital : function () {

				if (this.date.getTime() != this.newDate.getTime()){
					this.setIndem();
					this.capital = this.SRD + this.indem + 330;
					this.rate =this.newRate;
					this.duration = this.durationLeft;

				}	
			},

			setSRD : function(){
				var period = this.duration - this.durationLeft;
				this.SRD = DC.CreditUtil.calculCapital(this.rate, this.duration, period)*this.iniCapital;
			},
			setMonthlyPayment : function(){
				this.monthlyPayment = DC.CreditUtil.calculMensualite(this.rate, this.duration)*this.capital;
			},

			setAmortization : function () {
				this.amortization=[];
				for (var i = 0; i < this.durationLeft; i++) {
					this.amortization[i]={};
					this.amortization[i].month='mois: '+(i+1);
					this.amortization[i].dateTerme=this.getDateTerme(i+1);
					this.amortization[i].interest=this.getInterest(i);
					this.amortization[i].capital=this.getCapital(i);
					this.amortization[i].SRD=DC.CreditUtil.calculCapital(this.rate, this.duration, i+1)*this.capital;;
					this.amortization[i].monthlyPayment=this.monthlyPayment;
					this.amortization[i].totalPayment=this.monthlyPayment*(i+1);
					this.amortization[i].totalInterest=this.getTotalInterest(i);

				};
			},
			getYearsAmortization : function(){
				return 'ok';
			},
			setDurationLeft : function () {
				var month = (this.newDate.getFullYear() - this.date.getFullYear())*12;
				month-= (this.date.getMonth() - this.newDate.getMonth());
				this.durationLeft = this.initDuration-month;
			},
			getInterest : function (periode) {
					return this.rate*(DC.CreditUtil.calculCapital(this.rate, this.duration, periode)*this.capital);

			},
			getCapital : function (periode) {
					return this.monthlyPayment - this.getInterest(periode);
			},
			getDateTerme : function (periode) {
				var date = new Date(this.newDate.getTime());
				date.setMonth(date.getMonth()+periode);
				return date.toLocaleDateString();

			},
			getTotalInterest: function (periode) {
				var totInterest;
				if(periode>0){
					totInterest = this.amortization[periode-1].totalInterest+this.getInterest(periode);
				}else{
					totInterest = this.getInterest(periode)
				}
				return totInterest;
			},
			setIndem : function (argument) {
				var period = this.duration - this.durationLeft;
				this.indem = this.SRD*this.rate*3;
			},
			round : function (argument) {
				// round à la 5eme decimal
			},
			formatDate : function (date) {
				date.replace('/[-]gi/', '/');
				var datetab = date.split('/');
				var i = datetab[0];
				datetab[0]= datetab[1];
				datetab[1]=i;
				return datetab.join("/");

			},


		};

		return Financement;

	});
});
