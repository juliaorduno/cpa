'use strict';
angular
    .module('cpaApp')
    .controller('ReportController', ReportController);


function ReportController($scope,$location,$http) {

    $(document).ready(function(){
        $('ul.tabs').tabs({
            swipeable: true,
            responsiveThreshold: true
        });
    });

    $('#insert-indicator').autocomplete({
        data: {
        "Apple": null,
        "Microsoft": null,
        "Google": null
        },
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
        onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        },
        minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    });

    $scope.insertIndicator = function(){
        var newRow = {
            indicator: "JEJEJE",
            goal: 30,
            minimum: 15,
            real: '',
            weight: '',
            percentage: '',
            grade: ''
        }
        $scope.area1Indicators.push(newRow);
    }

    $scope.removeIndicator = function(indicator){
         var index = -1;
          var comArr = $scope.area1Indicators;
          for( var i = 0; i < comArr.length; i++ ) {
                if( comArr[i].indicator === indicator ) {
                    index = i;
                    break;
                 }
          }

          if( index === -1 ) {
               alert( "Something gone wrong" );
          }
          $scope.area1Indicators.splice( index, 1 );
    }

    $scope.area1Indicators = [{
        indicator: 'Efectividad de cierre',
        goal: 30,
        minimum: 15,
        real: 28,
        weight: 15,
        percentage: 96.6,
        grade: 96.6
    }, {
        indicator: 'JAJAJA',
        goal: 100,
        minimum: 100,
        real: 100,
        weight: 100,
        percentage: 100.00,
        grade: 100.00
    }];

    /*http({
        url: 'db/connection.php',
        method: 'GET',
        params: {
            request: 0
        }
    }).then(function(response){
        $scope.areas = response.data;
        console.log($scope.areas);
    }, function (response){});*/

}

ReportController.$inject = ['$scope','$location','$http'];