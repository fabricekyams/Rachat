/*! DocteurCreditJS.js 1.0.0.0
 * 
 */

"use strict";

define('DocteurCreditJS', ['ss'], function (ss) {
  var $global = this;

  // PHCalculCredit.eTypeRemboursement

  var PHCalculCredit$eTypeRemboursement = {
    mensCst: 0, 
    amortCst: 1, 
    termeFixe: 2, 
    AVL: 3, 
    easyStart: 4, 
    mensIndexe: 5, 
    MVL: 6
  };


  // PHCalculCredit.IndexPeriodeMois

  var PHCalculCredit$IndexPeriodeMois = {
    annuel: 0, 
    semestriel: 1, 
    trimestriel: 2, 
    mensuel: 3
  };


  // PHCalculCredit.IFraisCredit

  function PHCalculCredit$IFraisCredit() { }


  // PHCalculCredit.Data.DroitsHypo1

  function PHCalculCredit$Data$DroitsHypo1() {
  }
  PHCalculCredit$Data$DroitsHypo1._create = function() {
    var points = new Array(20 + 1);
    var indexation = 136.72 / 101.56;
    for (var i = 0; i <= 20; i++) {
      points[i] = new PHCalculCredit$Data$Point(25000 * i, 1E-08, (50 + i * 17.5) * indexation);
    }
    points[20]._m = 17.5 * indexation / 25000;
    return new PHCalculCredit$Data$LigneParMorceau(points);
  };
  PHCalculCredit$Data$DroitsHypo1.get__current = function() {
    if (PHCalculCredit$Data$DroitsHypo1._current == null) {
      PHCalculCredit$Data$DroitsHypo1._current = PHCalculCredit$Data$DroitsHypo1._create();
    }
    return PHCalculCredit$Data$DroitsHypo1._current;
  };
  var PHCalculCredit$Data$DroitsHypo1$ = {

  };


  // PHCalculCredit.Data.Droits_Hypo

  function PHCalculCredit$Data$Droits_Hypo() {
  }


  // PHCalculCredit.Data.Honor_Achat

  function PHCalculCredit$Data$Honor_Achat() {
  }


  // PHCalculCredit.Data.Honor_Credit

  function PHCalculCredit$Data$Honor_Credit() {
  }
  var PHCalculCredit$Data$Honor_Credit$ = {

  };


  // PHCalculCredit.Data.Point

  function PHCalculCredit$Data$Point(x, m, y) {
    this._x = 0;
    this._m = 0;
    this._y = 0;
    this._x = x;
    this._m = m;
    this._y = y;
  }
  var PHCalculCredit$Data$Point$ = {
    _calcul: function(valueX) {
      return this._y + valueX * this._m;
    }
  };


  // PHCalculCredit.Data.LigneParMorceau

  function PHCalculCredit$Data$LigneParMorceau(points) {
    this._points = points;
  }
  PHCalculCredit$Data$LigneParMorceau.compare = function(v1, v2) {
    return MyExt$MathExt._sign((v1)._x - v2);
  };
  PHCalculCredit$Data$LigneParMorceau._mul = function(a, coef) {
    var b = new Array(a._points.length);
    for (var i = 0; i < a._points.length; i++) {
      var d = a._points[i];
      b[i] = new PHCalculCredit$Data$Point(d._x, d._m * coef, d._y * coef);
    }
    return new PHCalculCredit$Data$LigneParMorceau(b);
  };
  PHCalculCredit$Data$LigneParMorceau._addOffset = function(a, offset) {
    var b = new Array(a._points.length);
    for (var i = 0; i < a._points.length; i++) {
      var d = a._points[i];
      b[i] = new PHCalculCredit$Data$Point(d._x, d._m, d._y + offset);
    }
    return new PHCalculCredit$Data$LigneParMorceau(b);
  };
  PHCalculCredit$Data$LigneParMorceau._add = function(a, b) {
    var list = new MyExt$BaseList();
    for (var i = 0; i < a._points.length; i++) {
      list.add(a._points[i]._x);
    }
    for (var i = 0; i < b._points.length; i++) {
      var x = b._points[i]._x;
      var index = MyExt$ArrayExt._binarySearch(list._list, x, null);
      if (index < 0) {
        index = ~index;
        if (index === list.get_count()) {
          list.add(x);
        }
        else {
          list.insert(index, x);
        }
      }
    }
    var points = new Array(list.get_count());
    for (var i = 0; i < points.length; i++) {
      var newx = list.get_item(i);
      var point1 = a._getPoint(newx);
      var point2 = b._getPoint(newx);
      points[i] = new PHCalculCredit$Data$Point(newx, point1._m + point2._m, point1._calcul(newx) + point2._calcul(newx) - (point1._m + point2._m) * newx);
    }
    return new PHCalculCredit$Data$LigneParMorceau(points);
  };
  var PHCalculCredit$Data$LigneParMorceau$ = {
    _getPoint: function(x) {
      var index = MyExt$ArrayExt._binarySearch(this._points, x, PHCalculCredit$Data$LigneParMorceau.compare);
      if (index < 0) {
        index = ~index;
        if (index === this._points.length) {
          return this._points[this._points.length - 1];
        }
        else if (!index) {
          return this._points[0];
        }
        else {
          return this._points[index - 1];
        }
      }
      else {
        return this._points[index];
      }
    },
    _getY: function(x) {
      var point = this._getPoint(x);
      if (point == null) {
        return 0;
      }
      else {
        return point._calcul(x);
      }
    },
    _inverse: function() {
      var newPoints = new Array(this._points.length);
      var sign = MyExt$MathExt._sign(this._points[0]._m);
      for (var i = 0; i < this._points.length; i++) {
        var point = this._points[i];
        newPoints[i] = new PHCalculCredit$Data$Point(point._calcul(point._x), 1 / point._m, -point._y / point._m);
      }
      return new PHCalculCredit$Data$LigneParMorceau(newPoints);
    }
  };


  // PHCalculCredit.FraisCreditFactory

  function PHCalculCredit$FraisCreditFactory() {
  }
  PHCalculCredit$FraisCreditFactory.getFraisCredit = function(version) {
    if (!version) {
      return PHCalculCredit$FraisCredit0.get__current0();
    }
    else {
      return PHCalculCredit$FraisCredit1.get__current1();
    }
  };


  // PHCalculCredit.FraisCredit0

  function PHCalculCredit$FraisCredit0() {
  }
  PHCalculCredit$FraisCredit0.get__current0 = function() {
    if (PHCalculCredit$FraisCredit0._current0 == null) {
      PHCalculCredit$FraisCredit0._current0 = new PHCalculCredit$FraisCredit0();
    }
    return PHCalculCredit$FraisCredit0._current0;
  };
  var PHCalculCredit$FraisCredit0$ = {
    getFraisMandat: function(montant) {
      if (montant < 1) {
        return 0;
      }
      else {
        return PHCalculCredit$FraisMandatUtil.get__current()._frais._getY(montant);
      }
    },
    getFraisOuvertureCredit: function(montant) {
      if (montant < 1) {
        return 0;
      }
      else {
        return PHCalculCredit$FraisOuvertureCreditData.get__current()._frais._getY(montant * 1.1);
      }
    },
    getMontantNet: function(montantBrut) {
      return montantBrut - this.getFraisOuvertureCredit(montantBrut);
    },
    getMontantBrut: function(montantNet) {
      if (montantNet <= 1E-08) {
        return montantNet;
      }
      else {
        return PHCalculCredit$FraisOuvertureCreditData.get__current()._funcNetToBrut._getY(montantNet);
      }
    },
    getFraisAchat: function(montant) {
      if (montant < 1) {
        return 0;
      }
      else {
        return PHCalculCredit$FraisAchatData._frais._getY(montant);
      }
    }
  };


  // PHCalculCredit.FraisCredit1

  function PHCalculCredit$FraisCredit1() {
  }
  PHCalculCredit$FraisCredit1.get__current1 = function() {
    if (PHCalculCredit$FraisCredit1._current1 == null) {
      PHCalculCredit$FraisCredit1._current1 = new PHCalculCredit$FraisCredit1();
    }
    return PHCalculCredit$FraisCredit1._current1;
  };
  var PHCalculCredit$FraisCredit1$ = {
    getFraisMandat: function(montant) {
      if (montant < 1) {
        return 0;
      }
      else {
        return PHCalculCredit$FraisMandatUtil.get__current()._frais._getY(montant);
      }
    },
    getMontantNet: function(montantBrut) {
      return montantBrut - this.getFraisOuvertureCredit(montantBrut);
    },
    getFraisOuvertureCredit: function(montant) {
      if (montant < 1) {
        return 0;
      }
      else {
        return PHCalculCredit$FraisOuvertureCreditData1.get__current()._frais._getY(montant);
      }
    },
    getMontantBrut: function(montantNet) {
      if (montantNet <= 1E-08) {
        return montantNet;
      }
      else {
        return PHCalculCredit$FraisOuvertureCreditData1.get__current()._funcNetToBrut._getY(montantNet);
      }
    },
    getFraisAchat: function(montant) {
      if (montant < 1) {
        return 0;
      }
      else {
        return PHCalculCredit$FraisAchatData._frais1._getY(montant);
      }
    }
  };


  // PHCalculCredit.FraisGlobal

  function PHCalculCredit$FraisGlobal() {
  }


  // PHCalculCredit.FraisOuvertureCreditData

  function PHCalculCredit$FraisOuvertureCreditData() {
    this._frais = PHCalculCredit$Data$LigneParMorceau._addOffset(PHCalculCredit$Data$LigneParMorceau._add(PHCalculCredit$Data$Droits_Hypo._current, PHCalculCredit$Data$LigneParMorceau._mul(PHCalculCredit$Data$Honor_Credit._current, 1 + 0.21)), PHCalculCredit$FraisGlobal._fraisDivers);
    var points;
    points = new Array(this._frais._points.length);
    for (var i = 0; i < this._frais._points.length; i++) {
      var p = this._frais._points[i];
      var newx = p._x / 1.1;
      points[i] = new PHCalculCredit$Data$Point(newx, 1 - p._m * 1.1, -p._y);
    }
    this._funcBrutToNet = new PHCalculCredit$Data$LigneParMorceau(points);
    this._funcNetToBrut = this._funcBrutToNet._inverse();
  }
  PHCalculCredit$FraisOuvertureCreditData.get__current = function() {
    if (PHCalculCredit$FraisOuvertureCreditData._Current == null) {
      PHCalculCredit$FraisOuvertureCreditData._Current = new PHCalculCredit$FraisOuvertureCreditData();
    }
    return PHCalculCredit$FraisOuvertureCreditData._Current;
  };
  var PHCalculCredit$FraisOuvertureCreditData$ = {

  };


  // PHCalculCredit.FraisOuvertureCreditData1

  function PHCalculCredit$FraisOuvertureCreditData1() {
    this._fraisSansDroit = PHCalculCredit$Data$LigneParMorceau._addOffset(PHCalculCredit$Data$LigneParMorceau._add(PHCalculCredit$Data$DroitsHypo1.get__current(), PHCalculCredit$Data$LigneParMorceau._mul(PHCalculCredit$Data$Honor_Credit._current, 1 + 0.21)), PHCalculCredit$FraisGlobal._fraisDivers1);
    var droitPourcent = new PHCalculCredit$Data$LigneParMorceau([ new PHCalculCredit$Data$Point(0, 0.013 * (1 + 0.1), 0) ]);
    this._frais = PHCalculCredit$Data$LigneParMorceau._add(this._fraisSansDroit, droitPourcent);
    var points;
    points = new Array(this._frais._points.length);
    for (var i = 0; i < this._frais._points.length; i++) {
      var p = this._frais._points[i];
      var newx = p._x;
      points[i] = new PHCalculCredit$Data$Point(newx, 1 - p._m, -p._y);
    }
    this._funcBrutToNet = new PHCalculCredit$Data$LigneParMorceau(points);
    this._funcNetToBrut = this._funcBrutToNet._inverse();
  }
  PHCalculCredit$FraisOuvertureCreditData1.get__current = function() {
    if (PHCalculCredit$FraisOuvertureCreditData1._Current == null) {
      PHCalculCredit$FraisOuvertureCreditData1._Current = new PHCalculCredit$FraisOuvertureCreditData1();
    }
    return PHCalculCredit$FraisOuvertureCreditData1._Current;
  };
  var PHCalculCredit$FraisOuvertureCreditData1$ = {

  };


  // PHCalculCredit.OldFraisOuvertureCredit

  function PHCalculCredit$OldFraisOuvertureCredit() {
  }
  PHCalculCredit$OldFraisOuvertureCredit.getFraisOuvertureCredit = function(montant) {
    if (montant < 1) {
      return 0;
    }
    else {
      return PHCalculCredit$FraisOuvertureCreditData.get__current()._frais._getY(montant * 1.1);
    }
  };
  PHCalculCredit$OldFraisOuvertureCredit.getMontantNet = function(montantBrut) {
    return montantBrut - PHCalculCredit$OldFraisOuvertureCredit.getFraisOuvertureCredit(montantBrut);
  };
  PHCalculCredit$OldFraisOuvertureCredit.getMontantBrut = function(montantNet) {
    if (montantNet <= 1E-08) {
      return montantNet;
    }
    else {
      return PHCalculCredit$FraisOuvertureCreditData.get__current()._funcNetToBrut._getY(montantNet);
    }
  };


  // PHCalculCredit.FraisAchatData

  function PHCalculCredit$FraisAchatData() {
  }


  // PHCalculCredit.OldFraisAchat

  function PHCalculCredit$OldFraisAchat() {
  }
  PHCalculCredit$OldFraisAchat.getFraisAchat = function(montant) {
    if (montant < 1) {
      return 0;
    }
    else {
      return PHCalculCredit$FraisAchatData._frais._getY(montant);
    }
  };


  // PHCalculCredit.FraisMandatUtil

  function PHCalculCredit$FraisMandatUtil() {
    this._frais = PHCalculCredit$Data$LigneParMorceau._addOffset(PHCalculCredit$Data$LigneParMorceau._mul(PHCalculCredit$Data$Honor_Credit._current, (1 + 0.21) * 0.25), PHCalculCredit$FraisMandatUtil._fraisFixe);
  }
  PHCalculCredit$FraisMandatUtil.get__current = function() {
    if (PHCalculCredit$FraisMandatUtil._Current == null) {
      PHCalculCredit$FraisMandatUtil._Current = new PHCalculCredit$FraisMandatUtil();
    }
    return PHCalculCredit$FraisMandatUtil._Current;
  };
  var PHCalculCredit$FraisMandatUtil$ = {

  };


  // PHCalculCredit.OldFraisMandat

  function PHCalculCredit$OldFraisMandat() {
  }
  PHCalculCredit$OldFraisMandat.getFraisMandat = function(montant) {
    if (montant < 1) {
      return 0;
    }
    else {
      return PHCalculCredit$FraisMandatUtil.get__current()._frais._getY(montant);
    }
  };


  // PHCalculCredit.FraisMainLevee

  function PHCalculCredit$FraisMainLevee() {
  }
  PHCalculCredit$FraisMainLevee._getFraisMainLeveeEx = function(montant) {
    var detail = new PHCalculCredit$DetailFraisMainLevee();
    detail.droitEnregistrement = 25;
    detail.fraisDivers = 250;
    var index = PHCalculCredit$FraisMainLevee._seuilHonoraire.length - 1;
    while ((index > 0) && (PHCalculCredit$FraisMainLevee._seuilHonoraire[index] > montant)) {
      index--;
    }
    detail.honoraires = PHCalculCredit$FraisMainLevee._abcisseHonoraire[index] + (Math.max(0, montant - PHCalculCredit$FraisMainLevee._seuilHonoraire[index]) * PHCalculCredit$FraisMainLevee._coefHonoraire[index]);
    detail.salaireRadiation = 102 + (Math.max(0, ss.truncate(((montant - 1) / 25000))) * 22.08);
    detail.provision = Math.floor((detail.droitEnregistrement + detail.fraisDivers + detail.honoraires + detail.salaireRadiation + 4.99) / 5) * 5;
    return detail;
  };
  PHCalculCredit$FraisMainLevee.getFraisMainLevee = function(montant) {
    return PHCalculCredit$FraisMainLevee._getFraisMainLeveeEx(montant).provision;
  };
  var PHCalculCredit$FraisMainLevee$ = {

  };


  // PHCalculCredit.DetailFraisMainLevee

  function PHCalculCredit$DetailFraisMainLevee() {
    this.honoraires = 0;
    this.droitEnregistrement = 0;
    this.salaireRadiation = 0;
    this.fraisDivers = 0;
    this.provision = 0;
  }
  var PHCalculCredit$DetailFraisMainLevee$ = {

  };


  // PHCalculCredit.CreditUtil

  function PHCalculCredit$CreditUtil() {
  }
  PHCalculCredit$CreditUtil.periodeMoisToIndex = function(periodeMois) {
    switch (periodeMois) {
      case 1:
        return 3;
      case 3:
        return 2;
      case 6:
        return 1;
      case 12:
        return 0;
    }
    return 3;
  };
  PHCalculCredit$CreditUtil.getDeltaFromAVL1ermois = function(capitalInit, AVL1ermois, duree) {
    var M2 = (duree - 1) * duree / 2;
    return (capitalInit - AVL1ermois * duree) / M2;
  };
  PHCalculCredit$CreditUtil.avlTotalAnToDelta = function(totalAn, montant, duree) {
    return (totalAn * duree / 12 - montant) / (duree * 5.5 - (duree - 1) * duree / 2);
  };
  PHCalculCredit$CreditUtil.getAVL1ermoisFromDelta = function(capitalInit, delta, duree) {
    var M2 = (duree - 1) * duree / 2;
    var AVL = (capitalInit - delta * M2) / duree;
    return (Math.floor(AVL * 100 + 0.5) / 100);
  };
  PHCalculCredit$CreditUtil.intPower = function(x, i) {
    var Y = Math.abs(i);
    var Inter = 1;
    while (Y > 0) {
      while (!(Y & 1)) {
        Y >>= 1;
        x *= x;
      }
      Y--;
      Inter *= x;
    }
    if (i < 0) {
      return 1 / Inter;
    }
    else {
      return Inter;
    }
  };
  PHCalculCredit$CreditUtil.arrondi = function(Value, NBDec) {
    if ((NBDec <= 11) && (NBDec >= 0)) {
      if (Value < 0) {
        return (Math.floor(Value * PHCalculCredit$CreditUtil._arrondiTab[NBDec] - 0.5) / PHCalculCredit$CreditUtil._arrondiTab[NBDec]);
      }
      else {
        return (Math.floor(Value * PHCalculCredit$CreditUtil._arrondiTab[NBDec] + 0.5) / PHCalculCredit$CreditUtil._arrondiTab[NBDec]);
      }
    }
    else {
      var Facteur = PHCalculCredit$CreditUtil.intPower(10, NBDec);
      if (Value < 0) {
        return (Math.floor(Value * Facteur - 0.5) / Facteur);
      }
      else {
        return (Math.floor(Value * Facteur + 0.5) / Facteur);
      }
    }
  };
  PHCalculCredit$CreditUtil.tauxAnToPeriodique = function(value, periodeMois) {
    return (Math.pow(1 + value, periodeMois / 12) - 1);
  };
  PHCalculCredit$CreditUtil.tauxPeriodiqueToAn = function(value, periodeMois) {
    return (PHCalculCredit$CreditUtil.intPower(1 + value, 12 / periodeMois) - 1);
  };
  PHCalculCredit$CreditUtil.calculMensualite = function(taux, duree) {
    if (!duree) {
      return 0;
    }
    else if (taux <= 1E-10) {
      return 1 / Math.max(duree, 1);
    }
    else {
      var inter = PHCalculCredit$CreditUtil.intPower(1 + taux, duree);
      return (inter * taux) / (inter - 1);
    }
  };
  PHCalculCredit$CreditUtil.calculMensualiteWithCapitalTerme = function(taux, duree, capitalTerme) {
    if (duree <= 0) {
      return (1 - capitalTerme) * (1 + taux);
    }
    else if (taux <= 1E-10) {
      return (1 - capitalTerme) / duree;
    }
    else {
      var inter = PHCalculCredit$CreditUtil.intPower(1 + taux, duree);
      return ((inter - capitalTerme) * taux) / (inter - 1);
    }
  };
  PHCalculCredit$CreditUtil.mensualiteC = function(capitalInit, taux, duree) {
    if (!duree) {
      return 0;
    }
    if (taux <= 5E-06) {
      taux = 5E-06;
    }
    return (capitalInit * Math.pow(1 + taux, duree) * taux) / (Math.pow(1 + taux, duree) - 1);
  };
  PHCalculCredit$CreditUtil.calculDureeWithCapitalTerme = function(taux, mensualite, capitalTerme) {
    try {
      if (taux > 1E-08) {
        var inter = mensualite - taux;
        if (inter > 1E-08) {
          inter = (mensualite - taux * capitalTerme) / inter;
          if (inter > 1E-08) {
            return (Math.log(inter) / Math.log(1 + taux));
          }
          else {
            return 1;
          }
        }
        else {
          return 99 * 12;
        }
      }
      else {
        return (1 / mensualite);
      }
    }
    catch ($e1) {
      return 0;
    }
  };
  PHCalculCredit$CreditUtil.calculDuree = function(taux, mensualite) {
    try {
      if (taux > 1E-08) {
        var inter = 1 - taux / mensualite;
        if (inter > 1E-08) {
          return (-Math.log(inter) / Math.log(1 + taux));
        }
        else {
          return 99 * 12;
        }
      }
      else {
        return (1 / mensualite);
      }
    }
    catch ($e1) {
      return 0;
    }
  };
  PHCalculCredit$CreditUtil.calculTauxCWithCapitalTerme = function(mensualite, duree, capitalTerme) {
    var t1 = 0;
    var t2 = 0.2;
    var Iter = 0;
    while ((t2 - t1) > 1E-06 && (Iter < 20)) {
      var t = (t1 + t2) * 0.5;
      if (PHCalculCredit$CreditUtil.calculMensualiteWithCapitalTerme(t, duree, capitalTerme) > mensualite) {
        t2 = t;
      }
      else {
        t1 = t;
      }
      Iter++;
    }
    return (t1 + t2) * 0.5;
  };
  PHCalculCredit$CreditUtil.calculTauxC = function(mensualite, duree) {
    var t1 = 0;
    var t2 = 0.2;
    var Iter = 0;
    while ((t2 - t1) > 1E-06 && (Iter < 20)) {
      var t = (t1 + t2) * 0.5;
      if (PHCalculCredit$CreditUtil.calculMensualite(t, duree) > mensualite) {
        t2 = t;
      }
      else {
        t1 = t;
      }
      Iter++;
    }
    return (t1 + t2) * 0.5;
  };
  PHCalculCredit$CreditUtil.easyStartReportMax = function(tauxPeriodique, duree, dureeReport) {
    if ((duree <= 0) || (dureeReport <= 0)) {
      return 0;
    }
    try {
      var TauxP = PHCalculCredit$CreditUtil.arrondi(tauxPeriodique, PHCalculCredit$CreditUtil.occhNbrDecTauxMois);
      var M1 = (Math.pow(1 + TauxP, duree) - 1);
      var M2 = Math.pow(1 + TauxP, dureeReport);
      var M3 = Math.pow(1 + TauxP, duree - dureeReport) - 1;
      var inter = Math.floor((0.1 * M2) / (M1 * (1 / M3 - (M2 / M1))) * 100) / 100;
      return Math.min(PHCalculCredit$CreditUtil.occhMaxReport, Math.max(0, inter));
    }
    catch ($e1) {
      return 0;
    }
  };
  PHCalculCredit$CreditUtil.calculCapitalWithMensualite = function(tauxPeriodique, duree, periode, mensualite) {
    if (periode < duree) {
      var inter = PHCalculCredit$CreditUtil.intPower(1 + tauxPeriodique, periode) - 1;
      if (inter > 1E-10) {
        return (inter + 1) - mensualite * inter / tauxPeriodique;
      }
      else {
        if (duree > 0) {
          return 1 - (periode) / duree;
        }
        else {
          return 1;
        }
      }
    }
    else {
      return 0;
    }
  };
  PHCalculCredit$CreditUtil.calculCapital = function(tauxPeriodique, duree, periode) {
    if (periode < duree) {
      var mensualite = PHCalculCredit$CreditUtil.calculMensualite(tauxPeriodique, duree);
      return PHCalculCredit$CreditUtil.calculCapitalWithMensualite(tauxPeriodique, duree, periode, mensualite);
    }
    return 0;
  };
  PHCalculCredit$CreditUtil.calculChargeMaxMensCst = function(tauxPeriodique, duree, varHMaxAn, dureeFixe, franchise, periodeMois) {
    if ((duree <= dureeFixe) || (Math.abs(varHMaxAn) < 1E-08)) {
      return PHCalculCredit$CreditUtil.calculMensualite(tauxPeriodique, duree);
    }
    if (duree <= franchise) {
      return tauxPeriodique;
    }
    var Duree1An = 12 / periodeMois;
    var capital = 1;
    if (dureeFixe * periodeMois === Duree1An) {
      if (dureeFixe > franchise) {
        capital = PHCalculCredit$CreditUtil.calculCapital(tauxPeriodique, duree - franchise, dureeFixe - franchise);
      }
      var tauxMens2;
      var varh2;
      var duree2;
      if (Duree1An * 2 > franchise) {
        varh2 = ((varHMaxAn < 0) || (varHMaxAn > 0.01)) ? 0.01 : varHMaxAn;
        varh2 = PHCalculCredit$CreditUtil.tauxAnToPeriodique(varh2, periodeMois);
        tauxMens2 = tauxPeriodique + varh2;
        duree2 = Math.min(Duree1An, Duree1An * 2 - franchise);
        capital = capital * PHCalculCredit$CreditUtil.calculCapital(tauxMens2, duree - Duree1An - Duree1An + duree2, duree2);
      }
      if (Duree1An * 3 > franchise * periodeMois) {
        varh2 = ((varHMaxAn < 0) || (varHMaxAn > 0.02)) ? 0.02 : varHMaxAn;
        varh2 = PHCalculCredit$CreditUtil.tauxAnToPeriodique(varh2, periodeMois);
        tauxMens2 = tauxPeriodique + varh2;
        duree2 = Math.min(Duree1An, Duree1An * 3 - franchise);
        capital = capital * PHCalculCredit$CreditUtil.calculCapital(tauxMens2, duree - Duree1An - Duree1An - Duree1An + duree2, duree2);
      }
      varh2 = ((varHMaxAn < 0) || (varHMaxAn > PHCalculCredit$CreditUtil.tauxPeriodiqueToAn(tauxPeriodique, periodeMois))) ? tauxPeriodique : PHCalculCredit$CreditUtil.tauxAnToPeriodique(varHMaxAn, periodeMois);
      tauxMens2 = tauxPeriodique + varh2;
      duree2 = duree - Math.max(3 * Duree1An, franchise);
      return capital * PHCalculCredit$CreditUtil.calculMensualite(tauxMens2, duree2);
    }
    else {
      if (dureeFixe > franchise) {
        capital = PHCalculCredit$CreditUtil.calculCapital(tauxPeriodique, duree - franchise, dureeFixe - franchise);
      }
      var tauxMens2;
      var varh2;
      if ((varHMaxAn < 0) || (varHMaxAn > PHCalculCredit$CreditUtil.tauxPeriodiqueToAn(tauxPeriodique, periodeMois))) {
        varh2 = tauxPeriodique;
      }
      else {
        varh2 = PHCalculCredit$CreditUtil.tauxAnToPeriodique(varHMaxAn, periodeMois);
      }
      tauxMens2 = tauxPeriodique + varh2;
      return capital * PHCalculCredit$CreditUtil.calculMensualite(tauxMens2, duree - Math.max(dureeFixe, franchise));
    }
  };


  // MyExt.MathExt

  function MyExt$MathExt() {
  }
  MyExt$MathExt._sign = function(x) {
    return (x > 0) ? 1 : (x < 0) ? -1 : 0;
  };


  // MyExt.ArrayExt

  function MyExt$ArrayExt() {
  }
  MyExt$ArrayExt._binarySearch = function(array, v, compare) {
    var h = array.length;
    if (!h) {
      return ~0;
    }
    var l = -1;
    var m = 0;
    var sign = 1;
    while (h - l > 1) {
      m = (h + l) >> 1;
      if (compare != null) {
        sign = compare(array[m], v);
      }
      else {
        sign = MyExt$MathExt._sign(array[m] - v);
      }
      if (!sign) {
        return m;
      }
      if (sign < 0) {
        l = m;
      }
      else {
        h = m;
      }
    }
    if (h === array.length) {
      return (sign > 0) ? ~(h - 1) : ~h;
    }
    else if (l === -1) {
      return (sign < 0) ? ~1 : ~0;
    }
    else {
      return ~h;
    }
  };


  // MyExt.BaseList

  function MyExt$BaseList() {
    this._list = [];
  }
  var MyExt$BaseList$ = {
    add: function(value) {
      this._list.push(value);
    },
    insert: function(index, value) {
      this._list.splice(index, 0, value);
    },
    get_count: function() {
      return this._list.length;
    },
    getEnumerator: function() {
      return ss.enumerate(this._list);
    },
    get_item: function(index) {
      return this._list[index];
    }
  };


  // DocteurCreditJS.Input

  function DocteurCreditJS$Input() {
    this.mensualite = 0;
    this.dureeInitialeMois = 0;
    this.montantInital = 0;
  }
  DocteurCreditJS$Input._nbMoisEntierEntre2Dates = function(begin, end) {
    var dB = begin.getDate();
    var mB = begin.getMonth();
    var yB = begin.getFullYear();
    var dE = end.getDate();
    var mE = end.getMonth();
    var yE = end.getFullYear();
    var m = (yE - yB) * 12 + (mE - mB);
    if (dE < dB) {
      m--;
    }
    return m;
  };
  DocteurCreditJS$Input._find = function(taux, mensualite) {
    var i = 0;
    while ((mensualite < DocteurCreditJS$Input._findMensualite(taux[i])) && (i < taux.length)) {
      i++;
    }
    if (i >= taux.length) {
      return new DocteurCreditJS$RowTaux(taux[taux.length - 1].DurMax + 1, Number.MAX_VALUE, 0.2);
    }
    return taux[i];
  };
  DocteurCreditJS$Input._findMensualite = function(row) {
    var rateMois = Math.pow(1 + row.Rate, 1 / 12) - 1;
    return PHCalculCredit$CreditUtil.calculMensualite(rateMois, row.DurMax);
  };
  var DocteurCreditJS$Input$ = {
    calcul: function(taux) {
      var fraisCredit = PHCalculCredit$FraisCreditFactory.getFraisCredit(1);
      var res = new DocteurCreditJS$Output();
      res.ancienMensualite = this.mensualite;
      res.ancienDureeRestanteMois = this.dureeInitialeMois - DocteurCreditJS$Input._nbMoisEntierEntre2Dates(this.dateDeDebut, ss.today());
      var tauxMois = PHCalculCredit$CreditUtil.calculTauxC(this.mensualite / this.montantInital, this.dureeInitialeMois);
      res.ancienTauxAn = Math.pow(1 + tauxMois, 12) - 1;
      res.srd = this.mensualite / PHCalculCredit$CreditUtil.calculMensualite(tauxMois, res.ancienDureeRestanteMois);
      res.fraisIndemnite = res.srd * tauxMois * 3;
      res.fraisMainLevee = PHCalculCredit$FraisMainLevee.getFraisMainLevee(res.srd);
      var capitalNet = res.srd + res.fraisIndemnite + res.fraisMainLevee;
      res.capital = fraisCredit.getMontantBrut(capitalNet);
      res.fraisHypotheque = res.capital - capitalNet;
      var newDuree = res.ancienDureeRestanteMois;
      var mensualiteUnitaire = res.ancienMensualite / res.capital;
      var newTauxPeriode;
      var newTaux = DocteurCreditJS$Input._find(taux, mensualiteUnitaire);
      newTauxPeriode = Math.pow(1 + newTaux.Rate, 1 / 12) - 1;
      newDuree = PHCalculCredit$CreditUtil.calculDuree(newTauxPeriode, mensualiteUnitaire);
      res.tauxAn = newTaux.Rate;
      res.dureeMois = Math.floor(newDuree + 0.95);
      res.mensualite = PHCalculCredit$CreditUtil.calculMensualite(newTauxPeriode, res.dureeMois) * res.capital;
      return res;
    }
  };


  // DocteurCreditJS.Output

  function DocteurCreditJS$Output() {
    this.ancienDureeRestanteMois = 0;
    this.ancienMensualite = 0;
    this.ancienTauxAn = 0;
    this.dureeMois = 0;
    this.srd = 0;
    this.tauxAn = 0;
    this.fraisIndemnite = 0;
    this.fraisMainLevee = 0;
    this.fraisHypotheque = 0;
    this.mensualite = 0;
    this.capital = 0;
  }
  var DocteurCreditJS$Output$ = {
    get_frais: function() {
      return this.fraisIndemnite + this.fraisMainLevee + this.fraisHypotheque;
    },
    get_ancienCoutTotal: function() {
      return this.ancienDureeRestanteMois * this.ancienMensualite;
    },
    get_coutTotal: function() {
      return this.dureeMois * this.mensualite;
    },
    get_gain: function() {
      return this.get_ancienCoutTotal() - this.get_coutTotal();
    }
  };


  // DocteurCreditJS.RowTaux

  function DocteurCreditJS$RowTaux(durMin, durMax, rate) {
    this.DurMin = 0;
    this.DurMax = 0;
    this.Rate = 0;
    this.DurMin = durMin;
    this.DurMax = durMax;
    this.Rate = rate;
  }
  var DocteurCreditJS$RowTaux$ = {

  };


  var $exports = ss.module('DocteurCreditJS',
    {
      DroitsHypo1: [ PHCalculCredit$Data$DroitsHypo1, PHCalculCredit$Data$DroitsHypo1$, null ],
      Droits_Hypo: [ PHCalculCredit$Data$Droits_Hypo, null, null ],
      Honor_Achat: [ PHCalculCredit$Data$Honor_Achat, null, null ],
      Honor_Credit: [ PHCalculCredit$Data$Honor_Credit, PHCalculCredit$Data$Honor_Credit$, null ],
      Point: [ PHCalculCredit$Data$Point, PHCalculCredit$Data$Point$, null ],
      LigneParMorceau: [ PHCalculCredit$Data$LigneParMorceau, PHCalculCredit$Data$LigneParMorceau$, null ],
      FraisCredit0: [ PHCalculCredit$FraisCredit0, PHCalculCredit$FraisCredit0$, null, PHCalculCredit$IFraisCredit ],
      FraisCredit1: [ PHCalculCredit$FraisCredit1, PHCalculCredit$FraisCredit1$, null, PHCalculCredit$IFraisCredit ],
      FraisGlobal: [ PHCalculCredit$FraisGlobal, null, null ],
      FraisOuvertureCreditData: [ PHCalculCredit$FraisOuvertureCreditData, PHCalculCredit$FraisOuvertureCreditData$, null ],
      FraisOuvertureCreditData1: [ PHCalculCredit$FraisOuvertureCreditData1, PHCalculCredit$FraisOuvertureCreditData1$, null ],
      FraisAchatData: [ PHCalculCredit$FraisAchatData, null, null ],
      FraisMandatUtil: [ PHCalculCredit$FraisMandatUtil, PHCalculCredit$FraisMandatUtil$, null ],
      MathExt: [ MyExt$MathExt, null, null ],
      ArrayExt: [ MyExt$ArrayExt, null, null ]
    },
    {
      eTypeRemboursement: PHCalculCredit$eTypeRemboursement,
      IndexPeriodeMois: PHCalculCredit$IndexPeriodeMois,
      IFraisCredit: [ PHCalculCredit$IFraisCredit ],
      FraisCreditFactory: [ PHCalculCredit$FraisCreditFactory, null, null ],
      OldFraisOuvertureCredit: [ PHCalculCredit$OldFraisOuvertureCredit, null, null ],
      OldFraisAchat: [ PHCalculCredit$OldFraisAchat, null, null ],
      OldFraisMandat: [ PHCalculCredit$OldFraisMandat, null, null ],
      FraisMainLevee: [ PHCalculCredit$FraisMainLevee, PHCalculCredit$FraisMainLevee$, null ],
      DetailFraisMainLevee: [ PHCalculCredit$DetailFraisMainLevee, PHCalculCredit$DetailFraisMainLevee$, null ],
      CreditUtil: [ PHCalculCredit$CreditUtil, null, null ],
      BaseList: [ MyExt$BaseList, MyExt$BaseList$, null, ss.IEnumerable ],
      Input: [ DocteurCreditJS$Input, DocteurCreditJS$Input$, null ],
      Output: [ DocteurCreditJS$Output, DocteurCreditJS$Output$, null ],
      RowTaux: [ DocteurCreditJS$RowTaux, DocteurCreditJS$RowTaux$, null ]
    });

  PHCalculCredit$Data$Droits_Hypo._current = new PHCalculCredit$Data$LigneParMorceau([ new PHCalculCredit$Data$Point(0, 0.02865, 0), new PHCalculCredit$Data$Point(5000, 0.013, 78.25), new PHCalculCredit$Data$Point(12000, 0.0117, 93.85), new PHCalculCredit$Data$Point(12249, 0.0143, 62.0026), new PHCalculCredit$Data$Point(22500, 0.08458, -1519.2974), new PHCalculCredit$Data$Point(22749, 0.0143, 79.5023200000001), new PHCalculCredit$Data$Point(45250, 0.086, -3164.92268), new PHCalculCredit$Data$Point(45494, 0.0143, 96.9971199999998), new PHCalculCredit$Data$Point(68000, 0.04938, -2288.44288), new PHCalculCredit$Data$Point(68499, 0.0143, 114.502039999999), new PHCalculCredit$Data$Point(90500, 0.04936, -3058.42796), new PHCalculCredit$Data$Point(90999, 0.0143, 131.99698), new PHCalculCredit$Data$Point(113500, 0.04938, -3849.58302), new PHCalculCredit$Data$Point(113999, 0.0143, 149.5019), new PHCalculCredit$Data$Point(136000, 0.03182, -2233.2181), new PHCalculCredit$Data$Point(136999, 0.0143, 167.00438), new PHCalculCredit$Data$Point(159000, 0.03181, -2617.08562), new PHCalculCredit$Data$Point(159999, 0.0143, 184.496869999999), new PHCalculCredit$Data$Point(181000, 0.03182, -2986.62313), new PHCalculCredit$Data$Point(181999, 0.0143, 201.99935), new PHCalculCredit$Data$Point(200000, 0.013, 461.99935), new PHCalculCredit$Data$Point(205000, 0.03052, -3129.60065), new PHCalculCredit$Data$Point(205999, 0.013, 479.50183), new PHCalculCredit$Data$Point(230000, 0.03052, -3550.09817), new PHCalculCredit$Data$Point(230999, 0.013, 497.00431), new PHCalculCredit$Data$Point(255000, 0.02, -1287.99569), new PHCalculCredit$Data$Point(257499, 0.013, 514.497310000001), new PHCalculCredit$Data$Point(279999, 0.02, -1445.49569), new PHCalculCredit$Data$Point(282499, 0.013, 531.997310000001), new PHCalculCredit$Data$Point(304999, 0.02, -1602.99569), new PHCalculCredit$Data$Point(307499, 0.013, 549.497310000001), new PHCalculCredit$Data$Point(329999, 0.02, -1760.49569), new PHCalculCredit$Data$Point(332499, 0.013, 566.997310000002), new PHCalculCredit$Data$Point(354999, 0.02, -1917.99569), new PHCalculCredit$Data$Point(357499, 0.013, 584.497310000002), new PHCalculCredit$Data$Point(379999, 0.02, -2075.49569), new PHCalculCredit$Data$Point(382499, 0.013, 601.997310000002), new PHCalculCredit$Data$Point(404999, 0.02, -2232.99569), new PHCalculCredit$Data$Point(407499, 0.013, 619.497310000002), new PHCalculCredit$Data$Point(429999, 0.02, -2390.49569), new PHCalculCredit$Data$Point(432499, 0.013, 636.997310000002), new PHCalculCredit$Data$Point(449999, 0.01475, -150.500939999998), new PHCalculCredit$Data$Point(459999, 0.013, 654.497310000002), new PHCalculCredit$Data$Point(479999, 0.01475, -185.500939999998), new PHCalculCredit$Data$Point(489999, 0.013, 671.997310000002), new PHCalculCredit$Data$Point(499999, 0.01475, -203.000939999998), new PHCalculCredit$Data$Point(509999, 0.013, 689.497310000002), new PHCalculCredit$Data$Point(529999, 0.01475, -238.000939999998), new PHCalculCredit$Data$Point(539999, 0.013, 706.997310000002), new PHCalculCredit$Data$Point(549999, 0.01475, -255.500939999998), new PHCalculCredit$Data$Point(559999, 0.013, 724.497310000002), new PHCalculCredit$Data$Point(579999, 0.01475, -290.500939999998), new PHCalculCredit$Data$Point(589999, 0.013, 741.997310000002), new PHCalculCredit$Data$Point(599999, 0.01475, -308.000939999998), new PHCalculCredit$Data$Point(609999, 0.013, 759.497310000002), new PHCalculCredit$Data$Point(629999, 0.01475, -343.00094), new PHCalculCredit$Data$Point(639999, 0.013, 776.997310000001), new PHCalculCredit$Data$Point(649999, 0.01475, -360.50094), new PHCalculCredit$Data$Point(659999, 0.013, 794.497310000001), new PHCalculCredit$Data$Point(679999, 0.01475, -395.50094), new PHCalculCredit$Data$Point(689999, 0.013, 811.997310000001), new PHCalculCredit$Data$Point(700000, 0.0137, 321.997310000001) ]);
  PHCalculCredit$Data$Honor_Achat._current = PHCalculCredit$Data$LigneParMorceau._mul(new PHCalculCredit$Data$LigneParMorceau([ new PHCalculCredit$Data$Point(0, 0.0456, 0), new PHCalculCredit$Data$Point(7500, 0.0285, 128.25), new PHCalculCredit$Data$Point(17500, 0.0228, 228), new PHCalculCredit$Data$Point(30000, 0.0171, 399), new PHCalculCredit$Data$Point(45495, 0.0114, 658.3215), new PHCalculCredit$Data$Point(64095, 0.0057, 1023.663), new PHCalculCredit$Data$Point(250095, 0.00057, 2306.65035) ]), 1);
  PHCalculCredit$Data$Honor_Credit._current = PHCalculCredit$Data$LigneParMorceau._mul(new PHCalculCredit$Data$LigneParMorceau([ new PHCalculCredit$Data$Point(0, 0.0171, 0), new PHCalculCredit$Data$Point(7500, 0.01368, 25.65), new PHCalculCredit$Data$Point(17500, 0.00912, 105.45), new PHCalculCredit$Data$Point(30000, 0.00684, 173.85), new PHCalculCredit$Data$Point(45495, 0.00456, 277.5786), new PHCalculCredit$Data$Point(64095, 0.00228, 423.7152), new PHCalculCredit$Data$Point(250095, 0.000456, 879.88848) ]), 1);
  PHCalculCredit$FraisGlobal._fraisDivers = 625 * (1 + 0.21);
  PHCalculCredit$FraisGlobal._fraisDivers1 = 800 * (1 + 0.21);
  PHCalculCredit$FraisAchatData._frais = PHCalculCredit$Data$LigneParMorceau._addOffset(PHCalculCredit$Data$LigneParMorceau._mul(PHCalculCredit$Data$Honor_Achat._current, 1 + 0.21), PHCalculCredit$FraisGlobal._fraisDivers);
  PHCalculCredit$FraisAchatData._frais1 = PHCalculCredit$Data$LigneParMorceau._addOffset(PHCalculCredit$Data$LigneParMorceau._mul(PHCalculCredit$Data$Honor_Achat._current, 1 + 0.21), PHCalculCredit$FraisGlobal._fraisDivers1);
  PHCalculCredit$FraisMandatUtil._fraisFixe = 300 + 25 + 25;
  PHCalculCredit$FraisMainLevee._seuilHonoraire = null;
  PHCalculCredit$FraisMainLevee._coefHonoraire = null;
  PHCalculCredit$FraisMainLevee._abcisseHonoraire = null;
  (function() {
    PHCalculCredit$FraisMainLevee._seuilHonoraire = [ 2142.86, 7500, 17500, 30000, 45495, 64095, 250095 ];
    PHCalculCredit$FraisMainLevee._coefHonoraire = [ 0.00399, 0.00342, 0.00228, 0.00171, 0.00114, 0.00057, 0.000228 ];
    PHCalculCredit$FraisMainLevee._abcisseHonoraire = new Array(PHCalculCredit$FraisMainLevee._coefHonoraire.length);
    var somme = 9;
    PHCalculCredit$FraisMainLevee._abcisseHonoraire[0] = somme;
    for (var i = 1; i < PHCalculCredit$FraisMainLevee._coefHonoraire.length; i++) {
      somme += (PHCalculCredit$FraisMainLevee._seuilHonoraire[i] - PHCalculCredit$FraisMainLevee._seuilHonoraire[i - 1]) * PHCalculCredit$FraisMainLevee._coefHonoraire[i - 1];
      PHCalculCredit$FraisMainLevee._abcisseHonoraire[i] = somme;
    }
  })();
  PHCalculCredit$CreditUtil.occhNbrDecTauxMois = 6;
  PHCalculCredit$CreditUtil.occhMaxReport = 0.9;
  PHCalculCredit$CreditUtil.periodeMois = [ 12, 6, 3, 1 ];
  PHCalculCredit$CreditUtil._arrondiTab = [ 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000 ];

  return $exports;
});
