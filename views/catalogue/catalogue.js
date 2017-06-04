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
}

CatalogueController.$inject = ['$scope','$location','$http'];