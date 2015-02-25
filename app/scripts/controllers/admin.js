
/**
 * @ngdoc function
 * @name graphTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the graphTestApp
 */
define([
    'scripts/app',
    'DocteurCreditJS',
    'scripts/directives/autoNumericFabrice.js',
    'scripts/models/Refinancing.js',
    'datetimepicker',
    'scripts/directives/chartDir.js',
    'scripts/directives/jQueryLibraryDir.js',
    'scripts/directives/numericDir.js'
    ],

    function (app,DC) {
    'use strict';

    
app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});
    app.controller('AdminCtrl',
      	function ($scope, $http, $q, Refinancing) {
    	$scope.nav = 'rate';
      		$scope.type = ['fixe','1/1/1','3/3/3','5/5/5','10/5/5','12/5/5','15/5/5','20/5/5','7/3/3','8/3/3','9/3/3', '10/3/3','15/1/1','20/1/1','20/3/3','25/5/5','5/3/3','3/1/1','6/1/1'];
 			$http.get('php/gets.php?data=all')
                .success(function(response) {
                	for (var i = 0; i < response.length; i++) {
                    		response[i].duration_min  = parseInt(response[i].duration_min);
                    		response[i].duration_max  = parseInt(response[i].duration_max);   
                    		response[i].cap_pos = parseInt(response[i].cap_pos);
                    		response[i].cap_neg = parseInt(response[i].cap_neg);
                    		response[i].rate = parseInt(response[i].rate*100)/100;
                    	};
                	$scope.rateTable = response;
                	console.log($scope.rateTable);
                    $http.get('php/gets.php?data=inds')
                    .success(function(response) {
                    	for (var i = 0; i < response.length; i++) {
                            response[i].A  = parseFloat(response[i].A);   
                            response[i].C = parseFloat(response[i].C);
                            response[i].E = parseFloat(response[i].E);
                        };
                        $scope.indTable=response;
                        console.log($scope.indTable);
                    });
                });

            $scope.getData = function (tab){
            	$scope.nav =tab;
            }

            $scope.setRates = function (argument) {
            	$http.post('php/sets.php', {'rates':$scope.rateTable}).success(function (response) {
            		alert(response);
            	});
            }

            $scope.deleteInds = function (argument) {
                alert('Pas encore instancié');
            }

            $scope.setInds = function (argument) {
                
                if ($scope.date !== undefined && $scope.A !== undefined && $scope.C !== undefined && $scope.E !== undefined ) {

                    $scope.ind = {
                        date : $scope.date,
                        A : $scope.A,
                        C : $scope.C,
                        E : $scope.E
                    }

                    console.log($scope.ind);
                    $http.post('php/sets.php', {'inds':$scope.ind}).success(function (response) {
                        alert('Sauvegarde reussi');
                        console.log(response);
                    });
                }else{
                    alert('Veuillez entrez des données correct');
                };
            }


    });

    
    
});




