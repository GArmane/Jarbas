(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('objetivoController', objetivoController);

    objetivoController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope'];
    function objetivoController(auth, $state, api, $http, $ionicPopup, $scope) {
        var vm = this;

        vm.dados = {};
        
        activate();

        ////////////////

        function activate() {

        }

    }
})();
