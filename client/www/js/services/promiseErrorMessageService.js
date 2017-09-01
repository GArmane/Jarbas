(function() {
    'use strict';

    angular
        .module('starter.services')
        .service('promiseError', promiseError);

    promiseError.$inject = ['$ionicPopup', '$ionicLoading'];
    function promiseError($ionicPopup, $ionicLoading) {
        this.rejection = rejection;
        this.exception = exception;
        
        ////////////////

        function rejection(errorMessage) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ops!',
                template: errorMessage
            });
        }

        function exception(errorMessage) {
            console.error(errorMessage);
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ops!',
                template: 'Ocorreu um erro no aplicativo.'
            });
        }
    }
})();