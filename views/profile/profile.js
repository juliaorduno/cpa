'use strict';
angular
    .module('cpaApp')
    .controller('ProfileController', ProfileController);


function ProfileController($scope,$location,$http,$routeParams,$rootScope) {
    var collaborator_id = $routeParams.id;
    $scope.grades = [];
    $scope.months = [];
    $scope.events = [];
    $scope.final = {};
    $scope.selectedMonth = '';
    $scope.current = JSON.parse(localStorage.getItem('current'));
    $scope.indicators = [];
    $scope.resumeData = {
        '1':[],
        '2':[],
        '3':[]
    };
    $scope.totalGrades = [];

    var getTotalGrades = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                request: 14
            }
        }).then(function (response){
            $scope.totalGrades = response.data;
            console.log($scope.totalGrades);
        }, function (response){});
    }

    var getDataPerMonth = function(request){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.selectedMonth,
                request: request
            }
        }).then(function (response){
            switch(request){
                case 7:
                    $scope.grades = response.data;
                    break;
                case 11:
                    $scope.events = response.data;
                    break;
                case 12:
                    $scope.final = response.data;
            }
        }, function (response){});
    }

    var setResumeData = function(){
        for(var i=0; i<$scope.indicators.length; i++){
            $scope.resumeData[$scope.indicators[i].area_id].push($scope.indicators[i].indicador);
        }
        //console.log($scope.indicators.some(indicator => indicator.area_id === '1'));

        for(var i=0; i<3; i++){
            Object.defineProperty($scope.resumeData, $rootScope.areas[i].area,
                Object.getOwnPropertyDescriptor($scope.resumeData, $rootScope.areas[i].id));
            delete $scope.resumeData[$rootScope.areas[i].id];
        }
    }

    var getIndicators = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                request: 13
            }
        }).then(function (response){
            $scope.indicators = response.data;
            setResumeData();
        }, function (response){});
    }

    $scope.changeMonth = function(selected){
        $scope.selectedMonth = selected;
        if($scope.selectedMonth === '2017'){
            getIndicators();
            getTotalGrades();
        }else{
            getDataPerMonth(7);
            getDataPerMonth(11);
            getDataPerMonth(12);
        }
    }

     $http({
        url: "db/connection.php",
        method: "GET",
        params: {
            collaborator_id: collaborator_id,
            request: 10
        }
    }).then(function (response){
        $scope.months = response.data;
        if($scope.months != "NO INFO"){
            $scope.months.push({
                mes: 'Resumen',
                mes_id: '2017'
            });
            $scope.changeMonth($scope.months[$scope.months.length-1].mes_id);
        } 
     }, function (response){});
     
}

ProfileController.$inject = ['$scope','$location','$http','$routeParams','$rootScope'];