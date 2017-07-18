'use strict';
angular
    .module('cpaApp')
    .controller('HomeController', HomeController);


function HomeController($scope,$location,$http) {
    $scope.department = JSON.parse(localStorage.getItem('department'));
    $scope.user = JSON.parse(localStorage.getItem('user'));
    $scope.months = [];
    $scope.currentTab = {tab: '2017'};
    $scope.resumeData = [];

    if($scope.user === 'gerente'){
        $http({
            url: 'db/connection.php',//sidenav
            method: 'GET',
            params: {
                usuario_id: $scope.user.usuario_id,
                request: 2//0
            }
        }).then(function(response){
            localStorage.setItem('department', JSON.stringify(response.data));
        }, function(response){});

        $http({
            url: "db/connection.php",//profile
            method: "GET",
            params: {
                request: 34,
                department_id: $scope.department.departamento_id
            }
        }).then(function (response){
            $scope.resumeData = response.data;
        }, function (response){});
        
    } else{

    }

    $http({
        url: "db/connection.php",//profile
        method: "GET",
        params: {
            request: 33
        }
    }).then(function (response){
        $scope.months = response.data;
        if($scope.months != "NO INFO"){
            $scope.months.splice(0,0,{
                mes: 'Resumen',
                mes_id: '2017'
            });
        } 
     }, function (response){});

     


    /*var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Enero", "Febrero", "Marzo", "Abril"],
            datasets: [{
                label: "Administración",
                backgroundColor:'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                data: [90, 89, 83, 95],
                fill: false
            },{
                label: "Ventas",
                backgroundColor:'rgba(150, 255, 50, 0.2)',
                borderColor: 'rgba(150, 255, 50, 0.2)',
                data: [93, 90, 92, 85],
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Gráfica general'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display:true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    },
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    },
                    gridLines: {
                        display: false
                    }
                }],
            },
        }
    });*/
}

HomeController.$inject = ['$scope','$location','$http'];