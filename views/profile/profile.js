'use strict';
angular
    .module('cpaApp')
    .controller('ProfileController', ProfileController);


function ProfileController($scope,$location,$http,$routeParams) {
    var collaborator_id = $routeParams.id;
    $scope.grades = [];
    
    $http({
        url: "db/connection.php",
        method: "GET",
        params: {
            collaborator_id: collaborator_id,
            request: 7
        }
    }).then(function (response){
        $scope.grades = response.data;
        console.log($scope.grades);
     }, function (response){});
}

ProfileController.$inject = ['$scope','$location','$http','$routeParams'];