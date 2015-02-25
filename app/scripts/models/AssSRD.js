define([
	'scripts/app',
	'DocteurCreditJS',
	'moment',
	'scripts/models/DBRead.js'
	], function (app,DC,mm) {
	app.factory('AssSRD', function (DBRead , $http){
		/**
		 * [AssSRD description]
		 * @param {[type]} capital  [description]
		 * @param {[type]} rate     [description]
		 * @param {[type]} duration [description]
		 * @param {[type]} date     [description]
		 */
		function AssSRD(rate){

			this.prime = 'Prime unique';
			this.amount = 0;
			this.duration = 6;
			this.rate = rate;
			this.totAmount = 0;
			this.primeTable = [];
			this.diffMp = 0;
			this.newMp = 0;

			//this.generateRateTable();
			//this.update();

		}

		AssSRD.prototype = {

			setRate : function (duration, mpay, rate, capital) {
				var newMp;
				var amount;
				this.primeTable[0] = {};
				this.primeTable[0].amount = this.amount;
				this.primeTable[0].realAmount = this.amount;
				this.primeTable[0].totAmount = this.amount;
				if (this.prime.localeCompare("Prime unique")==0) {
					amount = this.amount;
				}else{
					if (this.prime.localeCompare("Prime annuelle")==0) {
						this.setAnPrimeTable(duration);
						amount = this.getTotalAmount(rate,this.amount);
					}else{
						var anDuration = Math.floor(duration);
						this.duration = this.duration>anDuration ? anDuration : this.duration ;
						this.setSuccPrimeTable(this.duration);
						amount = this.getTotalAmount(rate,this.amount);

					}
				};
				this.totAmount = amount;
				this.diffMp = this.round(amount/duration,100);
				this.newMp = mpay+this.diffMp;
				this.rate = this.getRealRate(duration, mpay,  capital);
			},

			getRealRate : function (durationLeft, mPay, capitalLeft) {
				mp = mPay+this.diffMp;

				var rrate = DC.CreditUtil.calculTauxC( mp/capitalLeft,durationLeft);
				rrate = DC.CreditUtil.tauxPeriodiqueToAn(rrate,1)*100;
				return this.round(rrate,1000);;
			},

			getTotalAmount : function  (rate,amount) {
				var totAmount = this.primeTable[0].amount;
				for (var i = 1; i < this.primeTable.length; i++) {
					this.primeTable[i].realAmount = this.round(this.primeTable[i].amount/Math.pow((1+(rate/100)), i),100);
					this.primeTable[i].totAmount = this.primeTable[i].realAmount+this.primeTable[i-1].totAmount;
					totAmount+= this.primeTable[i].realAmount;
				};
				totAmount = this.round(totAmount,100);
				return totAmount;
				
			},

			setAnPrimeTable : function  (duration) {
				var len = Math.round(((duration/12)/3)*2);
				this.primeTable = [];
				for (var i = 0; i < len; i++) {
					this.primeTable[i] = {};
					this.primeTable[i].amount = this.amount;
				};
				this.primeTable[0].realAmount = this.amount;
				this.primeTable[0].totAmount = this.amount;
			},

			setSuccPrimeTable : function  (duration) {
				var len = Math.ceil(duration);
				var j = this.primeTable.length;
				if(len<this.primeTable.length){
					this.primeTable=this.primeTable.slice(0,len);

				}else{
					for (var i = j ; i < len; i++) {
						this.primeTable[i] = {};
						this.primeTable[i].amount = this.amount;
					};
				}
			},

			reset : function (rate) {
				this.rate = rate;
				this.totAmount = 0;
				//this.prime = 'Prime unique';
				//this.amount = 0;
				//this.duration = 60;
				//this.primeTable = [];
			},

			round : function (val,rank) {
				return Math.round(val*rank)/rank;
			}


		};

		return AssSRD;

	});
});
