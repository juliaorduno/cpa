'use strict';
angular
    .module('cpaApp')
    .controller('ReportController', ReportController);


function ReportController($scope,$location,$http,$rootScope,$routeParams) {

    var collaborator_id = $routeParams.id;
    $scope.current = JSON.parse(localStorage.getItem('current'));
    $scope.indicators = [];

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

    /*$scope.setEmpty = function(e, value, index) {
        if (e.keyCode === 27) {
            e.preventDefault();
            $scope.myForm[value].$rollbackViewValue();
            $scope.indicators[index][value] = '';
        }
    };*/

    var getIndicators = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                request: 18
            }
        }).then(function (response){
            $scope.indicators = response.data;
            for(var i=0; i<$scope.indicators.length; i++){
                $scope.indicators[i]['real'] = 0;
                $scope.indicators[i]['porcentaje'] = 0;
                $scope.indicators[i]['calificacion'] = 0;
            }
            console.log($scope.indicators);
        }, function (response){});
    }

    var insertGrade = function(index){
        var form = $scope.indicators[index];
        form['request'] = 19;
        form['month_id'] = '201702';
        form['collaborator_id'] = collaborator_id;

        $http({
            url: "db/connection.php",
            method: "GET",
            params: form
        }).then(function (response){
            console.log(response.data);
        }, function (response){});
    }

    getIndicators();

    $scope.setValue = function(index){
        var object = $scope.indicators[index];
        object['porcentaje'] = Number(Math.round(object['real']/object['meta']*100+'e2')+'e-2');
        object['calificacion'] = Number(Math.round(object['peso']*object['porcentaje']/100+'e2')+'e-2');
        insertGrade(index);
    }

    $scope.save = function(){
        for(var i = 0; i < $scope.indicators.length; i++){
            insertGrade(i);
        }
    }


}

ReportController.$inject = ['$scope','$location','$http','$rootScope','$routeParams'];

/*angular
    .module('cpaApp')
    .directive('contenteditable', ['$sce', function($sce) {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function(scope, element, attrs, ngModel) {
                if (ngModel !== null) {
                    function read() {
                        ngModel.$setViewValue(element.html());
                    }

                    ngModel.$render = function() {
                        element.html(ngModel.$viewValue || "");
                    };

                    element.bind("blur keyup change", function() {
                        scope.$apply(read);
                    });
                }
                
            }
        };
}]);*/