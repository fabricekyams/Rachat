define([
	'scripts/app',
	'DocteurCreditJS',
	'moment',
	'scripts/models/Financementbeta.js'
	], function (app,DC,mm) {
		app.factory('Refinancing', function (Financement){
		/**
		 * [Refinancing description]
		 * @param {[type]} capital   [description]
		 * @param {[type]} rate      [description]
		 * @param {[type]} duration  [description]
		 * @param {[type]} date      [description]
		 * @param {[type]} newDate   [description]
		 * @param {[type]} newRate   [description]
		 * @param {[type]} rateTable [description]
		 */
		 function Refinancing(capital, rate, duration, date, newDate, newRate, rateTable){
		 	this.initMortgage = new Financement(capital, rate, duration, date);
		 	this.rate = rate;
		 	this.date = date;
		 	this.newDate = newDate;
		 	this.freeRate = false;
		 	this.knowSRD = 'no';
		 	this.externalRef = false;
		 	this.duration = duration;
		 	this.init(this.rate);
		 	this.fileCharges = 330;
		 	this.fraisNotaire = 400;
		 	this.releaseCharges = 0;
		 	this.MGRegistration = 0;
		 	this.refMortgage = new Financement(this.capital, newRate, this.durationLeft, newDate);
		 	this.refMortgage.rateTable = [];
		 	this.generateRateTable(rateTable);
		 	this.generateTypeTable(rateTable);
		 	this.refMortgage.rateTable[0]=newRate;
		 	this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
		 	this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
		 	this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
		 	this.refMortgage.totalPaymentInitMortgage = this.initMortgage.totalPaymentIfRef;
		 	this.refIndMaxRef = [];
		 	this.refIndMaxInit = [];
		 	this.quote = ['>85%','<=85%'];
		 	this.refMortgage.quote = this.quote[0];
		 	this.homeSafe = ['One','Two', 'Three'];
		 	this.refMortgage.homeSafe = this.homeSafe[0];
		 	this.vip = ['NON VIP', 'VIP', 'TOP VIP'];
		 	this.refMortgage.vip = this.vip[0];
		 	this.prime = ['Prime unique','Prime annuelle', 'Prime successive']
		 	this.update(false, true, true);



		 }

		 Refinancing.prototype = {

			/**
			 * [update description]
			 * @param  {[type]} ref           [description]
			 * @param  {[type]} duration      [description]
			 * @param  {[type]} durationFirst [description]
			 * @return {[type]}               [description]
			 */
			 update: function (ref,  duration, durationFirst) {

				this.initMortgage.duration = this.initMortgage.duration<72 ? 72 : this.initMortgage.duration;

			 	this.durationLeft = this.getDurationLeft(this.date, new Date(this.refMortgage.formatDate(this.refMortgage.dateString)));
			 	this.durationLeft = this.durationLeft < 1 ? 0 : this.durationLeft; 
			 	this.initMortgage.durationLeft = this.durationLeft;

			 	if (!ref) {
			 		this.initMortgage.update();
			 		if ( this.initMortgage.type.localeCompare('fixe')!==0) {
			 			this.initPos =  this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
			 			this.initMortgage.monthlyPayment=this.initMortgage.refInd[this.initPos-1].monthlyPayment;
			 		};

			 	};

			 	this.date = this.initMortgage.date;
			 	this.newDate = new Date(this.refMortgage.formatDate(this.refMortgage.dateString));

				 	this.init(this.initMortgage.initRate);
				 	this.refMortgage.capital = this.capital;
				 	this.refMortgage.newRefInd = this.refMortgage.refInd;
				 	if(!duration){
				 		this.refMortgage.duration = this.durationLeft;
				 	}
				 	this.refMortgage.durationLeft = this.refMortgage.duration;

				 	this.validateData(durationFirst);
				 	this.updateStory();
				 	this.initMortgage.totalPaymentIfRef = this.initMortgage.getTotalFromPeriode(this.durationLeft);
				 	this.initMortgage.totalCapitalIfRef = this.initMortgage.getTotalCapitalFromPeriode(this.durationLeft);
				 	this.initMortgage.totalInterestIfRef = this.initMortgage.getTotalInterestFromPeriode(this.durationLeft);
				 	this.refMortgage.totalPaymentInitMortgage = this.initMortgage.totalPaymentIfRef;
				 	if (!this.occupied) {
					 	this.setResultsCase();
				 	};
				 	this.getResultsCase();
			 		
			 	
			},

			updateStory : function(argument) {
			 	if(this.refMortgage.type.localeCompare('fixe')!==0 && this.initMortgage.type.localeCompare('fixe')!==0){
			 		if(this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0){
			 			if(this.initMortgage.story.localeCompare(this.refMortgage.story)!==0){
			 				var len = this.initMortgage.getRefIndLength();

			 				if (this.refMortgage.story.localeCompare('costum')==0) {
			 					if(len>1){
			 						var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
			 						var startPosition = this.findDate(this.initMortgage.refInd[initStart].date.date, this.refMortgage.refInd, 1);
			 						for (var i = 1; i < this.refMortgage.refInd.length; i++) {
			 							this.refMortgage.refInd[i].val = this.initMortgage.refInd[this.initMortgage.refInd.length-1].val;
			 						};
			 					}
			 					this.refMortgage.update();

			 				}else{
			 					if (this.refMortgage.refInd.length>1) {
			 						if (this.initMortgage.refInd.length-len>0) {
			 							var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
			 							var startPosition = this.findDate(this.refMortgage.refInd[1].date.date, this.initMortgage.refInd, initStart);
			 							for (var i = startPosition; i < this.initMortgage.refInd.length; i++) {
			 								this.initMortgage.refInd[i].val = this.refMortgage.refInd[this.refMortgage.refInd.length-1].val;
			 							};
			 						};
			 					};
			 					this.initMortgage.update();
			 				}
			 			}

			 		}
			 	}
			},

			/**
			 * [init description]
			 * @return {[type]} [description]
			 */
			init : function (rate) {
			 	this.releaseCharges =0;
			 	this.MGRegistration =0;
			 	this.durationLeft = this.getDurationLeft(this.date, this.newDate);
			 	this.durationLeft = this.durationLeft < 1 ? 0 : this.durationLeft; 
			 	if (this.durationLeft<=0) {
			 		this.indem = 0;
			 		this.capital = 0;
			 		this.releaseCharges = 0;
				 	this.MGRegistration = 0;
				 	this.FraisDivers =0;
				 	this.fileCharges = 0;
				 	this.SRD =0;
			 	}else{
			 		this.fileCharges = 330;
				 	this.SRD = this.getSRD();
				 	this.indem = this.getIndem(rate);
				 	this.capital = this.indem+this.SRD+this.fileCharges;
				 	if(this.externalRef){
				 		var fraisCredit = DC.FraisCreditFactory.getFraisCredit(1);
				 		this.releaseCharges = DC.FraisMainLevee.getFraisMainLevee(this.SRD);
				 		this.capital+=this.releaseCharges;

				 		var capital = fraisCredit.getMontantBrut(this.capital);
				 		this.MGRegistration = capital - this.capital + this.fraisNotaire;
				 		this.FraisDivers = this.MGRegistration - this.fraisNotaire;
				 		this.capital = capital + this.fraisNotaire;
				 	}else{
				 		this.releaseCharges = 0;
				 		this.MGRegistration = 0;
				 	}
			 		
			 	}
				this.totalFrais = this.fileCharges+this.MGRegistration+this.releaseCharges+this.indem
			},
			minimizeThenUpdate : function  (argument) {
				// body...
			},
			maximizeThenUpdate : function  (argument) {
				// body...
			},
			adjust : function (ref) {
				var len = this.initMortgage.getRefIndLength();
				var start = this.initMortgage.refInd.length-len;
				if(this.refMortgage.type.localeCompare('fixe')!==0 && this.initMortgage.type.localeCompare('fixe')!==0){
					if(this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0){
						if(ref){
							if (start>0) {
								var refpos=1;
								var i = start;
								var ended = false;
								while(i < this.initMortgage.refInd.length && !ended) {
									var found = false;
									while(!found && refpos<this.refMortgage.refInd.length){
										var dater = this.refMortgage.refInd[refpos].date.date.split('/');
										var monthr = dater[1];
										var yearsr = dater[2];

										var date = this.initMortgage.refInd[i].date.date.split('/');
										var month = date[1];
										var years = date[2];
										if(monthr == month && years == yearsr){
											found = true;
											this.initMortgage.refInd[i].val=this.refMortgage.refInd[refpos].val;
										}
										refpos++;
										ended = refpos == this.refMortgage.refInd.length ? true : false;
									};
									if(refpos == this.refMortgage.refInd.length && !found){
										refpos=1;
										ended = false;
									}
									i++;
								}

							};
							
							//...
						}else{
							if (start>0) {
								var initpos=start;
								var i = 1;
								var ended = false;
								while(i < this.refMortgage.refInd.length && !ended) {
									var found = false;
									while(!found && initpos<this.initMortgage.refInd.length){
										var dater = this.refMortgage.refInd[i].date.date.split('/');
										var monthr = dater[1];
										var yearsr = dater[2];

										var date = this.initMortgage.refInd[initpos].date.date.split('/');
										var month = date[1];
										var years = date[2];
										if(monthr == month && years == yearsr){
											found = true;
											this.refMortgage.refInd[i].val=this.initMortgage.refInd[initpos].val;
										}
										initpos++;
										ended = initpos == this.initMortgage.refInd.length ? true : false;
									};
									if(initpos == this.initMortgage.refInd.length && !found){
										initpos=start;
										ended = false;
									}
									i++;
								}

							};

							//...
						}
					}
				}
			},

			limitThenUpdate : function (ref) {
				this.initMortgage.story = 'costum';
				this.refMortgage.story = 'costum';


				var minInd = 0;
				var maxInd = 0;
				var startPosition;

				if(ref){
					if(this.refMortgage.type.localeCompare('fixe')!==0){
						minInd = this.refMortgage.getIndiceMin() ;
						maxInd = this.refMortgage.getIndiceMax();
						if (this.initMortgage.type.localeCompare('fixe')!==0 
							&& this.initMortgage.variation.type.localeCompare(this.refMortgage.variation.type)==0
							) {
							this.reset(ref, true);

							minInd = this.initMortgage.getIndiceMin() < minInd ? this.initMortgage.getIndiceMin() : minInd;
							maxInd = this.initMortgage.getIndiceMax() > maxInd ? this.initMortgage.getIndiceMax() : maxInd;
							var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
							startPosition = this.findDate(this.refMortgage.refInd[1].date.date, this.initMortgage.refInd, initStart);

						}
					}

				}

				if(!ref){
					if(this.initMortgage.type.localeCompare('fixe')!==0){
						if (this.refMortgage.type.localeCompare('fixe')!==0 
							&& this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0
							) {
							minInd = this.initMortgage.getIndiceMin() < minInd ? this.initMortgage.getIndiceMin() : minInd;
							maxInd = this.initMortgage.getIndiceMax() > maxInd ? this.initMortgage.getIndiceMax() : maxInd;
							var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
							startPosition = this.findDate(this.initMortgage.refInd[initStart].date.date, this.refMortgage.refInd, 1);

							this.reset(ref, true);

						}else{
							minInd = this.initMortgage.getIndiceMin() ;
							maxInd = this.initMortgage.getIndiceMax();
						};	
					}
				}


				var toAdd = maxInd - minInd;
				var maxOK = false;
				var minOK = false;
				this.refIndMaxInit = [];
				this.refIndMaxRef = [];
				maxInd = Math.ceil(maxInd*1000)/1000
				minInd = Math.floor(minInd*1000)/1000

				this.setAllToRefVal(startPosition, ref, minInd);
				var minDiff = this.getDifference();
				if (this.getDifference()>0) {
					minOK = true;
				};

				this.setAllToRefVal(startPosition, ref, maxInd);
				var maxDiff = this.getDifference();
				if (this.getDifference()>0) {
					maxOK = true;
				};

				if(maxOK && !minOK){
					this.setAllToRefVal(startPosition, ref, minInd);
					this.findLimitAsc( startPosition, ref,  minInd, toAdd, 15);
				}else{
					if(!maxOK && minOK){
						this.setAllToRefVal(startPosition, ref, maxInd);
						toAdd = 0 - toAdd;
						this.findLimitAsc( startPosition, ref, maxInd, toAdd, 15);
					}else{
								//this.setAllToRefVal(startPosition, ref, maxInd);
								if (maxOK && minOK) {
									this.findLimitExtremums(startPosition, ref, minInd, maxInd);
									if (this.refIndMax.length==0) {
										if(minDiff<maxDiff){
											this.setAllToRefVal(startPosition, ref, minInd);
										}else{
											this.setAllToRefVal(startPosition, ref, maxInd);
										}
									};
								}else{
									if(minDiff>maxDiff){
										this.setAllToRefVal(startPosition, ref, minInd);
									}else{
										this.setAllToRefVal(startPosition, ref, maxInd);
									}
								}
							}
							
						}




			},

			findLimitAsc : function (startPosition, ref, start, toAdd,  hit) {

				toAdd = toAdd>0 ? Math.ceil(toAdd*1000)/1000 : Math.floor(toAdd*1000)/1000;
				start = this.round(start);


				this.setAllToRefVal(startPosition, ref, start+toAdd);

				if(hit>0 && (this.getDifference()>10 || this.getDifference()<0)){
					hit-=1;
					if (this.getDifference()>0 ) {
						this.findLimitAsc( startPosition, ref, start, toAdd/2, hit);
					}else{
						this.findLimitAsc( startPosition, ref,  start+toAdd, toAdd/2,  hit);
					};
				}else{
					this.setLimitVal(ref, start+toAdd);
					
				}


			},

			setLimitVal: function  (ref, ind) {
				var val;
				if (this.getDifference()<20) {
					if (this.initMortgage.type.localeCompare('fixe')!==0  && this.initMortgage.type.localeCompare('fixe')!==0 ) {
						if (this.initMortgage.variation.type.localeCompare(this.refMortgage.variation.type)) {
							this.refIndMaxRef[0]=(this.refMortgage.refTab[this.refMortgage.refTab.length-1][this.refMortgage.variation.type]);
							this.refIndMaxInit[0]=(this.initMortgage.refTab[this.initMortgage.refTab.length-1][this.initMortgage.variation.type]);
							this.refIndMaxInit.push(Math.floor(ind*1000)/1000);
							this.refIndMaxRef.push(Math.floor(ind*1000)/1000);
							
						}else{
							if(ref){
								this.refIndMaxRef[0]=(this.refMortgage.refTab[this.refMortgage.refTab.length-1][this.refMortgage.variation.type]);
								this.refIndMaxRef.push(Math.floor(ind*1000)/1000);
							}else{
								this.refIndMaxInit[0]=(this.initMortgage.refTab[this.initMortgage.refTab.length-1][this.initMortgage.variation.type]);
								this.refIndMaxInit.push(Math.floor(ind*1000)/1000);
							}
						};
					}else{
						if(ref){
							this.refIndMaxRef[0]=(this.refMortgage.refTab[this.refMortgage.refTab.length-1][this.refMortgage.variation.type]);
							this.refIndMaxRef.push(Math.floor(ind*1000)/1000);
						}else{
							this.refIndMaxInit[0]=(this.initMortgage.refTab[this.initMortgage.refTab.length-1][this.initMortgage.variation.type]);
							this.refIndMaxInit.push(Math.floor(ind*1000)/1000);
						}
					};

					//this.refIndMax.push(Math.floor(ind*1000)/1000);

				};
				
					
					
				
			},

			findLimitExtremums :  function (startPosition, ref, floor, ceil) {
				
				var maxl = 0;
				var minl = 0;
				var maxr = 0;
				var minr = 0;
				var foundl = false;
				var foundr = false;
				var i = floor+1; 
				var j=ceil-1;
				
				while(i<ceil && !foundl){
					this.setAllToRefVal(startPosition, ref, i);
					if (this.getDifference()<0){
						foundl= true;
						minl = i-1;
						maxl = i;
					}
					i++;
				}

				while(j>floor && !foundr){
					this.setAllToRefVal(startPosition, ref, j);
					if (this.getDifference()<0){
						foundr = true;
						minr = j;
						maxr = j+1;
					}
					j--;
				}


				if(foundl){
					var toAdd = minl-maxl;
					this.findLimitAsc( startPosition, ref, maxl, toAdd, 15);

				}

				if(foundr){
					var toAdd = maxr-minr;
					this.findLimitAsc( startPosition, ref, minr, toAdd, 15);
				}


			},

			setAllToRefVal : function  (start, ref, val) {
				if (ref) {
					for (var i = 1; i < this.refMortgage.refInd.length; i++) {
						this.refMortgage.refInd[i].val = val;
					};

					if (this.initMortgage.type.localeCompare('fixe')!==0 
						&& this.initMortgage.variation.type.localeCompare(this.refMortgage.variation.type)==0) {
						if (start>0 && this.initMortgage.refInd.length>start) {
							for (var i = start; i < this.initMortgage.refInd.length; i++) {
								this.initMortgage.refInd[i].val = val;
							};
						}
					};
				};


				if(!ref){
					var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
					for (var i = initStart; i < this.initMortgage.refInd.length; i++) {
						this.initMortgage.refInd[i].val = val;
					};
					if (this.refMortgage.type.localeCompare('fixe')!==0 
						&& this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0) {
						if (start>0 && this.refMortgage.refInd.length>start) {
							for (var i = start; i < this.refMortgage.refInd.length; i++) {
								this.refMortgage.refInd[i].val = val;
							};
						};
					};

				}
				
				this.update(false, true, true);
			},

			reset : function (ref, all) {

				var startPosition = 1;
				if (!all) {
					if (ref) {
						if (this.initMortgage.type.localeCompare('fixe')!==0 
							&& this.initMortgage.variation.type.localeCompare(this.refMortgage.variation.type)==0) {
							var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
							startPosition = this.findDate(this.refMortgage.refInd[1].date.date, this.initMortgage.refInd, initStart);
						}
						this.setAllToRefVal(startPosition, ref, this.refMortgage.refTab[this.refMortgage.refTab.length-1][this.refMortgage.variation.type]);

					};


					if(!ref){
						if (this.refMortgage.type.localeCompare('fixe')!==0 
							&& this.refMortgage.variation.type.localeCompare(this.initMortgage.variation.type)==0) {
							var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
							startPosition = this.findDate(this.initMortgage.refInd[initStart].date.date, this.refMortgage.refInd, 1);

						};
						this.setAllToRefVal(startPosition, ref, this.initMortgage.refTab[this.initMortgage.refTab.length-1][this.initMortgage.variation.type]);


					}
				}else{
					if (this.initMortgage.type.localeCompare('fixe')!==0){
						var initStart = this.initMortgage.refInd.length - this.initMortgage.getRefIndLength();
						if (initStart>0) {
							for (var i = initStart; i < this.initMortgage.refInd.length; i++) {
								this.initMortgage.refInd[i].val = this.initMortgage.refTab[this.initMortgage.refTab.length-1][this.initMortgage.variation.type];
							};
						};
					}

					if (this.refMortgage.type.localeCompare('fixe')!==0 ){
						for (var i = 1; i < this.refMortgage.refInd.length; i++) {
							this.refMortgage.refInd[i].val = this.refMortgage.refTab[this.refMortgage.refTab.length-1][this.refMortgage.variation.type];
						};
					}
				};
				



				this.update(false, true, true);
			},

			findDate : function (date, dateList, start) {
				var found = false;
				var i = start;
				var position = start;
				var dater = date.split('/');
				var monthr = dater[1];
				var yearsr = dater[2];

				while(!found && i<dateList.length){
					var daten = dateList[i].date.date.split('/');

					var month = daten[1];
					var years = daten[2];
					if( years == yearsr){
						if(month >= monthr){
							found = true;
							position = i;
						}
					}else{
						if (years > yearsr) {
							found = true;
							position = i;
						};
					}
					i++;
				}
				return position;
			},

			Limite : function (argument) {

			},
			round : function (val) {
				return Math.round(val*1000)/1000;
			},

			getDifference : function  (argument) {
				return this.initMortgage.totalPaymentIfRef-this.refMortgage.totalPayment;
			},

			/**
			 * [validateData description]
			 * @param  {[type]} durationFirst [description]
			 * @return {[type]}               [description]
			 */
			validateData : function (durationFirst) {
			 	if(this.refMortgage.sameMonthlyPayement){
			 		this.refMortgage.monthlyPayment = this.initMortgage.monthlyPayment;
			 		this.refMortgage.setDuration();
			 	}
			 	this.checkDuration();
			 	if (!this.freeRate) {
			 		this.changeRate(durationFirst);
			 	};
				this.refMortgage.sameMonthlyPayement = false;
				this.refMortgage.update();

					// se dplacer dans la ligne du tableau en fonction des donnee.
					// une fois deplacer, verifier chaque donnée, si une est different, on lui donne la valeur par defaut de cette ligne
					// ne pas changer de colone
			},

			changeRate : function (durationFirst) {
			 	var found = false;
			 	var linePosition;
			 	var savedDuration = this.refMortgage.duration;

				if (this.refMortgage.type.localeCompare('fixe')===0) {
			 		this.refMortgage.refInd = this.refMortgage.refInd.slice(0,1);
			 		var i =0;
			 		while(!found && i<5) {
			 			if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
			 				found = true;
			 				linePosition = i;
			 			}
			 			i++;
			 		}
			 	}else{
			 		var tmpLine = -1;
			 		var i =5;
			 		if(durationFirst){
			 			while(!found && i<11) {
			 				if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
			 					tmpLine = i;
			 					var split = this.refMortgage.type.split(' ');
			 					var min = (parseInt(split[3].substring(0,2))*12);
			 					var max = (parseInt(split[5].substring(0,2))*12)+11;
			 					min = min == 300 ? 301 : min;
			 					max = max == 371 ? 360 : max;

			 					if(split[0].localeCompare(this.rateTable[i].type)==0 && min==this.rateTable[i].duration_min && max==this.rateTable[i].duration_max ){
			 						linePosition = i;
			 						found = true;
			 					}else{
			 						linePosition = tmpLine;
			 					}
			 				}

			 				i++;
			 			};
			 			if(!found){
			 				this.refMortgage.type = this.rateTable[linePosition].type+" (+"+this.rateTable[linePosition].cap_pos+'/-'+this.rateTable[linePosition].cap_neg+') de '+Math.floor(this.rateTable[linePosition].duration_min/12)+'ans à '+Math.floor(this.rateTable[linePosition].duration_max/12)+'ans';
			 				this.refMortgage.refInd = this.refMortgage.refInd.slice(0,1);
			 				this.refMortgage.setCap();
			 			}
			 		}else{
			 			this.refMortgage.setCap();
			 			this.refMortgage.refInd = this.refMortgage.refInd.slice(0,1);
			 			var split = this.refMortgage.type.split(' ');
			 			var min = (parseInt(split[3].substring(0,2))*12);
			 			var max = (parseInt(split[5].substring(0,2))*12)+11;
			 			min = min == 300 ? 301 : min;
			 			var tmpline = -1;
			 			while(!found && i<11) {

			 				if(split[0].localeCompare(this.rateTable[i].type)===0 ){
			 					tmpline = i;
			 					if (min==this.rateTable[i].duration_min && max==this.rateTable[i].duration_max) {
			 						tmpline = i;
			 						if(this.refMortgage.duration>=this.rateTable[i].duration_min && this.refMortgage.duration<=this.rateTable[i].duration_max  ){
			 							linePosition = i;
			 							found = true;
			 						}else{
			 							linePosition = tmpline;
			 						}
			 					};

			 				}
			 				linePosition = tmpline;
			 				i++;
			 			}

			 			if(!found){
			 				this.refMortgage.sameMonthlyPayement = false;
			 				this.refMortgage.duration=this.rateTable[linePosition].duration_min;

			 			}

			 			this.checkDuration();


			 		}
			 	}
			 	
			 	this.refMortgage.rateTable = [];
				this.refMortgage.rateTable[0] = this.rateTable[linePosition].rate;
				this.refMortgage.rateTable = this.refMortgage.rateTable.concat(
				this.rateTable[linePosition].quotLess.One,
				this.rateTable[linePosition].quotLess.Two,
				this.rateTable[linePosition].quotLess.Three,
				this.rateTable[linePosition].quotPlus.One,
				this.rateTable[linePosition].quotPlus.Two,
				this.rateTable[linePosition].quotPlus.Three
				);
			 
				var qt = this.refMortgage.quote.localeCompare('<=85%') ===0 ? this.rateTable[linePosition].quotLess : this.rateTable[linePosition].quotPlus;
				var hs = qt[this.refMortgage.homeSafe];
				var rate;

				if (this.refMortgage.vip.localeCompare('NON VIP') === 0) {
				 	rate = hs[0];
				}else{
				 	if (this.refMortgage.vip.localeCompare('VIP') === 0) {
					 	rate = hs[1];
					}else{
					 	rate = hs[2];
					};
				};
				this.refMortgage.initRate = rate;
			},

			checkDuration : function  (argument) {
				if(this.refMortgage.duration<72 ){
					this.refMortgage.duration=72;
				}else{
					if(this.refMortgage.duration>360 ){
						this.refMortgage.duration=360;
					}
				}
				this.refMortgage.durationLeft = this.refMortgage.duration;
			},

			/**
			 * [getDurationLeft description]
			 * @param  {[type]} date    [description]
			 * @param  {[type]} newDate [description]
			 * @return {[type]}         [description]
			 */
			 getDurationLeft : function (date, newDate) {
			 	var month = (newDate.getFullYear() - date.getFullYear())*12;
			 	month-= (date.getMonth() - newDate.getMonth());
			 	if (newDate.getDate()<date.getDate()) {
			 		month-=1;
			 	};
			 	return this.initMortgage.duration-month;
			 },

			/**
			 * [getSRD description]
			 * @return {[type]} [description]
			 */
			 getSRD : function(){
			 	var period = this.initMortgage.duration - this.durationLeft-1;
			 	//return 20000
			 	//
			 	return this.initMortgage.amortization[period].SRD;
			 },

			/**
			 * [getIndem description]
			 * @param  {[type]} rate [description]
			 * @return {[type]}      [description]
			 */
			 getIndem : function (rate){
			 	rate = Math.round((Math.pow(1 + (rate/100), 1 / 12) - 1)*1000000)/1000000;
			 	return this.SRD*rate*3;
			 },
			/**
			 * [getNewCapital description]
			 * @return {[type]} [description]
			 */
			 getNewCapital : function(){
			 	return this.indem+this.SRD+this.fileCharges;
			 },

			/**
			 * [generateTypeTable description]
			 * @param  {[type]} rateTable [description]
			 * @return {[type]}           [description]
			 */
			 generateTypeTable : function (rateTable) {
				// body...
				this.refMortgage.typeTable = ['fixe'];
				var j = 1;
				for (var i = 5; i < rateTable.length; i++) {
					this.refMortgage.typeTable[j] = rateTable[i].type+" (+"+rateTable[i].cap_pos+'/-'+rateTable[i].cap_neg+') de '+Math.floor(rateTable[i].duration_min/12)+'ans à '+Math.floor(rateTable[i].duration_max/12)+'ans';
					j++;
				};
			},

			/**
			 * [generateRateTable description]
			 * @param  {[type]} rateTable [description]
			 * @return {[type]}           [description]
			 */
			generateRateTable : function (rateTable) {
			 	var quot = {};
			 	this.rateTable = [];
			 	this.freeRateTable = [];
			 	for (var i = 0; i < rateTable.length; i++) {
			 		this.rateTable[i]= {};
			 		this.rateTable[i].id = parseInt(rateTable[i].id);
			 		this.rateTable[i].cap_neg = parseInt(rateTable[i].cap_neg);
			 		this.rateTable[i].cap_pos = parseInt(rateTable[i].cap_pos);
			 		this.rateTable[i].duration_max = parseInt(rateTable[i].duration_max);
			 		this.rateTable[i].duration_min = parseInt(rateTable[i].duration_min);
			 		this.rateTable[i].type = (rateTable[i].type);
			 		var rate = parseFloat(rateTable[i].rate);
			 		rateTable[i].rate = Math.round(rate*100);
			 		this.rateTable[i].rate = (rateTable[i].rate)/100;
			 		this.rateTable[i].quotPlus = {};		
			 		this.rateTable[i].quotLess = {};
			 		this.rateTable[i].quotLess.One = 	[(rateTable[i].rate - (95 ))/100,(rateTable[i].rate - (145 ))/100,(rateTable[i].rate - (165 ))/100];	
			 		this.rateTable[i].quotLess.Two = 	[(rateTable[i].rate - (125 ))/100,(rateTable[i].rate - (175 ))/100,(rateTable[i].rate - (195 ))/100];
			 		this.rateTable[i].quotLess.Three = 	[(rateTable[i].rate - (150 ))/100,(rateTable[i].rate - (200 ))/100,(rateTable[i].rate - (220 ))/100];
			 		this.rateTable[i].quotPlus.One = 	[(rateTable[i].rate - (60 ))/100,(rateTable[i].rate - (110 ))/100,(rateTable[i].rate - (130 ))/100];	
			 		this.rateTable[i].quotPlus.Two = 	[(rateTable[i].rate - (100 ))/100,(rateTable[i].rate - (150 ))/100,(rateTable[i].rate - (170 ))/100];
			 		this.rateTable[i].quotPlus.Three = 	[(rateTable[i].rate - (125 ))/100,(rateTable[i].rate - (175 ))/100,(rateTable[i].rate - (195 ))/100];
			 		this.freeRateTable.push(this.rateTable[i].quotLess.One[0]);
			 		this.freeRateTable.push(this.rateTable[i].quotPlus.One[0]);

			 	};
			},
			getResultsCase : function  (argument) {
			 	this.case=0;
			 	var wait = false;
			 	if ((this.initMortgage.type.localeCompare('fixe')===0 && this.refMortgage.type.localeCompare('fixe')===0) || 
			 		(this.initMortgage.type.localeCompare('fixe')===0 && this.refMortgage.type.localeCompare('fixe')!==0)) {
			 		this.case = this.checkBestCase();

			 	}else{
			 		if (this.initMortgage.type.localeCompare('fixe')!==0 && this.refMortgage.type.localeCompare('fixe')!==0) {
			 			wait = this.variableWait();
			 			if(wait !==false){
			 				this.case = wait;
			 			}else{
			 				this.case = this.checkBestCase();
			 			}


			 		}else{
			 			
		 				wait = this.variableWait();
		 				if(wait !==false){
		 					this.case = wait;
		 				}else{
		 					this.case = this.checkBestCase();
		 				}


			 			
			 		};
			 	};

			},

			checkBestCase : function (argument) {
			 	var cat;
			 	if (this.refMortgage.monthlyPayment > this.initMortgage.monthlyPayment && this.refMortgage.initRate>this.initResults.rate) { 
		 			cat = 1;
		 		}else{
		 			if (this.refMortgage.monthlyPayment > this.initMortgage.monthlyPayment && this.refMortgage.initRate<this.initResults.rate) {
		 				cat = 2;
		 			}else{
		 				if (this.externalRef){
		 					cat=6;
		 				}else{
		 					cat = 5;
		 				}
		 			};
		 		};
	 			if (this.initMortgage.type.localeCompare('fixe')===0 && this.refMortgage.type.localeCompare('fixe')===0 && this.getDifference()<0) {
	 				if (this.refMortgage.initRate>this.initResults.rate) {
	 					cat = 1;
	 				}else{
	 					cat = 2;
	 				};
	 			};
		 		return cat;

			},

			setResultsCase : function (argument) {
			 	this.occupied=true;
			 	this.initResults = {};
			 	this.initResults = JSON.parse(JSON.stringify(this.initMortgage.refInd[0]));
			 	this.refResults = {};
			 	this.refResults = JSON.parse(JSON.stringify(this.refMortgage.refInd[0]));
			 	this.refResults.durationSameMP = 0;


			 	if (this.initMortgage.type.localeCompare('fixe')!==0 && this.refMortgage.type.localeCompare('fixe')!==0) {
			 		var savedRefsI = this.cloneTabObj(this.initMortgage.refInd);
			 		var savedRefsR = this.cloneTabObj(this.refMortgage.refInd);
			 		this.initMortgage.story = 'costum';
			 		this.refMortgage.story = 'costum';
			 		this.reset(false, true);
			 		this.setBestRate();
				 	this.initResults =this.initMortgage.refInd.length>1 ? JSON.parse(JSON.stringify(this.initMortgage.refInd[this.initPos])) : this.initResults;
				 	if(this.refMortgage.refInd.length>1){
		 				this.refResults =JSON.parse(JSON.stringify(this.refMortgage.refInd[1]));
		 				this.refResults.durationSameMP = this.getMaxDuration(this.refResults.rate, this.refMortgage.refInd[0].monthlyPayment); 
					 			
					}
			 		this.resetRef(savedRefsR);
			 		this.resetInit(savedRefsI);
			 		this.update(false, true, true);

			 	}else{
			 		if (this.initMortgage.type.localeCompare('fixe')!==0 && this.refMortgage.type.localeCompare('fixe')==0) {
			 			var savedRefsI = this.cloneTabObj(this.initMortgage.refInd);
			 			this.initMortgage.story = 'costum';
				 		this.reset(false, false);
				 		this.setBestRate();
				 		this.initResults =this.initMortgage.refInd.length>1 ? JSON.parse(JSON.stringify(this.initMortgage.refInd[this.initPos])) : this.initResults;
			 			this.resetInit(savedRefsI);
				 		this.update(false, true, true);
			 		}else{
			 			if (this.initMortgage.type.localeCompare('fixe')==0 && this.refMortgage.type.localeCompare('fixe')!==0){

					 		var savedRefsR = this.cloneTabObj(this.refMortgage.refInd);
			 				this.refMortgage.story = 'costum';
					 		this.reset(true, false);
					 		this.setBestRate();
					 		if(this.refMortgage.refInd.length>1){
				 				this.refResults =JSON.parse(JSON.stringify(this.refMortgage.refInd[1]));
				 				this.refResults.durationSameMP = this.getMaxDuration(this.refResults.rate, this.refMortgage.refInd[0].monthlyPayment)+this.refMortgage.variation.fixe; 
					 		}
				 			this.resetRef(savedRefsR);
					 		
					 		this.update(false, true, true);
			 			}else{
			 				this.setBestRate();
			 			}
			 		};
			 	};

			 	this.occupied=false;

			},

			getMaxDuration : function  (rate, mp) {
			 	var capital = this.refMortgage.amortization[this.refMortgage.variation.fixe].SRD;
			 	return Math.ceil(DC.CreditUtil.calculDuree(DC.CreditUtil.tauxAnToPeriodique(rate/100,1), mp/capital));
			},

			cloneTabObj : function (arr) {
			 	var cop = [];
			 	for (var i = 0; i < arr.length; i++) {
			 		cop[i] = arr[i].val;
			 	};
			 	return cop;
			},
			resetInit : function (vals) {
			 	for (var i = 0; i < this.initMortgage.refInd.length; i++) {
			 		this.initMortgage.refInd[i].val = vals[i];
			 	};
			},
			resetRef : function (vals) {
			 	for (var i = 0; i < this.refMortgage.refInd.length; i++) {
			 		this.refMortgage.refInd[i].val = vals[i];
			 	};
			},

			 
			setBestRate : function (argument) {
			 	this.bestRate=[];
			 	var rateTab = this.freeRate ? this.freeRateTable : this.refMortgage.rateTable;
			 	var saveRate = this.refMortgage.initRate;
			 	var saveAddRate = this.refMortgage.addRate;
			 	for (var i = 0; i < rateTab.length; i++) {
			 		this.refMortgage.initRate = rateTab[i];
			 		this.refMortgage.addRate = saveAddRate;
			 		this.refMortgage.update();
			 		if (this.initMortgage.type.localeCompare('fixe')!==0 && this.refMortgage.type.localeCompare('fixe')!==0
			 			|| (this.initMortgage.type.localeCompare('fixe')!==0 && this.refMortgage.type.localeCompare('fixe')==0)){
			 			var wait = this.variableWait();
			 			if (wait ==false) {
			 				if (this.refMortgage.initRate<this.initMortgage.initRate && this.refMortgage.monthlyPayment < this.initMortgage.monthlyPayment && this.getDifference()>0) {
					 			this.bestRate.push(rateTab[i]);
					 		}
			 			};
			 		}else{
		 				if (this.refMortgage.initRate<this.initMortgage.initRate && this.refMortgage.monthlyPayment < this.initMortgage.monthlyPayment && this.getDifference()>0)  {
				 			this.bestRate.push(rateTab[i]);
				 		}
			 		}

			 	};
			 	if (this.bestRate.length>0) {
			 		this.bestRateVal = this.bestRate[0];
			 	};
			 	this.refMortgage.initRate = saveRate;
			 	this.refMortgage.addRate = saveAddRate;
			 	this.refMortgage.update();
			},

			variableWait : function (argument) {
			 	var refYears = this.refMortgage.date.getFullYear();
			 	var initDate = 0;
			 	var refDate = 0;
			 	var ok= false;

			 	if (this.refMortgage.type.localeCompare('fixe')!==0) {
			 		var rdate = mm(this.refMortgage.date).format('DD/MM/YYYY');
			 		var tmp = rdate.split('/');
			 		refDate = parseInt(tmp[2]);
			 	}

			 	if (this.initMortgage.type.localeCompare('fixe')!==0) {
			 		var i=1;
			 		var found = false;
			 		if (this.initMortgage.refInd.length>1) {
		 				var tmp = this.initResults.date.date.split('/');
		 				var y = parseInt(tmp[2]);
		 				initDate = y;
			 		};
			 	}


			 	if(refDate == 0 && initDate !==0){
			 		if (initDate - refYears < 3 ) {
			 			if (this.initResults.rate < this.refMortgage.initRate && this.initMortgage.refInd[this.initPos-1].rate > this.refMortgage.initRate){
			 				ok = true;
			 			};
			 		}

			 	}else{
			 		if(refDate !== 0 && initDate !==0){
			 			if (initDate > refDate  &&  initDate - refYears < 3 ) {
			 				if (this.initResults.rate < this.refMortgage.initRate){
			 					ok = true;
			 				};
			 			}

			 		}
			 	}
			 	if (ok) {
			 		
			 		//if(this.checkEtremums())
			 		var cas;
			 		if (this.refMortgage.monthlyPayment < this.initMortgage.monthlyPayment && this.refMortgage.type.localeCompare('fixe')!==0) {
			 			cas = 4;
			 		}else {
			 			cas = 3;
			 		} ;
			 		return cas;
			 	}else{
			 		return ok;
			 	} ;
			 	
			}









			};

			return Refinancing;

		});
});
