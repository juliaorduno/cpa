'use strict';
angular
    .module('cpaApp')
    .controller('DashController', DashController);

function DashController($scope,$location,$http) {
    $scope.print = function(){
        var doc = new jsPDF();

        doc.text('Hello world!', 10, 10);
        doc.save('a4.pdf');
    }
}

DashController.$inject = ['$scope','$location','$http'];