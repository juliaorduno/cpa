'use strict';
angular
    .module('cpaApp')
    .controller('CollaboratorsController', CollaboratorsController);


function CollaboratorsController($scope,$location,$http,$rootScope) {

    $scope.department = JSON.parse(localStorage.getItem('department'));
    $scope.collaborators = [];
    $scope.roles = [];
    $scope.form = {
        name: "",
        lastName: "",
        department_id: $scope.department.departamento_id,
        role: "",
        request: 22
    }

    $scope.inspect = function(collaborator){
        localStorage.setItem('current', JSON.stringify(collaborator));
        $location.path('perfil/'+ collaborator.empleado_id + '/' + collaborator.nombre);
    }

    $scope.insertCollaborator = function(){
        $http({
            url: "db/connection.php", //"db/collaborators.php"
            method: "GET",
            params: $scope.form
        }).then(function (response){
            Materialize.toast('Enviado', 1000,'',function(){$('#new-collaborator').modal('close')});
            getCollaborators();
        }, function (response){});
    }

    $scope.activateModal = function(){
        var data = {};
        $http({
            url: "db/connection.php", //"db/collaborators.php"
            method: "GET",
            params: {
                request: 23, //0
                department_id: $scope.department.departamento_id
            }
        }).then(function (response){
            $scope.roles = response.data;
            for(var i=0; i<$scope.roles.length; i++){
                data[$scope.roles[i].rol] =  null;
            }
            $('#role-ac').autocomplete({
                data: data,
                onAutocomplete: function(val) {
                    //$scope.form.role = val;
                },
            });
        }, function (response){});
    }

    var getCollaborators = function(){
        $http({
            url: "db/connection.php", //"db/collaborators.php"
            method: "GET",
            params: {
                request: 6, //0
                department_id: $scope.department.departamento_id
            }
        }).then(function (response){
            $scope.collaborators = response.data;
        }, function (response){});
    }
    
    getCollaborators();

}

CollaboratorsController.$inject = ['$scope','$location','$http','$rootScope'];