'use strict';
angular
    .module('cpaApp')
    .controller('LoginController', LoginController);


function LoginController($scope,$location,$http) {
    $scope.email = "juliapaola97@gmail.com";
    $scope.password = "clave";

    $scope.login = function(){
        if($scope.iemail == $scope.email && $scope.ipassword == $scope.password){
            alert("OK");
        }
    }
   /* if(JSON.parse(localStorage.getItem('user')) != null){
        $location.path("/panel/");
    }
    $scope.form = {
        request: 7,
        email: "",
        password: ""
    }
    $scope.login = function () {
        $http({
            url: "db/",
            method: "GET",
            params: $scope.form
        }).then(function (response) {
            // process response here..
            if(response.data != "FAILED"){
                localStorage.setItem('user', JSON.stringify(response.data));
                $location.path("/panel/");
            }else{
                Materialize.toast("Login error",3000);
            }
        }, function (response) {

        });
    }*/
}

LoginController.$inject = ['$scope','$location','$http'];