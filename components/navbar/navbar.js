'use strict';
angular
    .module('cpaApp')
    .directive('cpanavbar', cpaNavbar);

function cpaNavbar($window, $location) {
    var directive = {
        replace: true,
        link: link,
        restrict: 'E',
        templateUrl: 'components/navbar/navbar.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.logout = function(){
            $window.localStorage.clear();
            $location.path('/login');
        }
    }
}

cpaNavbar.$inject = ['$window', '$location'];