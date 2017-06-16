'use strict';
angular
    .module('cpaApp')
    .controller('HomeController', HomeController);


function HomeController($scope,$location,$http) {
    var ctx = document.getElementById("myChart").getContext('2d');
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
    });
}

HomeController.$inject = ['$scope','$location','$http'];