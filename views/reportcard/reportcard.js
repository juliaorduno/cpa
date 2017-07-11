'use strict';
angular
    .module('cpaApp')
    .controller('ReportController', ReportController);


function ReportController($scope,$location,$http,$rootScope,$routeParams) {

    var collaborator_id = $routeParams.id;
    $scope.current = JSON.parse(localStorage.getItem('current'));
    $scope.currentMonth = JSON.parse(localStorage.getItem('currentMonth'));
    $scope.indicators = [];
    $scope.selectOptions = [];
    $scope.selectedIndicator = "";

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

    $scope.setValue = function(index){
        var object = $scope.indicators[index];
        object['porcentaje'] = Number(Math.round(object['real']/object['meta']*100+'e2')+'e-2');
        object['calificacion'] = Number(Math.round(object['peso']*object['porcentaje']/100+'e2')+'e-2');
        insertGrade(index);
        formatNumber(index);
    }

    $scope.setSelected = function(selected){
        $scope.selectedIndicator = selected;
    }

    $scope.newIndicator = function(){
        var newObject = {
            indicador_id: $scope.selectedIndicator,
            meta: 0,
            minimo: 0,
            real: 0,
            peso: 0,
            porcentaje: 0,
            calificacion: 0
        }

        $scope.indicators.push(newObject);
        insertGrade($scope.indicators.length-1);
        getIndicators();
        getSelectOptions();
    }

    /*$scope.setEmpty = function(e, value, index) {
        if (e.keyCode === 27) {
            e.preventDefault();
            $scope.myForm[value].$rollbackViewValue();
            $scope.indicators[index][value] = '';
        }
    };*/

    var formatNumber = function(index){
        var object = $scope.indicators[index];
        switch(object["unidad_id"]){
            case 6:
                object['displayMeta'] = object['meta'] + '%';
                object['displayMinimo'] = object['minimo'] + '%';
                object['displayReal'] = object['real'] + '%';
                break;
            case 8:
                object["displayMinimo"] = $rootScope.formatMoney(object["minimo"],2);
                object["displayMeta"] = $rootScope.formatMoney(object["meta"],2);
                object["displayReal"] = $rootScope.formatMoney(object["real"],2);
                break;
        }
    }

    var getIndicators = function(){
        $http({
            url: "db/connection.php",//reportcard
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                request: 18//0
            }
        }).then(function (response){
            $scope.indicators = response.data;
            if($scope.indicators.length > 0){
                for(var i=0; i<$scope.indicators.length; i++){
                    $scope.indicators[i]['real'] = 0;
                    $scope.indicators[i]['porcentaje'] = 0;
                    $scope.indicators[i]['calificacion'] = 0;
                    $scope.indicators[i]['displayReal'] = 0;
                    $scope.indicators[i]['displayMeta'] = 0;
                    $scope.indicators[i]['displayMinimo'] = 0;
                    formatNumber(i);
                }
            } else{
                $scope.indicators = [];
            }
            
        }, function (response){});
    }

    var insertGrade = function(index){
        var form = $scope.indicators[index];
        form['request'] = 19;//1
        form['month_id'] = $scope.currentMonth.mes_id;
        form['collaborator_id'] = collaborator_id;

        $http({
            url: "db/connection.php",//reportcard
            method: "GET",
            params: form
        }).then(function (response){
            //console.log(response.data);
        }, function (response){});
    }

    var getSelectOptions = function(){
        $http({
            url: "db/connection.php",//reportcard
            method: "GET",
            params: {
                request: 21,//2
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                role_id: $scope.current.rol_id
            }
        }).then(function (response){
            $scope.selectOptions = response.data;
        }, function (response){});
    }

    $(document).ready(function(){
        $('ul.tabs').tabs({
            swipeable: true,
            responsiveThreshold: true
        });
    });

    getIndicators();
    getSelectOptions();

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