'use strict';
angular
    .module('cpaApp')
    .directive('cpasidenav', cpaSidenav);

function cpaSidenav($http, $rootScope) {
    var directive = {
        link: link,
        replace: true,
        restrict: 'E',
        templateUrl: 'components/sidenav/sidenav.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.user = JSON.parse(localStorage.getItem('user'));
        scope.menuItems = [];
        scope.dropdownItems = [];
        scope.dropdownButton = '';

        $rootScope.areas = [{
            area: 'Calidad/Operaciones',
            id: '1'
        },{
            area: 'Productividad/Comercial',
            id: '2'
        },{
            area: 'Rentabilidad/Administración',
            id: '3'
        },{
            area: 'Penalizaciones',
            id: '4'
        },{
            area: 'Puntos Extras',
            id: '5'
        }];


        if(scope.user.rol === 'gerente'){
            scope.department = JSON.parse(localStorage.getItem('department'));
            scope.role = 'Gerente de ' + scope.department.departamento;

            scope.menuItems = [{
                item: 'Inicio',
                ref: '/cpa/',
                pclass: '',
                activates: ''
            },{
                item: 'Colaboradores',
                ref: '/cpa/colaboradores',
                pclass: '',
                activates: ''
            }];

            scope.dropdownButton = 'Catálogos';
            scope.dropdownItems = [{
                item: 'Indicadores',
                ref: '/cpa/indicadores'
            },{
                item: 'Penalizaciones',
                ref: '/cpa/penalizaciones'
            },{
                item: 'Puntos Extras',
                ref: '/cpa/puntos_extras'
            }];

        } else{
            scope.role = scope.user.rol;
            scope.menuItems = [{
                item: 'Inicio',
                ref: '/cpa/',
                pclass: '',
                activates: ''
            }];

            scope.dropdownButton = 'Departamentos';
            scope.dropdownItems = [{
                item: 'Administración',
                ref: '/cpa/'
            },{
                item: 'Desarrollo',
                ref: '/cpa/'
            },{
                item: 'Soporte',
                ref: '/cpa/'
            },{
                item: 'Ventas',
                ref: '/cpa/'
            }];
        }

       $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
            }
        );
    }
}

cpaSidenav.$inject = ['$http', '$rootScope'];