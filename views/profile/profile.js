'use strict';
angular
    .module('cpaApp')
    .controller('ProfileController', ProfileController);


function ProfileController($scope,$location,$http,$routeParams) {
    var collaborator_id = $routeParams.id;
    $scope.grades = [];
    $scope.months = [];
    $scope.selectedMonth = '';

    $scope.changeMonth = function(selected){
        $scope.selectedMonth = selected;
        if($scope.selectedMonth === '2017'){

        }else{
            $http({
                url: "db/connection.php",
                method: "GET",
                params: {
                    collaborator_id: collaborator_id,
                    month_id: $scope.selectedMonth,
                    request: 7
                }
            }).then(function (response){
                $scope.grades = response.data;
            }, function (response){});
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
        $scope.months.push({
            mes: 'Resumen',
            mes_id: '2017'
        });
        $scope.changeMonth($scope.months[$scope.months.length-1].mes_id);
     }, function (response){});

     
}

ProfileController.$inject = ['$scope','$location','$http','$routeParams'];