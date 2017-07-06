'use strict';
angular
    .module('cpaApp')
    .directive('cpanavbar', cpaNavbar);
function cpaNavbar() {
    var directive = {
        replace: true,
        link: link,
        restrict: 'E',
        templateUrl: 'components/navbar/navbar.html'
    };
    return directive;

    function link(scope, element, attrs, location) {
        scope.logout = function(){
            localStorage.setItem('user', null);
            $location.path('/');
        }
    }
}