define([
	'scripts/app',
	'DocteurCreditJS',
	'moment',
	'scripts/models/DBRead.js',
	'scripts/models/AssSRD.js'
	], function (app,DC,mm) {
	app.factory('Financement', function (AssSRD){
		/**
		 * [Financement description]
		 * @param {[type]} capital  [description]
		 * @param {[type]} rate     [description]
		 * @param {[type]} duration [description]
		 * @param {[type]} date     [description]
		 */
		function Financement(capital, rate, duration, date){

			
			this.capital = capital;

			this.rate = rate;
			this.initRate = this.rate;
			this.addRate = 0;
			this.trueRate = this.initRate+this.addRate;

			this.duration = duration;
			this.durationLeft = duration;
			this.moyDuration = this.duration;

			
			this.date = date;
			this.dateString = mm(date).format('DD/MM/YYYY');
			
			this.monthlyPayment = 0;
			this.variation = {};
			this.cap = {pos:3,neg:3};
			this.refInd = [];
			this.refInd[0] =  {};
			this.refInd[0].val = 0;
			this.refInd[0].rate =  this.rate;
			this.refInd[0].date =  {date: mm(date).format('DD/MM/YYYY')};
			this.refInd[0].dateList =  [this.refInd[0].date];

			this.amortization = [];
			this.amortizationParYears = [];
			this.story = 'costum';
			this.type = 'fixe';
			this.hasAssSRD = false;
			this.AssSRD = new AssSRD(this.trueRate);
			//this.generateRateTable();
			this.update();

		}

		Financement.prototype = {
			/* body... */
			/**
			 * [update description]
			 * @return {[type]} [description]
			 */
			update: function () {
				this.iniRate = this.initRate<0 ? 0 : this.initRate;
				var neg = 0-this.initRate;
				this.addRate =  this.addRate < neg ? neg : this.addRate;
				var savedate= mm(this.date).format('DD/MM/YYYY');
				this.date = new Date(this.formatDate(this.dateString));
				if (savedate.localeCompare(mm(this.date).format('DD/MM/YYYY'))!==0) {
					this.refInd = this.refInd.slice(0,1);
				};
				this.trueRate = this.initRate+this.addRate;
				this.rate = Math.round((Math.pow(1 + ((this.trueRate)/100), 1 / 12) - 1)*1000000)/1000000;
				this.setMonthlyPayment();
				if (this.hasAssSRD) {
					
					this.AssSRD.setRate(this.duration, this.monthlyPayment, this.trueRate, this.capital); 
				}else{
					this.AssSRD.reset(this.trueRate);
				};
				this.trueRate = this.initRate+this.addRate;
				this.rate = Math.round((Math.pow(1 + ((this.trueRate)/100), 1 / 12) - 1)*1000000)/1000000;
				this.setMonthlyPayment();
				this.refInd[0].monthlyPayment = this.monthlyPayment;
				this.refInd[0].realRate = this.AssSRD.rate;
	

				if(this.type.localeCompare('fixe') == 0 ){
					this.refInd = this.refInd.slice(0,1);
					this.refInd[0].val = 0;
					this.refInd[0].rate = (this.trueRate);
					this.refInd[0].date =  {date: this.dateString};
					this.refInd[0].dateList =  [this.refInd[0].date];
					this.variation = {};
					this.setAmortization();
				}else{
					this.setVariation();
					this.getRefTableStart();
					if(this.variation.fixe>= this.duration){
						this.setAmortization();
						this.refInd = this.refInd.slice(0,1);
					}else{
						this.setAmortizationWithVariation();
					}
					this.quart = this.quartile();
					this.moy = this.moyenne(this.moyDuration);
				}
				if (this.hasAssSRD) {
					this.addAssSRDToAmortization();
				};


			},

			/**
			 * [setDuration description]
			 * @param {[type]} argument [description]
			 */
			setDuration : function (argument) {
				this.duration = Math.ceil(DC.CreditUtil.calculDuree(DC.CreditUtil.tauxAnToPeriodique((this.initRate+this.addRate)/100,1), this.monthlyPayment/this.capital));
			},

			/**
			 * [setMonthlyPayment description]
			 */
			setMonthlyPayment : function(){
				this.monthlyPayment = DC.CreditUtil.calculMensualite(this.rate, this.duration)*this.capital;
			},

			/**
			 * [setAmortization description]
			 */
			setAmortization : function () {
				this.amortization=[];
				this.amortizationParYears=[];
				//this.setRefIndData(0,this.rate);
				this.initArmortizationVal(0,this.duration, this.duration, this.capital, this.rate);
				this.totalPayment = this.amortization[this.duration-1].totalPayment;
				if (this.hasAssSRD) {
					this.totalPayment+=this.AssSRD.totAmount;
				};
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;
			},

			/**
			 * [setAmortizationWithVariation description]
			 */
			setAmortizationWithVariation : function () {
				//this.initRefTable();
				this.amortization=[];
				this.amortizationParYears=[];
				this.setMax();
				this.initArmortizationVal(0,this.variation.fixe,this.duration, this.capital, this.rate);

				//this.setRefIndData(0,this.rate);
				//this.refInd = this.refInd.slice(0,1);
				//this.setIndexationRate();

				switch(this.story){
					case 'max':
						this.calculIndexationMax();
						break;
					case 'min':
						this.calculIndexationMin();
						break;
					case 'same':
						this.calculIndexationSame();
						break;
					case 'limit':
						this.calculIndexionLimite();
						break;
					case 'costum':
						this.calculIndexionCostum(this.rate);
						break;
					default:
						this.calculIndexationMax();
						break;
				}
				var l = 0;
				var founded = false
				while(!founded){
					if(this.refInd[0].dateList[l].date.localeCompare(this.refInd[0].date.date)==0){
						founded = true;
					}
					l++;
				}
				this.refInd[0].val = this.refTab[this.refInd[0].dateList[l-1].position][this.variation.type];
				var rate;
				var j = 1;
				for (var i = this.variation.fixe; i < this.duration; i=i+this.variation.reval) {
					var durationLeft = this.duration - i;
					if(this.story.localeCompare('costum')==0 || this.refInd[j].dateList.length>1){
						if (this.refInd[j].dateList.length>1) {
							var k = 0;
							var found = false
							while(!found){
								if(this.refInd[j].dateList[k].date.localeCompare(this.refInd[j].date.date)==0){
									found = true;
								}
								k++;
							}
							this.refInd[j].val = this.refTab[this.refInd[j].dateList[k-1].position][this.variation.type];
							if (j==0) {
							};
						};
						//j = j===0 ? 1 : j;
					}
					this.rate = this.indexation(this.refInd[j].val);
					if (this.variation.fixe == 12  && i<= this.variation.fixe+24 && this.rate > DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1)) {
						switch(i){
							case this.variation.fixe:
								var one =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(1/100,1));
								rate = one < this.rate ? (one): this.rate;
									if (this.story.localeCompare('costum')!=0) {
										this.refInd[i/12].val = this.round(this.calculInRef(rate)); 
									};
								break;
							case this.variation.fixe+12:
								var two =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(2/100,1));
								rate = two < this.rate ? (two) : this.rate;
									if (this.story.localeCompare('costum')!=0) {
										this.refInd[i/12].val = this.round(this.calculInRef(rate));
									};
								break;
							case this.variation.fixe+24:
								var three =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(3/100,1));
								rate = three < this.rate ? (three) : this.rate;
									if (this.story.localeCompare('costum')!=0) {
										this.refInd[i/12].val = this.round(this.calculInRef(rate));
									};
							default:
								rate = this.rate;
								break;
						}
					}else{
						rate = this.rate;
					};
					this.setRefIndData(j,rate, DC.CreditUtil.calculMensualite(rate, durationLeft)* this.amortization[i-1].SRD, durationLeft, this.amortization[i-1].SRD);
					if(this.duration - i < this.variation.reval){
						this.initArmortizationVal(i,this.duration, durationLeft, this.amortization[i-1].SRD, rate);

					}else{
						this.initArmortizationVal(i,this.variation.reval+i,durationLeft, this.amortization[i-1].SRD, rate);

					}

					j++;
				};
				this.totalPayment = this.amortization[this.duration-1].totalPayment;
				if (this.hasAssSRD) {
					this.totalPayment+=this.AssSRD.totAmount;
				};
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;
			},

			/**
			 * [initArmortizationVal description]
			 * @param  {[type]} position     [description]
			 * @param  {[type]} len          [description]
			 * @param  {[type]} durationLeft [description]
			 * @param  {[type]} capital      [description]
			 * @param  {[type]} rate         [description]
			 * @return {[type]}              [description]
			 */
			initArmortizationVal : function (position, len, durationLeft, capital, rate){
				var period = 1;


				for (var i = position; i < len; i++) {
					this.amortization[i]={};
					this.amortization[i].month='mois: '+(i+1);
					this.amortization[i].dateTerme=this.getDateTerme(i+1);
					this.amortization[i].rate=DC.CreditUtil.tauxPeriodiqueToAn(rate,1)*100;
					this.amortization[i].monthlyPayment=DC.CreditUtil.calculMensualite(rate, durationLeft)*capital;
					this.amortization[i].SRD=DC.CreditUtil.calculCapital(rate, durationLeft, period)*capital;
					this.amortization[i].interest=this.getInterest(period,durationLeft,capital,rate);
					this.amortization[i].capital=this.amortization[i].monthlyPayment - this.amortization[i].interest;
					this.amortization[i].totalPayment=this.getTotalPayment(i);
					this.amortization[i].totalInterest=this.getTotalInterest(i);
					period++;

					if(i>=this.duration - this.durationLeft){
						
						var tmp = Math.floor(i/12) 
						if(this.duration !== this.durationLeft){
									tmp-= Math.floor((this.duration - this.durationLeft)/12);
								}
						if(tmp!==ypos){
							var ypos = Math.floor(i/12);
								if(this.duration !== this.durationLeft){
									ypos-= Math.floor((this.duration - this.durationLeft)/12);
								}
							this.amortizationParYears[ypos] = {};

							this.amortizationParYears[ypos].month=0;
							this.amortizationParYears[ypos].rate=0;
							this.amortizationParYears[ypos].monthlyPayment=0;
							this.amortizationParYears[ypos].SRD=0;
							this.amortizationParYears[ypos].interest= 0;
							this.amortizationParYears[ypos].capital= 0;
							this.amortizationParYears[ypos].totalPayment= 0;
							this.amortizationParYears[ypos].totalInterest= 0;
						}
						};
						if (i>=this.duration - this.durationLeft) {
							//var cutpos = this.duration!== this.durationLeft ? this.duration-this.durationLeft-1,
							this.amortizationParYears[ypos].month= (ypos+1);
							this.amortizationParYears[ypos].dateTerme= this.amortization[i].dateTerme;
							this.amortizationParYears[ypos].rate=this.amortization[i].rate ;
							this.amortizationParYears[ypos].monthlyPayment= this.amortization[i].monthlyPayment;
							this.amortizationParYears[ypos].SRD= this.amortization[i].SRD;
							this.amortizationParYears[ypos].interest+= this.amortization[i].interest;
							this.amortizationParYears[ypos].capital+= this.amortization[i].capital;
							this.amortizationParYears[ypos].totalPayment= (this.duration!== this.durationLeft) ? this.amortization[i].totalPayment-(this.amortization[this.duration-this.durationLeft-1].totalPayment):this.amortization[i].totalPayment;
							this.amortizationParYears[ypos].totalInterest= (this.duration!== this.durationLeft) ? this.amortization[i].totalInterest-(this.amortization[this.duration-this.durationLeft-1].totalInterest):this.amortization[i].totalInterest;
							
						};

				};

			},

			addAssSRDToAmortization : function () {
				for (var i = 0; i < this.AssSRD.primeTable.length; i++) {
					this.amortizationParYears[i].totalPayment+= this.AssSRD.primeTable[i].totAmount;
					this.amortizationParYears[i].ASRD = this.AssSRD.primeTable[i].realAmount;
				};
				for (var i = this.AssSRD.primeTable.length; i < this.amortizationParYears.length; i++) {
					this.amortizationParYears[i].totalPayment += this.AssSRD.totAmount;
					this.amortizationParYears[i].ASRD = 0;
				};

			},

			/**
			 * [getYearsAmortization description]
			 * @return {[type]} [description]
			 */
			getYearsAmortization : function(){
				return 'ok';
			},

			/**
			 * [getInterest description]
			 * @param  {[type]} periode  [description]
			 * @param  {[type]} duration [description]
			 * @param  {[type]} capital  [description]
			 * @param  {[type]} rate     [description]
			 * @return {[type]}          [description]
			 */
			getInterest : function (periode, duration, capital,rate) {

					return rate*(DC.CreditUtil.calculCapital(rate, duration, periode-1)*capital);

			},

			/**
			 * [getCapital description]
			 * @param  {[type]} periode [description]
			 * @return {[type]}         [description]
			 */
			getCapital : function (periode) {
					return this.monthlyPayment - this.getInterest(periode);
			},

			/**
			 * [getDateTerme description]
			 * @param  {[type]} periode [description]
			 * @return {[type]}         [description]
			 */
			getDateTerme : function (periode) {
				var newdate = {};
				newdate = new Date(this.date.getTime());
				newdate.setMonth(newdate.getMonth()+periode);
				return mm(newdate).format('DD/MM/YYYY');

			},

			/**
			 * [getTotalInterest description]
			 * @param  {[type]} periode [description]
			 * @return {[type]}         [description]
			 */
			getTotalInterest: function (periode) {
				var totInterest;
				if(periode>0){
					totInterest = this.amortization[periode-1].totalInterest+this.amortization[periode].interest;
				}else{
					totInterest = this.amortization[0].interest
				}
				return totInterest;
			},

			/**
			 * [getTotalPayment description]
			 * @param  {[type]} periode [description]
			 * @return {[type]}         [description]
			 */
			getTotalPayment: function (periode) {
				var totPayment;
				if(periode>0){
					totPayment = this.amortization[periode-1].totalPayment+this.amortization[periode].interest+this.amortization[periode].capital;
				}else{
					totPayment = this.amortization[0].interest+this.amortization[0].capital;
				}

				return totPayment;
			},

			/**
			 * [round description]
			 * @param  {[type]} argument [description]
			 * @return {[type]}          [description]
			 */
			round : function (argument) {
				// round à la 5eme decimal
			},

			/**
			 * [formatDate description]
			 * @param  {[type]} date [description]
			 * @return {[type]}      [description]
			 */
			formatDate : function (date) {
				date.replace('/[-]gi/', '/');
				var datetab = date.split('/');
				var i = datetab[0];
				datetab[0]= datetab[1];
				datetab[1]=i;
				return datetab.join("/");

			},
			/**
			 * [getTotalInterestFromPeriode description]
			 * @param  {[type]} duration [description]
			 * @return {[type]}          [description]
			 */
			getTotalInterestFromPeriode : function (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].interest;
				}

				return total;
			},

			/**
			 * [getTotalCapitalFromPeriode description]
			 * @param  {[type]} duration [description]
			 * @return {[type]}          [description]
			 */
			getTotalCapitalFromPeriode : function (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].capital;
				}

				return total;
			},

			/**
			 * [getTotalFromPeriode description]
			 * @param  {[type]} duration [description]
			 * @return {[type]}          [description]
			 */
			getTotalFromPeriode : function  (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].interest+this.amortization[i].capital;
				}
				if (this.hasAssSRD) {
					total+=this.AssSRD.totAmount;
				};
				return total;
			},

			/**
			 * [setVariation description]
			 * @param {[type]} argument [description]
			 */
			setVariation: function (argument) {
				var temp = this.type.split("/");
				this.variation = { 'fixe':temp[0]*12, 'reval':temp[1]*12};
				switch(temp[1]){
					case '1':
						this.variation.type = 'A';
						break;
					case '3':
						this.variation.type = 'C';
						break;
					case '5':
						this.variation.type = 'E';
						break;
				}
			},

			/**
			 * [calculIndexationMax description]
			 * @param  {[type]} argument [description]
			 * @return {[type]}          [description]
			 */
			calculIndexationMax : function (argument) {
				this.refInd = this.refInd.slice(0,1);
				this.rate =  DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1)+this.maxInd;
				this.calculIndexionCostum(this.rate);
				 
			},

			/**
			 * [calculIndexationMin description]
			 * @param  {[type]} argument [description]
			 * @return {[type]}          [description]
			 */
			calculIndexationMin : function (argument) {
				this.refInd = this.refInd.slice(0,1);
				this.rate =  DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1)-this.minInd;
				this.calculIndexionCostum(this.rate);
			},

			/**
			 * [calculIndexationSame description]
			 * @return {[type]} [description]
			 */
			calculIndexationSame : function (){
				this.refInd = this.refInd.slice(0,1);
				this.refInd[this.refInd.length] = {};
				this.refInd[this.refInd.length-1].val = this.refInd[0].val;
				var tmp =  DC.CreditUtil.tauxAnToPeriodique(this.refInd[this.refInd.length-1].val/100,1) - DC.CreditUtil.tauxAnToPeriodique(this.refInd[0].val/100,1);
				var ind;
				if (tmp<0) {
					ind = this.max(Math.abs(tmp),this.minInd);
					ind = 0-ind;
				}else{
					ind = this.max(Math.abs(tmp),this.maxInd);
					ind = ind;
				};
				this.rate =  DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1) + ind; 
				this.calculIndexionCostum(this.rate);

			},

			/**
			 * [calculIndexionLimite description]
			 * @return {[type]} [description]
			 */
			calculIndexionLimite : function (){
				this.story = 'costum';
				this.calculIndexationSame();
				var ind = Math.floor(this.refInd[0].val - this.refInd[0].rate);
				var rank = 1;
				this.findLimite(ind, rank);
				this.story = 'limit';

			},
			getIndiceMax : function  () {
				return this.calculInRef(DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1)+this.maxInd);// body...
			},

			getIndiceMin : function  () {
				return this.calculInRef(DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1)-this.minInd);// body...
				// body...
			},

			/**
			 * [findLimite description]
			 * @param  {[type]} indice [description]
			 * @param  {[type]} rank   [description]
			 * @return {[type]}        [description]
			 */
			findLimite : function (indice , rank) {
				if (this.indiceAdvantageous(indice+rank)  && indice+rank < this.maxIndice) {
					this.findLimite(indice+rank, rank);
				}else{
					if (rank>0.001) {
						this.findLimite(indice,rank/10);
					}else{
						for (var i = 1; i < this.refInd.length; i++) {
							this.refInd[i].val=indice;
						}	
					}
				}
				this.update();
			},

			/**
			 * [indiceAdvantageous description]
			 * @param  {[type]} indice [description]
			 * @return {[type]}        [description]
			 */
			indiceAdvantageous : function (indice) {
				var advantageous = false;
				for (var i = 1; i < this.refInd.length; i++) {
					this.refInd[i].val=indice;
				};
				this.update();
				if (this.totalPaymentInitMortgage>this.totalPayment) {
					advantageous = true;
				};
				return advantageous;
			},


			/**
			 * [calculIndexionCostum description]
			 * @param  {[type]} rate [description]
			 * @return {[type]}      [description]
			 */
			calculIndexionCostum : function (rate){
				var offset = 0;
				var start;
				if(this.refInd[0].type.localeCompare(this.variation.type)!==0){
					this.refInd = this.refInd.slice(0,1);
					this.refInd[0].type = this.variation.type ;
				}
				if(this.startDatePosition>0){
					offset = this.refTab.length - this.startDatePosition;
				}

				var rest = this.duration - this.variation.fixe;
				var len = Math.ceil(rest/this.variation.reval);
				
				if(len+1 < this.refInd.length){
					this.refInd = this.refInd.slice(0,len+1);
				}else{
					var deb = this.refInd.length;
					position = this.startDatePosition;
					for (var i = deb; i < len+1 ; i++) {
						position = this.startDatePosition + (i-1)*this.variation.reval;
						this.refInd[i] = {};
						this.refInd[i].dateList = [];
						if (position<this.refTab.length) {
							this.refInd[i].val = this.refTab[position][this.variation.type];
							for (var j = 0; j < 3; j++) {
								//this.refInd[i][j] = {};
								this.refInd[i].dateList[j] = {};
								this.refInd[i].dateList[j].date = mm(this.refTab[position].date).format('DD/MM/YYYY');
								this.refInd[i].dateList[j].position = position;
								//this.refInd[i][j].val = this.refTab[position][this.variation.type];
								//this.refInd[i][j].rate = (this.trueRate);
								position--;
							};
							this.refInd[i].date = this.refInd[i].dateList[0];
							position = this.startDatePosition + (i)*this.variation.reval;
						}else{
								//this.refInd[i][0] = {};
								this.refInd[i].dateList[0] = {};
								this.refInd[i].dateList[0].date = this.getDateTerme(this.variation.fixe+(this.variation.reval*(i-1)));
								this.refInd[i].date = this.refInd[i].dateList[0];
								this.refInd[i].dateList[0].position = -1;
								this.refInd[i].val = this.story.localeCompare('costum')==0 ? this.refTab[this.refTab.length-1][this.variation.type] : this.round(this.calculInRef(rate));
								//this.refInd[i][0].rate = (this.trueRate);
								//start--;
							
						};

						//this.refInd[i] = [];
						//this.refInd[i].val = this.round(this.calculInRef(rate));
						//this.refInd[i].date = this.getDateTerme(this.variation.fixe+(this.variation.reval*(i-1)));
					};
				}


			},

			getRefIndLength : function (argument) {
				var found = false;
				var i = 0;
				var start = 0;
				while(!found && i<this.refInd.length){
					if(this.refInd[i].dateList.length>1){
						start++;
					}else{
						found = true;
					}
					i++;
				}
				return this.refInd.length - start;
			},

			/**
			 * [setRefIndData description]
			 * @param {[type]} period [description]
			 * @param {[type]} rate   [description]
			 */
			setRefIndData : function (period,rate, monthlyPayment, durationLeft, capitalLeft) {
				//if (period==0) {
				//	this.refInd[period].date = this.date.toLocaleDateString();
				//}else{
					//this.refInd[period].date = this.getDateTerme(this.variation.fixe+(this.variation.reval*(period-1)));
				///}
				 this.refInd[period].rate = this.round(DC.CreditUtil.tauxPeriodiqueToAn(rate,1)*100);

				 if (this.hasAssSRD) {

				 	//capitalLeft += (this.AssSRD.diffMp *  durationLeft);
				 	
				 	//var capital = DC.CreditUtil.calculCapital(DC.CreditUtil.tauxAnToPeriodique(this.refInd[period-1].realRate /100,1), durationLeft, 1)*this.capital;
				 	this.refInd[period].realRate = this.AssSRD.getRealRate(durationLeft,monthlyPayment,capitalLeft)
				 };
				 this.refInd[period].monthlyPayment = monthlyPayment;

			},

			/**
			 * [calculIndexionAdd description]
			 * @param  {[type]} rateToAdd [description]
			 * @return {[type]}           [description]
			 */
			calculIndexionAdd : function (rateToAdd) {
				return DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1)+rateToAdd;
			},

			/**
			 * [setMax description]
			 * @param {[type]} argument [description]
			 */
			setMax : function (argument) {
				this.maxInd = this.max(DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1),DC.CreditUtil.tauxAnToPeriodique(this.cap.pos/100,1));
				this.minInd = this.max(DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1),DC.CreditUtil.tauxAnToPeriodique(this.cap.neg/100,1));
				this.maxIndice =  this.calculInRef(this.maxInd + DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1));
			},

			/**
			 * [max description]
			 * @param  {[type]} a [description]
			 * @param  {[type]} b [description]
			 * @return {[type]}   [description]
			 */
			max : function (a,b) {
				return a<b ? a : b;
			},

			/**
			 * [setIndRefList description]
			 */
			setIndRefList : function () {
				
			},

			/**
			 * [calculInRef description]
			 * @param  {[type]} rate [description]
			 * @return {[type]}      [description]
			 */
			calculInRef : function (rate) {
				var indRef = rate - DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1) + DC.CreditUtil.tauxAnToPeriodique(this.refInd[0].val/100,1);
				return DC.CreditUtil.tauxPeriodiqueToAn(indRef,1)*100;
			},

			/**
			 * [indexation description]
			 * @param  {[type]} refInd [description]
			 * @return {[type]}        [description]
			 */
			indexation : function  (refInd) {
				var indexation = DC.CreditUtil.tauxAnToPeriodique(refInd/100,1) - DC.CreditUtil.tauxAnToPeriodique(this.refInd[0].val/100,1);
				if (indexation<0) {
					indexation = Math.abs(indexation) < this.minInd ? indexation :( 0 - this.minInd);
				}else{
					indexation = indexation < this.minInd ? indexation : this.minInd;
				};
				return DC.CreditUtil.tauxAnToPeriodique((this.trueRate)/100,1) + indexation;
			},

			/**
			 * [setCap description]
			 * @param {[type]} argument [description]
			 */
			setCap : function (argument) {
				var split = this.type.split(' ');
				var splitCap= split[1].split('/');
				this.cap.pos = parseInt(splitCap[0].replace(/[\(\)\+]/g, ''))
				this.cap.neg = parseInt(splitCap[0].replace(/[\(\)\-]/g, ''))
			},

			/**
			 * [round description]
			 * @param  {[type]} val [description]
			 * @return {[type]}     [description]
			 */
			round : function (val) {
				return Math.round(val*1000)/1000;
			},

			/**
			 * [setRefTab description]
			 * @param {[type]} tab [description]
			 */
			setRefTab : function (tab) {
				this.refTab = [];
				for (var i = 0; i < tab.length; i++) {
					this.refTab[i] = {};
					this.refTab[i].date = new Date(tab[i].date);
					this.refTab[i].A = this.round(parseFloat(tab[i].A));
					this.refTab[i].C = this.round(parseFloat(tab[i].C));
					this.refTab[i].E = this.round(parseFloat(tab[i].E));
				};
			},

			/**
			 * [getRefTableStart description]
			 * @param  {[type]} argument [description]
			 * @return {[type]}          [description]
			 */
			getRefTableStart : function (argument) {
				var today = new Date();
				var start = 0;
				var offset = this.getMonthDifference(this.date, today);
				offset += 0; 
				var start = offset>0 ? this.refTab.length - offset : this.refTab.length-1;
				var fisrtdate = {date:mm(this.refTab[start].date).format('DD/MM/YYYY'), position:start};
				//this.refInd = [];
				if(this.refInd[0].dateList.indexOf(this.refInd[0].date)<0 ||
					JSON.stringify(this.refInd[0].dateList[0]) !== JSON.stringify(fisrtdate)||
					this.refInd[0].rate !== (this.trueRate)
					){
					this.refInd[0].dateList = [];
					this.refInd[0].val = this.refTab[start][this.variation.type];
					if (offset>0) {

						for (var i = 0; i < 3; i++) {
							//this.refInd[0][i] = {};
							this.refInd[0].dateList[i] ={};
							this.refInd[0].dateList[i].date = mm(this.refTab[start].date).format('DD/MM/YYYY');
							this.refInd[0].dateList[i].position = start;
							//this.refInd[0][i].val = this.refTab[start][this.variation.type];
							//this.refInd[0][i].rate = (this.trueRate);
							start--;
						};
					}else{
						this.refInd[0].dateList[0] ={};
						this.refInd[0].dateList[0].date = mm(this.refTab[start].date).format('DD/MM/YYYY');
						this.refInd[0].dateList[0].position = start;
					};

					this.refInd[0].date = this.refInd[0].dateList[0];
					this.refInd[0].rate = (this.trueRate);
					this.refInd[0].type = this.variation.type;
				}
				start = this.refTab.length;
				offset = offset - this.variation.fixe;
				if (offset>0) {
					start = this.refTab.length - offset;
				};
				this.startDatePosition = start;
			},
			/**
			 * [getMonthDifference description]
			 * @param  {[type]} date    [description]
			 * @param  {[type]} dateTwo [description]
			 * @return {[type]}         [description]
			 */
			getMonthDifference : function (date, dateTwo){
				var month = (dateTwo.getFullYear() - date.getFullYear())*12;
				month-= (date.getMonth() - dateTwo.getMonth());
				return month;
			},

			/**
			 * [initRefTable description]
			 * @param  {[type]} argument [description]
			 * @return {[type]}          [description]
			 */
			initRefTable : function (argument) {

			},

			moyenne : function  (duration) {
				var startpos =  this.refTab.length - duration;
				var len = startpos<0?  this.refTab.length : duration;
				startpos = startpos<0? 0 : startpos;
				var moy = 0;
				for (var i = startpos; i <  this.refTab.length; i++) {
					moy+= this.refTab[i][this.variation.type];
				};
				moy = Math.round(( moy/len)*100)/100;
				var rate = DC.CreditUtil.tauxPeriodiqueToAn(this.indexation(moy),1)*100;
				rate = Math.round(rate*100)/100;
				return {'indice':moy,'rate': rate};
			},

			quartile : function (){
				//console.log('start ',this.getRefIndLength());
				var ordered = this.sortTab(this.moyDuration,  this.refTab);
				var len = this.moyDuration< this.refTab.length ? this.moyDuration :  this.refTab.length;
				var quart = [];
				var ratea = DC.CreditUtil.tauxPeriodiqueToAn(this.indexation(ordered[Math.ceil(len/4)-1]),1)*100;
				ratea = Math.round(ratea*100)/100;

				var rateb = DC.CreditUtil.tauxPeriodiqueToAn(this.indexation(ordered[(Math.ceil((len/4)*3)-1)]),1)*100;
				rateb = Math.round(rateb*100)/100;
				quart[0]={};
				quart[0].q25 = {
					'indice': ordered[Math.ceil(len/4)-1],
					'rate' : ratea
				};
				quart[0].q75 = {
					'indice':ordered[Math.ceil((len/4)*3)-1],
					'rate': rateb
				};
				var qlen =  this.getRefIndLength();
				console.log(qlen);
				var offset = this.refInd.length - qlen;
				for (var i = 0; i < qlen; i++) {
					var orde;var lent;
					console.log('offset ',offset);
					if (offset==0 && i==0) {
						console.log(qlen);
						console.log(this.durationLeft);
						if (this.durationLeft == this.duration) {
							lent = this.variation.fixe< this.refTab.length ? this.variation.fixe :  this.refTab.length;
						}else{
							lent = this.durationLeft - (qlen-1)*this.variation.reval; 
						};
						
						
					}else{
						if (i==0 ) {
							console.log(qlen);
							console.log(this.durationLeft);
							lent = this.durationLeft - (qlen)*this.variation.reval; 
						}else{
							var rest = this.durationLeft == this.duration ? this.variation.fixe : this.durationLeft - (qlen)*this.variation.reval;
							lent = rest+(this.variation.reval*i) < this.refTab.length ? rest+(this.variation.reval*i)  :  this.refTab.length;
						};
					};
					orde =  this.sortTab(lent, this.refTab);
					 var ratec = DC.CreditUtil.tauxPeriodiqueToAn(this.indexation(orde[Math.ceil(lent/4)-1]),1)*100;
					ratec = Math.round(ratec*100)/100;

					var rated = DC.CreditUtil.tauxPeriodiqueToAn(this.indexation(orde[(Math.ceil((lent/4)*3)-1)]),1)*100;
					rated = Math.round(rated*100)/100;
					quart[i+1]={};

					quart[i+1].q25 = {
						'indice': orde[Math.ceil(lent/4)-1],
						'rate' : ratec
					};

					quart[i+1].q75 = {
						'indice':orde[Math.ceil((lent/4)*3)-1],
						'rate': rated
					};

					quart[i+1].len = lent;
				};
				console.log(quart);


				return quart;


			},

			sortTab : function (len , tab) {
				len = len< this.refTab.length ? len :  this.refTab.length;
				var startpos = tab.length - len;
				var ordered = [];
				startpos = startpos<0? 0 : startpos;
				for (var i = startpos; i < tab.length; i++) {
					ordered.push(tab[i][this.variation.type]);
				};

				ordered.sort(function (a,b) {
					return a-b;
				});

				return ordered;
			}



		};

		return Financement;

	});
});
