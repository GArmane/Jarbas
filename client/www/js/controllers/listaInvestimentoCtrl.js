(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('listaInvestimentoController', listaInvestimentoController);

    listaInvestimentoController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$timeout', 'utilities'];

    function listaInvestimentoController(auth, $state, api, $http, $ionicPopup, $scope, $timeout, utilities) {
        var vm = this;

        vm.dados = [];

        activate();

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
        }

        //////////////// Public

        
        //////////////// Private

        function carregarDados() {
            $http({
                method: 'GET',
                url: api.url() + 'Investimentos/Usuario/' + auth.id,
                headers: auth.header
            }).success(function (data) {
                vm.dados = data;
            }).error(utilities.apiError);
        }
    }
})();
