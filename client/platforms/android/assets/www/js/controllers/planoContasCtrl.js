(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('planoContasController', planoContasController);

    planoContasController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope'];
    function planoContasController(auth, $state, api, $http, $ionicPopup, $scope) {
        var vm = this;

        vm.dados = {};
        
        activate();

        ////////////////

        function activate() {

        }

    }
})();
