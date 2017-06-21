'use strict';
angular.module('cpaApp', ['ngRoute','ui.materialize'])
    .config(['$locationProvider', '$httpProvider', function ($locationProvider, $httpProvider) {
        $httpProvider
            .defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $locationProvider
            .html5Mode(true);
    }])
    .run(['$rootScope', '$location', function ($rootScope, $location) {
    }]);
