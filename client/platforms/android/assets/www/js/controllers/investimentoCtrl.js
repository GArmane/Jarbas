(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('investimentoController', investimentoController);

    investimentoController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope'];
    function investimentoController(auth, $state, api, $http, $ionicPopup, $scope) {
        var vm = this;

        vm.dados = {};
        
        activate();

        ////////////////

        function activate() {

        }

    }
})();
