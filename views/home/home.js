'use strict';
angular
    .module('cpaApp')
    .controller('HomeController', HomeController);

function HomeController($scope,$location,$http,$routeParams,$rootScope) {
    $scope.user = JSON.parse(localStorage.getItem('user'));
    $scope.months = [];
    $scope.currentTab = {tab: '2017'};
    $scope.resumeData = [];
    $scope.remaining = [];
    $scope.currentMonth = {};
    $scope.dataLoaded = {load:false}
    Chart.defaults.global.defaultFontFamily = "Roboto";
    Chart.defaults.global.defaultFontSize = 14;
    var chart = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Promedio',
                    borderColor: 'rgba(0, 0, 173, 0.2)',
                    backgroundColor: 'rgba(0, 0, 173, 0.2)',
                    data: [],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: false,
                    text: 'Gráfica del progreso anual'
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
                            labelString: 'Mes'
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Calificación'
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                },
            }
    }

    $scope.newReport = function(collaborator){
        localStorage.setItem('currentMonth', JSON.stringify($scope.currentMonth));
        collaborator["mes"] = $scope.currentMonth.mes;
        localStorage.setItem('current', JSON.stringify(collaborator));
        $location.path('boleta/'+ collaborator.empleado_id + '/' + collaborator.nombre + '/' + $scope.currentMonth.mes);
    }

    $scope.remainingCollabs = function(month){
        $scope.currentMonth = month;
        $http({
            url: 'db/connection.php',
            method: 'GET',
            params: {
                department_id: $scope.department.departamento_id,
                month_id: $scope.currentMonth.mes_id,
                request: 39
            }
        }).then(function(response){
            $scope.remaining = response.data;
            }, function(response){});
    }

    var getGraph = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                request: 40,
                department_id: $scope.department.departamento_id
            }
        }).then(function (response){
            var data = response.data;
            var l = data.length;
            for(var i=0; i<l; i++){
                chart.data.labels.push(data[i]['mes']);
                chart.data.datasets[0].data.push(numeral(data[i]['promedio']).format('0.00'));
            }
            var ctx = document.getElementById("myChart").getContext('2d');
            var myChart = new Chart(ctx, chart);
            $scope.dataLoaded.load = true;
        }, function (response){});
        
    }

    var getResumeData = function(){
        $http({
            url: "db/connection.php",
            method: "GET",
            params: {
                request: 34,
                department_id: $scope.department.departamento_id
            }
        }).then(function (response){
            $scope.resumeData = response.data;
            var l = $scope.resumeData.length;
            for(var i=0; i<l; i++){
                $scope.resumeData[i]['parcial'] = numeral($scope.resumeData[i]['parcial']).format('0.00');
                $scope.resumeData[i]['final'] = numeral($scope.resumeData[i]['final']).format('0.00');
                $scope.resumeData[i]['penalizaciones'] = numeral($scope.resumeData[i]['penalizaciones']).format('0.00');
                $scope.resumeData[i]['puntos_extras'] = numeral($scope.resumeData[i]['puntos_extras']).format('0.00');
            }
            getGraph();
        }, function (response){});
    }

    if(localStorage.getItem('user') === null){
       $location.path("/login");
    }

    if($scope.user.rol === 'gerente'){
        $scope.$on('someEvent', function(e) {
            $scope.department = JSON.parse(localStorage.getItem('department'));
            getResumeData();
        });
        
    } else{
        if($location.path() !== '/'){
            $http({
                url: 'db/connection.php',//sidenav
                method: 'GET',
                params: {
                    department: $routeParams.department,
                    request: 35
                }
            }).then(function(response){
                localStorage.setItem('department', JSON.stringify(response.data));
                $scope.department = response.data;
                $scope.$broadcast ('someEvent');
                getResumeData(); 
                
            }, function(response){});
        }
    }

    $http({
        url: "db/connection.php",
        method: "GET",
        params: {
            request: 33
        }
    }).then(function (response){
        $scope.months = response.data;
        $scope.dataLoaded.load = true;
        if($scope.months != "NO INFO"){
            $scope.months.splice(0,0,{
                mes: 'Resumen',
                mes_id: '2017'
            });
        } 
     }, function (response){});

    

}

HomeController.$inject = ['$scope','$location','$http','$routeParams','$rootScope'];