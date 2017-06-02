'use strict';
angular
    .module('cpaApp')
    .controller('CatalogueController', CatalogueController);


function CatalogueController($scope,$location,$http) {
    $(document).ready(function() {
        $('.modal').modal();
        $('select').material_select();
    });

    $(function () {
        var unit = $('#unit').materialize_autocomplete({
            multiple: {
                enable: false
            },
            dropdown: {
                el: '#unit-dropdown'
            }
        });

        var frequency = $('#frequency').materialize_autocomplete({
            multiple: {
                enable: false
            },
            dropdown: {
                el: '#frequency-dropdown'
            }
        });

        var source = $('#source').materialize_autocomplete({
            multiple: {
                enable: false
            },
            dropdown: {
                el: '#source-dropdown'
            }
        });

        var resultCache = {
            'A': [
                {
                    id: 'Abe',
                    text: 'Abe'
                },
                {
                    id: 'Ari',
                    text: 'Ari'
                }
            ],
            'B': [
                {
                    id: 'Baz',
                    text: 'Baz'
                }
            ],
            'BA': [
                {
                    id: 'Baz',
                    text: 'Baz'
                }
            ],
            'BAZ': [
                {
                    id: 'Baz',
                    text: 'Baz'
                }
            ],
            'AB': [
                {
                    id: 'Abe',
                    text: 'Abe'
                }
            ],
            'ABE': [
                {
                    id: 'Abe',
                    text: 'Abe'
                }
            ],
            'AR': [
                {
                    id: 'Ari',
                    text: 'Ari'
                }
            ],
            'ARI': [
                {
                    id: 'Ari',
                    text: 'Ari'
                }
            ]
        };

        unit.resultCache = resultCache;
        frequency.resultCache = resultCache;
        source.resultCache = resultCache;
    });

    /*$('input#unit').autocomplete({
        data: {
        "Eventos": null,
        "Porcentaje": null,
        "Utilidad": null
        },
        onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        },
    });

    $('input#source').autocomplete({
        data: {
        "Reporte": null,
        "Autoría": null
        },
        onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        },
    });

    $('input#frequency').autocomplete({
        data: {
        "Mensual": null,
        "Trimestral": null,
        "Anual": null
        },
        onAutocomplete: function(val) {
        // Callback function when value is autcompleted.
        },
    });*/
}

CatalogueController.$inject = ['$scope','$location','$http'];