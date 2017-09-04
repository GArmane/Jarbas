(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('perfilController', perfilController);

    perfilController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope'];
    function perfilController(auth, $state, api, $http, $ionicPopup, $scope) {
        var vm = this;

        vm.dados = {
            MoedaId: 0,
            Valor: 0,
            RendaFixa: true,
            Profissao: 0,
            FaixaEtaria: 0,
            EscalaTempo: 0
        };
        vm.faixaEtariaLista = [];
        vm.profissaoLista = [];
        vm.moedaLista = [];
        vm.tipoRendaLista = [
            { id: 0, name: 'Diário' },
            { id: 1, name: 'Semanal' },
            { id: 2, name: 'Quinzenal' },
            { id: 3, name: 'Mensal' },
            { id: 4, name: 'Anual' }
        ];

        vm.cadastrar = cadastrar;
        vm.tooltipRenda = tooltipRenda;

        activate();

        ////////////////

        function activate() {

        }

        function cadastrar() {
            $http({
                url: api.url() + 'cadastro...', /// TODO: Coloca a URL real daqui
                method: 'POST',
                data: vm.dados
            }).success(function (data) {
                // LoginService.defineAuth(data); /// TODO: Vê essa fita ai parça
                $state.go('app.principal'); /// TODO: principal? acho que não
            }).error(utilities.apiError);
        }

        function tooltipRenda() {
            /// TODO: Quando resolver o tooltip do login, resolve aqui também
        }
    }
})();
