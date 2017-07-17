'use strict';
angular
    .module('cpaApp')
    .controller('ReportController', ReportController);


function ReportController($scope,$location,$http,$rootScope,$routeParams) {

    var collaborator_id = $routeParams.id;
    $scope.current = JSON.parse(localStorage.getItem('current'));
    $scope.currentMonth = JSON.parse(localStorage.getItem('currentMonth'));
    $scope.department = JSON.parse(localStorage.getItem('department'));
    $scope.indicators = [];
    $scope.selectOptions = [];
    $scope.selectedIndicator = "";
    $scope.final = {};
    $scope.modified = "";
    $scope.form = {
        indicador_id: 0,
        meta: 0,
        minimo: 0,
        real_obtenido: 0,
        peso: 0,
        porcentaje: 0,
        calificacion: 0,
        request: 19,
        month_id: $scope.currentMonth.mes_id,
        collaborator_id: collaborator_id
    }
    $scope.currentArea = null;
    $scope.events = [];
    $scope.modifiers = [];
    $scope.newEventForm = {
        event: "",
        source: "",
        request: 29
    }
    $scope.selectEvents = [];
    $scope.sources = [];
    $scope.selectedEvent = {};
    $scope.selectedSource = {};
    $scope.otherAreas = [{
        name: 'penalizations',
        unit: 'Incidente'
    },{
        name: 'extras',
        unit: 'Evento'
    }];
    $scope.types = [];
    var data = {};

    $scope.removeIndicator = function(indicator){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                indicator_id: indicator,
                request: 25//0
            }
        }).then(function (response){
            getIndicators();
        }, function (response){});
    }

    $scope.removeModifier = function(modifier){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                event_id: modifier,
                request: 31
            }
        }).then(function (response){
            console.log(response.data);
            getModifiers();
            getFinal();
        }, function (response){});
    }

    $scope.clearCard = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                request: 26
            }
        }).then(function (response){
            getIndicators();
            getModifiers();
        }, function (response){});
    }

    $scope.setValue = function(index, property){
        $scope.modified = property;
        var object = $scope.indicators[index];
        object['porcentaje'] = Number(Math.round(numeral(object['real_obtenido']).value()/numeral(object['meta']).value()+'e2')+'e-2');
        object['calificacion'] = Number(Math.round(object['peso']*object['porcentaje']+'e2')+'e-2');
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

    $scope.getTypes = function(area_id){
        $scope.currentArea = area_id;
        $http({
            url: "db/connection.php", //modifiers
            method: "GET",
            params: {
                request: 8,//1
                area_id: $scope.currentArea
            }
        }).then(function (response){
            $scope.types = response.data;
            getEvents();
        }, function (response){});
    }

    $scope.activateModal = function(type_id){
        $http({
            url: "db/connection.php", //modifiers
            method: "GET",
            params: {
                request: 27,//1
                type_id: type_id,
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                department_id: $scope.department.departamento_id
            }
        }).then(function (response){
            $scope.selectEvents = response.data;
        }, function (response){});
    }

    $scope.newModificator = function(){
        $http({
            url: "db/connection.php", //modifiers
            method: "GET",
            params: {
                request: 29,
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                department_id: $scope.department.departamento_id,
                source: $scope.selectedSource.source,
                event_id: $scope.selectedEvent.event_id
            }
        }).then(function (response){
            Materialize.toast('Enviado', 1000,'',function(){$('.add-event').modal('close')});
            getModifiers();
            getFinal();
        }, function (response){});
    }

    $scope.insertQuantity = function(index){
        var form = $scope.modifiers[index];
        $http({
            url: "db/connection.php", 
            method: "GET",
            params: {
                request: 30,
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                event_id: form.evento_id,
                quantity: form.cantidad
            }
        }).then(function (response){
            console.log(response.data);
            getFinal();
        }, function (response){});
    }

    $scope.send = function(){
        $http({
            url: "db/connection.php", 
            method: "GET",
            params: {
                request: 32,
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
            }
        }).then(function (response){
            Materialize.toast('Enviado', 1000,'',function(){
                $('#send-report').modal('close');
                $location.path('perfil/'+ $scope.current.empleado_id + '/' + $scope.current.nombre);});
        }, function (response){});
    }

    var getModifiers = function(){
        $http({
            url: "db/connection.php",//modifiers
            method: "GET",
            params: {
                request: 11,//2
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id
            }
        }).then(function (response){
            $scope.modifiers = response.data;
        }, function (response){});
    }

    var getEvents = function(){
        $http({
            url: "db/connection.php",//modifiers
            method: "GET",
            params: {
                request: 9,//2
                area_id: $scope.currentArea
            }
        }).then(function (response){
            $scope.events = response.data;
        }, function (response){});
    }

    var getFinal = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                request: 24
            }
        }).then(function (response){
            $scope.final = response.data;
        }, function (response){});
    }

    var formatNumber = function(index, modification){
        var object = $scope.indicators[index];
        switch(object["unidad_id"]){
            case '6':
                if(modification){
                    
                    object[$scope.modified] = numeral(object[$scope.modified]).value() <= 1? 
                                            numeral(object[$scope.modified]).format('0.00%'):
                                            numeral(object[$scope.modified]/100).format('0.00%');
                } else{
                    object['meta'] =numeral(object['meta']).format('0.00%');
                    object['minimo'] =numeral(object['minimo']).format('0.00%');
                    object['real_obtenido'] = numeral(object['real_obtenido']).format('0.00%');
                }
                break;
            case '8':
                object['meta'] = numeral(object['meta']).format('$0,0.00');
                object['minimo'] = numeral(object['minimo']).format('$0,0.00');
                object['real_obtenido'] = numeral(object['real_obtenido']).format('$0,0.00');
                break;
        }
        object['porcentaje'] = numeral(object['porcentaje']).format('0.00%');
        
    }

    var getIndicators = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.currentMonth.mes_id,
                request: 18
            }
        }).then(function (response){
            $scope.indicators = response.data;
            getSelectOptions();
            getFinal();
            if($scope.indicators.length > 0){
                for(var i=0; i<$scope.indicators.length; i++){
                    if(!$scope.indicators[i].hasOwnProperty('calificacion')){
                        $scope.indicators[i]['real_obtenido'] = 0;
                        $scope.indicators[i]['porcentaje'] = 0;
                        $scope.indicators[i]['calificacion'] = 0;
                    }
                    formatNumber(i,false);
                }    
            } else{
                $scope.indicators = [];
            }
        }, function (response){});
    }

    var insertGrade = function(index){
        var i = index;
        var form = $scope.indicators[index];
        $scope.form['indicador_id'] = form['indicador_id'];
        $scope.form['calificacion'] = form['calificacion'];
        $scope.form['meta'] = numeral(form['meta']).value();
        $scope.form['minimo'] = numeral(form['minimo']).value();
        $scope.form['real_obtenido'] = numeral(form['real_obtenido']).value();
        $scope.form['porcentaje'] = numeral(form['porcentaje']).value();
        $scope.form['peso'] = form['peso'];
        $http({
            url: "db/connection.php",
            method: "GET",
            params: $scope.form
        }).then(function (response){
            $scope.indicators[i]['porcentaje'] = numeral($scope.indicators[i]['porcentaje']).format('0.00%');
            if($scope.modified === 'meta' || $scope.modified === 'minimo' || $scope.modified === 'real_obtenido'){
                formatNumber(i, true);
            }
            getFinal();
        }, function (response){});
    }

    var getSelectOptions = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                request: 21,
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

    $http({
        url: "db/connection.php", //modifiers
        method: "GET",
        params: {
            request: 28,
            department_id: $scope.department.departamento_id
        }
    }).then(function (response){
        $scope.sources = response.data;
        for(var i=0; i<$scope.sources.length; i++){
            data[$scope.sources[i].fuente] =  null;
        }
        $('.source-ne').autocomplete({
            data: data,
            onAutocomplete: function(val) {},
        });
    }, function (response){});

    getIndicators();
    getModifiers();
}

ReportController.$inject = ['$scope','$location','$http','$rootScope','$routeParams'];
