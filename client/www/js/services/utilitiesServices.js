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
        
        ////////////////

        function promiseRejection(errorMessage) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ops!',
                template: errorMessage
            });
        }

        function promiseException(errorMessage) {
            console.error(errorMessage);
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ops!',
                template: 'Ocorreu um erro no aplicativo.'
            });
        }

        function apiError(data) {
            console.error(data);
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ops!',
                template: data[0].errorMessage
            });
        }
    }
})();