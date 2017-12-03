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
            if (utilities.online())
                $http({
                    method: 'GET',
                    url: api.url() + 'Investimentos/Usuario/' + auth.id,
                    headers: auth.header
                }).success(function (data) {
                    vm.dados = data;
                }).error(utilities.apiError);
            else {
                localEntities.getAll('Investimento').then(function (data) {
                    data.forEach(function(item) {
                        if (item.tipoInvestimentoId)
                            localEntities.get('TipoInvestimento', item.tipoInvestimentoId).then(function (tipo) {
                                item.tipoInvestimento = tipo;
                            });
                    });
                    localEntities.getAll('Moeda').then(function (moedas) {
                        var moedaId;
                        data.forEach(function(item) {
                            moedaId = item.moedaId;
                            item.moeda = moedas.find(findMoeda);
                        });

                        function findMoeda(moeda) {
                            return moeda.id == moedaId;
                        }
                    });
                    vm.dados = data;
                });
            }
        }
    }
})();
