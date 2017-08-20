(function() {
    'use strict';

    angular
        .module('starter.services')
        .service('promiseError', promiseError);

    promiseError.$inject = ['$ionicPopup'];
    function promiseError($ionicPopup) {
        this.rejection = rejection;
        this.exception = exception;
        
        ////////////////

        function rejection(errorMessage) {
            $ionicPopup.alert({
                title: 'Ops!',
                template: errorMessage
            });
        }

        function exception(errorMessage) {
            console.error(errorMessage);
            $ionicPopup.alert({
                title: 'Ops!',
                template: 'Ocorreu um erro no aplicativo.'
            });
        }
    }
})();