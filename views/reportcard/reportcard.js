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
    $scope.final = {};

    $scope.removeIndicator = function(indicator){
        $http({
            url: "db/connection.php",//reportcard
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                indicator_id: indicator,
                request: 25//0
            }
        }).then(function (response){
            console.log(response.data);
            getIndicators();
        }, function (response){});
         /*var index = -1;
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
          $scope.area1Indicators.splice( index, 1 );*/
    }

    $scope.clear = function(){
        $http({
            url: "db/connection.php",//reportcard
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                request: 26//0
            }
        }).then(function (response){
            console.log(response.data);
            getIndicators();
        }, function (response){});
    }

    $scope.setValue = function(index){
        formatNumber(index);
        var object = $scope.indicators[index];
        object['porcentaje'] = Number(Math.round(object['real_obtenido']/object['meta']*100+'e2')+'e-2');
        object['calificacion'] = Number(Math.round(object['peso']*object['porcentaje']/100+'e2')+'e-2');
        insertGrade(index);
    }

    $scope.setSelected = function(selected){
        $scope.selectedIndicator = selected;
    }

    $scope.newIndicator = function(selected){
        var newObject = {
            indicador_id: selected,
            meta: 0,
            minimo: 0,
            real_obtenido: 0,
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

    var getFinal = function(){
        $http({
            url: "db/connection.php",//reportcard
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                request: 24//0
            }
        }).then(function (response){
            $scope.final = response.data;
            console.log($scope.final);
        }, function (response){});
    }

    var formatNumber = function(index){
        var object = $scope.indicators[index];
        switch(object["unidad_id"]){
            case '6':
                object['meta'] = object['format'] ? object['meta'].replace('%',''): object['meta'] + '%';
                object['minimo'] = object['format'] ? object['minimo'].replace('%',''):object['minimo'] + '%';
                object['real_obtenido'] = object['format'] ? object['real_obtenido'].replace('%',''):object['real_obtenido'] + '%';
                break;
            case '8':
                object["minimo"] = object['format'] ? object['minimo'].replace('$',''): $rootScope.formatMoney(object["minimo"],2);
                object["meta"] = object['format'] ? object['meta'].replace('$',''):$rootScope.formatMoney(object["meta"],2);
                object["real_obtenido"] = object['format'] ? object['real_obtenido'].replace('$',''):$rootScope.formatMoney(object["real_obtenido"],2);
                if(object['format']){
                    object["minimo"] = object['minimo'].replace(',','');
                    object["meta"] = object['meta'].replace(',','');
                    object["real_obtenido"] = object['real_obtenido'].replace(',','');
                }
                
                break;
        }
        object['format'] = !object['format'];
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
            getSelectOptions();
            getFinal();
            if($scope.indicators.length > 0){
                $scope.indicators['format'] = false;
                for(var i=0; i<$scope.indicators.length; i++){
                    if(!$scope.indicators[i].hasOwnProperty('calificacion')){
                        $scope.indicators[i]['real_obtenido'] = 0;
                        $scope.indicators[i]['porcentaje'] = 0;
                        $scope.indicators[i]['calificacion'] = 0;
                    }
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
            console.log(response.data);
            formatNumber($scope.indicators.length-1);
            getFinal();
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