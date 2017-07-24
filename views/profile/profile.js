'use strict';
angular
    .module('cpaApp')
    .controller('ProfileController', ProfileController);


function ProfileController($scope,$location,$http,$routeParams,$rootScope,$window) {

    if($rootScope.sent === true){
        $window.location.reload();
        $rootScope.sent = false;
    }
    var collaborator_id = $routeParams.id;
    $scope.user = JSON.parse(localStorage.getItem('user'));
    $scope.grades = [];
    $scope.months = [];
    $scope.events = [];
    $scope.final = {};
    $scope.selectedMonth = '';
    $scope.current = JSON.parse(localStorage.getItem('current'));
    $scope.indicators = [];
    $scope.resumeData = {
        'Calidad/Operaciones':[],
        'Productividad/Comercial':[],
        'Rentabilidad/Administración':[],
    };
    $scope.extraPoints = {};
    $scope.penalizations = {};
    $scope.totalGrades = [];
    $scope.finalGrades = [];
    $scope.totalEvents = {};
    $scope.remainingMonths = [];
    $scope.existGrade = {
        '1': false,
        '2': false,
        '3': false
    }

    $scope.newReport = function(month){
        $('#remaining-months').modal('close');
        localStorage.setItem('currentMonth', JSON.stringify(month));
        $location.path('boleta/'+ $scope.current.empleado_id + '/' + $scope.current.nombre + '/' + month.mes);
    }

    $scope.changeMonth = function(selected){
        $scope.selectedMonth = selected;
        if($scope.selectedMonth != '2017'){
            getDataPerMonth(7);
            getDataPerMonth(11);
            getDataPerMonth(12);
        }
    }

    function existEvent(month_id){
        var extras = false;
        var pen = false;
        var eventExtra = "";
        var eventPen = "";
        if($scope.totalEvents[month_id] !== ""){
            if($scope.totalEvents[month_id].some(event => event.area_id === '4')){
                pen = true;
            } else if($scope.totalEvents[month_id].some(event => event.area_id === '5')){
                extras = true;
            }
            var l = $scope.totalEvents[month_id].length;
            for(var i=0; i<l; i++){
                if($scope.totalEvents[month_id][i].area_id === '4'){
                    eventPen += (", " + $scope.totalEvents[month_id][i].tipo);
                } else{
                    eventExtra += (", " + $scope.totalEvents[month_id][i].tipo);
                }
            }
        }
        $scope.extraPoints[month_id]['contains'] = extras;
        $scope.penalizations[month_id]['contains'] = pen;
        $scope.extraPoints[month_id]['types'] = eventExtra;
        $scope.penalizations[month_id]['types'] = eventPen;
    }

    function fillGrid(){
        var temp = {};
        var id = '';
        var c = 0;
        var l = $scope.indicators.length;
        var l2 = $scope.months.length-1;
        for(var i=0; i<l; i++){
            id = $scope.indicators[i]['indicador_id'];
            for(var j=0; j<l2; j++){
                var emptyGrade = {};
                if(c === 0){
                    temp = $scope.totalGrades[c];
                } else{
                    temp = $scope.totalGrades[c-1];
                }
                emptyGrade['area_id'] = temp['area_id'];
                emptyGrade['indicador_id'] = id;
                emptyGrade['calificacion'] = '0.00';
                emptyGrade['porcentaje'] = '0.00';
                emptyGrade['peso'] = '0.00';
                emptyGrade['mes_id'] = $scope.months[j].mes_id;
            
                if(c === $scope.totalGrades.length){
                    $scope.totalGrades.push(emptyGrade);
                } else if($scope.totalGrades[c]['indicador_id'] !== id){
                    $scope.totalGrades.splice(c,0,emptyGrade);
                }
                c++;
            }
        }
    }

    var getFinalGrades = function(){
        $http({
            url: "db/connection.php", //profile
            method: "GET",
            params: {
                request: 16,//0
                collaborator_id: collaborator_id
            }
        }).then(function (response){
            $scope.finalGrades = response.data;
        }, function (response){});
    }

    function getTotalEvents(month_id){
        $http({
            url: "db/connection.php", //profile
            method: "GET",
            params: {
                request: 17,//1
                collaborator_id: collaborator_id,
                month_id: month_id
            }
        }).then(function (response){
            month_id = month_id.toString();
            $scope.totalEvents[month_id] = response.data;
            existEvent(month_id);
        }, function (response){});
    }

    var getTotalGrades = function(){
        $http({
            url: "db/connection.php",//profile
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                request: 14 //2
            }
        }).then(function (response){
            $scope.totalGrades = response.data;
            fillGrid();
        }, function (response){});
    }

    var formatNumber = function(){
        for(var i=0; i < $scope.grades.length; i++){
            var object = $scope.grades[i];
            switch($scope.grades[i]["unidad_id"]){
                case '6':
                    object["minimo"] = numeral(object["minimo"]).format('0.00%');
                    object["meta"] = numeral(object["meta"]).format('0.00%');
                    object["real_obtenido"] =numeral(object["real_obtenido"]).format('0.00%');
                    break;

                case '8':
                    object["minimo"] = numeral(object['minimo']).format('$0,0.00');
                    object["meta"] = numeral(object['meta']).format('$0,0.00');
                    object["real_obtenido"] = numeral(object['real_obtenido']).format('$0,0.00');
                    break;
            }
        }
    }

    var getDataPerMonth = function(request){
        $http({
            url: "db/connection.php", //profile
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.selectedMonth,
                request: request
            }
        }).then(function (response){
            switch(request){
                case 7://3
                    $scope.grades = response.data;
                    for(var i = 1; i < 4; i++){
                        if($scope.grades.some(grade => grade.area_id === i.toString())){
                            $scope.existGrade[i.toString()] = true;
                        } else{
                            $scope.existGrade[i.toString()] = false;
                        }
                    }
                    formatNumber();
                    break;
                case 11://4
                    $scope.events = response.data;
                    break;
                case 12://5
                    $scope.final = response.data;
            }
            
        }, function (response){});
    }

    var getTypes = function(area_id){
        $http({
            url: "db/connection.php",//modifiers
            method: "GET",
            params: {
                request: 8,//1
                area_id: area_id
            }
        }).then(function (response){
            var area;
            if(area_id === '4'){
                area = $rootScope.areas[3].area;
            } else{
                area = $rootScope.areas[4].area;
            }
            for(var i=0; i<response.data.length; i++){
                $scope.resumeDataMod[area].push(response.data[i].tipo);
            }
        }, function (response){});
    }

    var setResumeData = function(){
        for(var i=0; i<$scope.indicators.length; i++){
            $scope.resumeData[$scope.indicators[i].area].push($scope.indicators[i].indicador);
        }
    }

    function getIndicators(){
        $http({
            url: "db/connection.php",//profile
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                request: 13//6
            }
        }).then(function (response){
            $scope.indicators = response.data;
            getTotalGrades();
            setResumeData();
            getFinalGrades();
            for(var i=0; i<$scope.months.length-1; i++){
                getTotalEvents($scope.months[i].mes_id);
            }
            
        }, function (response){});
    }

    $http({
        url: "db/connection.php",//profile
        method: "GET",
        params: {
            collaborator_id: collaborator_id,
            request: 10//7
        }
    }).then(function (response){
        $scope.months = response.data;
        if($scope.months != "NO INFO"){
            $scope.months.push({
                mes: 'Resumen',
                mes_id: '2017'
            });
            $scope.changeMonth($scope.months[$scope.months.length-1].mes_id);
            if($scope.current.mes != null){
                getIndicators();
            }
        } 
     }, function (response){});

    $http({
        url: "db/connection.php",//profile
        method: "GET",
        params: {
            collaborator_id: collaborator_id,
            request: 20//8
        }
    }).then(function (response){
        $scope.remainingMonths = response.data;
    }, function (response){});


}

ProfileController.$inject = ['$scope','$location','$http','$routeParams','$rootScope','$window'];