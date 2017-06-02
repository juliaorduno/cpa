'use strict';
angular
    .module('cpaApp')
    .directive('cpanavbar', cpaNavbar);
function cpaNavbar() {
    var directive = {
        replace: true,
        restrict: 'E',
        templateUrl: 'components/navbar/navbar.html'
    };
    return directive;
}