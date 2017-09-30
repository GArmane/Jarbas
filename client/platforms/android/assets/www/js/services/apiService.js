(function() {
'use strict';

    angular
        .module('starter.services')
        .service('api', apiService);

    apiService.$inject = ['utilities'];
    function apiService(utilities) {
        this.available = available;
        this.url = url;
        this.token = token;

        var webUrl = 'http://localhost:5001/api/';
        var webToken = 'http://localhost:5000/connect/token';

        var appUrl = 'http://servertcc.azurewebsites.net/api/';
        var appToken = 'http://identityservertcc.azurewebsites.net/connect/token';
        
        ////////////////

        function available() {
            /// TODO: Consulta se a API está acessível
        }

        function url() {
            return utilities.isApp() ? appUrl : webUrl;
        }

        function token() {
            return utilities.isApp() ? appToken : webToken;
        }
    }
})();