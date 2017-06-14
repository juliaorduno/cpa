'use strict';
angular
    .module('cpaApp')
    .controller('CatalogueController', CatalogueController);


function CatalogueController($scope,$location,$http) {
    $(document).ready(function() {
        $('.modal').modal();
        $('select').material_select();
    });

    $('#unit').autocomplete({
        data: {
        "Eventos": null,
        "Porcentaje": null,
        "Utilidad": null
        },
        onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        },
    });

    $('#source').autocomplete({
        data: {
        "Reporte": null,
        "Autoría": null
        },
        onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        },
    });

    $('#frequency').autocomplete({
        data: {
        "Mensual": null,
        "Trimestral": null,
        "Anual": null
        },
        onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        },
    });

    var indicator_id = 1;
    $scope.indicator = {
        indicator_id: indicator_id
    }

    $http({
        url: "db/",
        method: "GET",
        params: {
            request: 0,
            indicator_id: indicator_id
        }
    }).then(function (response){
        $scope.indicator = response.data;
        console.log("Hola");
        console.log($scope.indicator);
    }, function (response){});

    /**
        $scope.lab = {
            lab_id: lab_id,
            lab_image: "default.png",
            lab_name: "Lab"
        }
        $http({
            url: "db/",
            method: "GET",
            params: {
                request: 0,
                lab_id: lab_id
            }
        }).then(function (response) {
            // process response here..
            $scope.lab = response.data;
        }, function (response) {

        });

     */
}

CatalogueController.$inject = ['$scope','$location','$http'];