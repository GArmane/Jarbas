(function() {
    'use strict';

    angular
        .module('starter.services')
        .service('utilities', utilities);

    utilities.$inject = ['$ionicPopup', '$ionicLoading'];
    function utilities($ionicPopup, $ionicLoading) {
        this.promiseRejection = promiseRejection;
        this.promiseException = promiseException;
        this.apiError = apiError;
        this.isApp = isApp;
        this.online = online;
        this.getColor = getColor;

        var _isApp = false;
        var isOnline = true;
        
        var colors = [
            '#3366CC',
            '#DC3912',
            '#FF9900',
            '#109618',
            '#990099',
            '#3B3EAC',
            '#0099C6',
            '#DD4477',
            '#66AA00',
            '#B82E2E',
            '#316395',
            '#994499',
            '#22AA99',
            '#AAAA11',
            '#6633CC',
            '#E67300',
            '#8B0707',
            '#329262',
            '#5574A6',
            '#3B3EAC'
        ];
        var transps = [
            'rgba(51,	102,	204,    0.6)',
            'rgba(220,	57,	    18,     0.6)',
            'rgba(255,	153,	0,      0.6)',
            'rgba(16,	150,	24,     0.6)',
            'rgba(153,	0,	    153,    0.6)',
            'rgba(59,	62,	    172,    0.6)',
            'rgba(0,	153,	198,    0.6)',
            'rgba(221,	68,	    119,    0.6)',
            'rgba(102,	170,	0,      0.6)',
            'rgba(184,	46,	    46,     0.6)',
            'rgba(49,	99,	    149,    0.6)',
            'rgba(153,	68,	    153,    0.6)',
            'rgba(34,	170,	153,    0.6)',
            'rgba(170,	170,	17,     0.6)',
            'rgba(102,	51,	    204,    0.6)',
            'rgba(230,	115,	0,      0.6)',
            'rgba(139,	7,	    7,      0.6)',
            'rgba(50,	146,	98,     0.6)',
            'rgba(85,	116,	166,    0.6)',
            'rgba(59,	62,	    172,    0.6)'
        ];

        activate();

        ////////////////

        function activate() {
            // window.defineExceptionHandler(function () {
            //     promiseException('Exceção global capturada!');
            // });
            _isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        }

        function promiseRejection(errorMessage) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ops!',
                template: errorMessage
            });
        }

        function promiseException(errorMessage) {
            console.error('JARBAS - ' + errorMessage);
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ops!',
                template: 'Ocorreu um erro no aplicativo: ' + errorMessage
            });
        }

        function apiError(data) {
            try {
                console.error(data);
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data[0].errorMessage
                });
            } catch (error) {
                promiseException(error);
            }
        }

        function isApp() {
            return _isApp;
        }

        function online() {
            return isOnline && navigator.onLine;
        }

        function getColor(i, transp) {
            if (transp)
                return transps[i];
            return colors[i % 20];
        }
    }
})();