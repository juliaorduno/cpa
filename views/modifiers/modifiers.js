'use strict';
angular
    .module('cpaApp')
    .controller('ModifierController', ModifierController);


function ModifierController($scope,$location,$http) {
    var currentLocation = $location.path();
    $scope.types = [];
    $scope.modifiers = [];
    $scope.header = "";

    var getTypes = function(area_id){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                request: 8,
                area_id: area_id
            }
        }).then(function (response){
            $scope.types = response.data;
        }, function (response){});
    }

    var getModifiers = function(area_id){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                request: 9,
                area_id: area_id
            }
        }).then(function (response){
            $scope.modifiers = response.data;
            console.log($scope.modifiers);
        }, function (response){});
    }

    switch(currentLocation){
        case '/penalizaciones':
            $scope.header = "Penalizaciones"
            getTypes(4);
            getModifiers(4);
            break;

        case '/puntos_extras':
            $scope.header = "Puntos Extras"
            getTypes(5);
            getModifiers(5);
            break;
    }
}

ModifierController.$inject = ['$scope','$location','$http'];