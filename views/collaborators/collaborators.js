'use strict';
angular
    .module('cpaApp')
    .controller('CollaboratorsController', CollaboratorsController);


function CollaboratorsController($scope,$location,$http) {

    $scope.department = JSON.parse(localStorage.getItem('department'));
    $scope.collaborators = [];

    $http({
        url: "db/connection.php",
        method: "GET",
        params: {
            request: 6,
            department_id: $scope.department.departamento_id
        }
    }).then(function (response){
        $scope.collaborators = response.data;
     }, function (response){});

     $scope.inspect = function(collaborator){
        $location.path('perfil/'+ collaborator.empleado_id + '/' + collaborator.nombre);
     }

}

CollaboratorsController.$inject = ['$scope','$location','$http'];