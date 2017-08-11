(function() {
'use strict';

    angular
        .module('starter.services')
        .service('api', apiService);

    apiService.$inject = [];
    function apiService() {
        this.on = on;
        this.url = url;

        var onState = true;
        var strUrl = 'https://localhost:5001/api/';
        
        ////////////////

        function on(swit) {
            if (swit == null)
                return onState;
            onState = swit;
        }

        function url() {
            return strUrl;
        }
    }
})();