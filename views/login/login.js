'use strict';
angular
    .module('cpaApp')
    .controller('LoginController', LoginController);


function LoginController($scope,$location,$http, $window) {
   if(localStorage.getItem('user') != null){
       $location.path("/");
    }

    $scope.form = {
        email: "",
        password: "",
        request: 1 //0
    }

    $scope.login = function () {
        $http({
            url: "db/connection.php", //login.php
            method: "GET",
            params: $scope.form
        }).then(function (response) {
            if(response.data != "FAILED"){
                localStorage.setItem('user', JSON.stringify(response.data));
                $location.path("/");
            }else{
                Materialize.toast("Login error",3000);
            }
        }, function (response) {});
    }
}

LoginController.$inject = ['$scope','$location','$http', '$window'];