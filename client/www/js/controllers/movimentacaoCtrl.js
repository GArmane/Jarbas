(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('movimentacaoController', movimentacaoController);

    movimentacaoController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope'];
    function movimentacaoController(auth, $state, api, $http, $ionicPopup, $scope) {
        var vm = this;

        vm.dados = {};
        
        activate();

        ////////////////

        function activate() {

        }

    }
})();
