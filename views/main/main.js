'use strict';
angular
    .module('cpaApp')
    .controller('MainController', MainController);

function MainController($scope,$location,$http) {
    $scope.user = JSON.parse(localStorage.getItem('user'));

    if($scope.user.rol === 'gerente'){
        $http({
                url: 'db/connection.php',//sidenav
                method: 'GET',
                params: {
                    usuario_id: $scope.user.usuario_id,
                    request: 2
                }
            }).then(function(response){
                localStorage.setItem('department', JSON.stringify(response.data));
                $scope.$broadcast ('someEvent');
            }, function(response){});
    } else{
        $scope.department = null;
    }
}

MainController.$inject = ['$scope','$location','$http'];