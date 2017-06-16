'use strict';
angular
    .module('cpaApp')
    .directive('cpasidenav', cpaSidenav);

function cpaSidenav() {
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

        if(scope.user.rol === 'gerente'){
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
            scope.dropdownItems = ['Indicadores','Penalizaciones','Puntos Extras'];

        } else{
            scope.menuItems = [{
                item: 'Inicio',
                ref: '/cpa/',
                pclass: '',
                activates: ''
            }];

            scope.dropdownButton = 'Departamentos';
            scope.dropdownItems = ['Administración','Desarrollo','Soporte','Ventas'];
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
