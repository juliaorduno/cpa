'use strict';
angular
    .module('cpaApp')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'views/login/login.html',
                controller: 'LoginController'
            })
            .when('/indicadores', {
                templateUrl: 'views/catalogue/catalogue.html',
                controller: 'CatalogueController'
            })
            .when('/penalizaciones', {
                templateUrl: 'views/modifiers/modifiers.html',
                controller: 'ModifierController'
            })
            .when('/puntos_extras', {
                templateUrl: 'views/modifiers/modifiers.html',
                controller: 'ModifierController'
            })
            .when('/boleta',{
                templateUrl: 'views/reportcard/reportcard.html',
                controller: 'ReportController'
            })
            .when('/colaboradores',{
                templateUrl: 'views/collaborators/collaborators.html',
                controller: 'CollaboratorsController'
            })
            .when('/perfil/:id/:name',{
                templateUrl: 'views/profile/profile.html',
                controller: 'ProfileController'
            })
            .when('/',{
                templateUrl: 'views/home/home.html',
                controller: 'HomeController'
            });
    }]);