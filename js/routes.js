'use strict';
angular
    .module('cpaApp')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'views/login/login.html',
                controller: 'LoginController'
            })
            .when('/catalogue', {
                templateUrl: 'views/catalogue/catalogue.html',
                controller: 'CatalogueController'
            })
            .when('/report',{
                templateUrl: 'views/reportcard/reportcard.html',
                controller: 'ReportController'
            })
            .when('/collaborators',{
                templateUrl: 'views/collaborators/collaborators.html',
                controller: 'CollaboratorsController'
            });
    }]);