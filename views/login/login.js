'use strict';
angular
    .module('cpaApp')
    .controller('LoginController', LoginController);


function LoginController($scope,$location,$http, $window) {

   /* if(localStorage.getItem('userr') != null){
       $location.path("/home/");
    }*/

    $scope.form = {
        email: "",
        password: "",
        request: 1
    }

    /*$scope.login = function(){
        $.getJSON("db/data.json", function(result){
            for(var i = 0; i < result.user.length; i++){
                if(result.user[i].email == $scope.form.email && result.user[i].password == $scope.form.password){
                    localStorage.setItem('userr', JSON.stringify(result.user[i]));
                    $window.location.href = '/cpa/';
                }
            }
        });
    }*/

    $scope.login = function () {
        $http({
            url: "db/connection.php",
            method: "GET",
            params: $scope.form
        }).then(function (response) {
            if(response.data != "FAILED"){
                localStorage.setItem('user', JSON.stringify(response.data));
                alert(response.data);
                $location.path("/");
            }else{
                Materialize.toast("Login error",3000);
            }
        }, function (response) {});
    }
}

LoginController.$inject = ['$scope','$location','$http', '$window'];