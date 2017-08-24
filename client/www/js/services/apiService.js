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

        var onState = true;
        var strUrl = 'https://localhost:5001/api/';
        var strToken = 'http://localhost:5000/connect/token';
        
        ////////////////

        function available(swit) {
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