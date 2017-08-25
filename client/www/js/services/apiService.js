(function() {
'use strict';

    angular
        .module('starter.services')
        .service('api', apiService);

    apiService.$inject = [];
    function apiService() {
        this.available = available;
        this.url = url;
        this.token = token;

        var strUrl = 'http://localhost:5001/api/';
        var strToken = 'http://localhost:5000/connect/token';
        
        ////////////////

        function available() {
            /// TODO: Consulta se a API está acessível
        }

        function url() {
            return strUrl;
        }

        function token() {
            return strToken;
        }
    }
})();