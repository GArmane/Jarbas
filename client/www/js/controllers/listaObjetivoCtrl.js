(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('listaObjetivoController', listaObjetivoController);

    listaObjetivoController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$timeout', 'utilities'];

    function listaObjetivoController(auth, $state, api, $http, $ionicPopup, $scope, $timeout, utilities) {
        var vm = this;

        vm.dados = [];
        vm.moedas = [];
        vm.showArq = false;
        vm.temArq = false;

        vm.ocultaArq = ocultaArq;

        activate();

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
        }

        //////////////// Public

        function ocultaArq(obj) {
            vm.temArq = vm.temArq || obj.arquivar;
            return !obj.arquivar || vm.showArq;
        }
        
        //////////////// Private

        function carregarDados() {
            if (utilities.online()) {
                $http({
                    method: 'GET',
                    url: api.url() + 'Objetivos/Usuario/' + auth.id,
                    headers: auth.header
                }).success(success).error(utilities.apiError);
                $http({
                    method: 'GET',
                    url: api.url() + 'Moedas',
                    headers: auth.header
                }).success(successMoeda).error(utilities.apiError);
            } else {
                localEntities.getAll('Objetivo').then(success);
                localEntities.getAll('Moeda').then(successMoeda);
            }

            function success(data) {
                vm.dados = data;
                successMoeda();
                vm.dados.forEach(function(obj) {
                    if (obj.dataInicial)
                        obj.dataInicial = new Date(obj.dataInicial);
                }, this);
            }

            function successMoeda(data) {
                if(data)
                    vm.moedas = data;
                if (vm.dados.length == 0 && vm.moedas.length == 0)
                    return;

                vm.dados.forEach(function(obj) {
                    obj.moeda = vm.moedas.find(function (moeda) {
                        return moeda.id == obj.moedaId;
                    })
                }, this);
            }
        }
    }
})();
