'use strict';
angular
    .module('cpaApp')
    .controller('ModifierController', ModifierController);


function ModifierController($scope,$location,$http) {
    var currentLocation = $location.path();
    $scope.types = [];
    $scope.modifiers = [];
    $scope.header = "";
    $scope.newType = {};
    $scope.area_id = "";
    $scope.newEvent = {
        type_id: "",
        event: "",
        unit_id: "",
        request: 15//0
    }

    $scope.addNew = function(type){
        $scope.newType = type;
    }

    $scope.insertNew = function(){
        $scope.newEvent.type_id = $scope.newType.tipo_id;

        if($scope.newType.tipo_id === '7'){
            $scope.newEvent.unit_id = 11;
        } else if($scope.newType.tipo_id === '9'){
            $scope.newEvent.unit_id = 12;
        } else{
            $scope.newEvent.unit_id = null;
        }

        $http({
            url: "db/connection.php", //modifiers.php
            method: "GET",
            params: $scope.newEvent
        }).then(function (response){
            getModifiers();
            Materialize.toast('Enviado', 1000,'',function(){$('#modal1').modal('close')});
        }, function (response){});
    }

    var getTypes = function(){
        $http({
            url: "db/connection.php", //modifiers
            method: "GET",
            params: {
                request: 8,//1
                area_id: $scope.area_id
            }
        }).then(function (response){
            $scope.types = response.data;
        }, function (response){});
    }

    var getModifiers = function(){
        $http({
            url: "db/connection.php",//modifiers
            method: "GET",
            params: {
                request: 9,//2
                area_id: $scope.area_id
            }
        }).then(function (response){
            $scope.modifiers = response.data;
        }, function (response){});
    }

    switch(currentLocation){
        case '/penalizaciones':
            $scope.header = "Penalizaciones";
            $scope.area_id = 4;
            getTypes();
            getModifiers();
            break;

        case '/puntos_extras':
            $scope.header = "Puntos Extras"
            $scope.area_id = 5;
            getTypes();
            getModifiers();
            break;
    }

    $(document).ready(function() {
        $('.modal').modal();
    });

}

ModifierController.$inject = ['$scope','$location','$http'];