var loadingScreen = {
    loadingService: {},
    counter: 0,
    avoid: false,
    ready: false
};
window.loadingScreen = loadingScreen;

(function() {
    'use strict';

    angular
        .module('starter.services')
        .config(provider)
        .factory('loadingInterceptor', interceptor);

    function provider($httpProvider) {
        $httpProvider.interceptors.push('loadingInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            if (loadingScreen.ready && !loadingScreen.avoid) {
                if (loadingScreen.counter == 0)
                    loadingScreen.loadingService.show();
                loadingScreen.counter++;
            }
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    }
    
    interceptor.$inject = ['$q'];
    function interceptor($q) {
        return {
            'response': function (response) {
                if (loadingScreen.ready && !loadingScreen.avoid) {
                    if (loadingScreen.counter <= 1) {
                        loadingScreen.loadingService.hide();
                        loadingScreen.counter = 0;
                    } else
                        loadingScreen.counter--;
                }
                return response;
            },
            'responseError': function (response) {

                console.log(response);
                if (loadingScreen.ready && !loadingScreen.avoid) {
                    if (loadingScreen.counter <= 1) {
                        loadingScreen.loadingService.hide();
                        loadingScreen.counter = 0;
                    } else
                        loadingScreen.counter--;
                }
                return $q.reject(response);
            }

            
        };
    }
})();