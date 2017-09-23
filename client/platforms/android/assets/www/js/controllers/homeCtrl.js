(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('homeController', homeController);

    homeController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$ionicLoading', 'utilities', '$ionicHistory'];
    function homeController(auth, $state, api, $http, $ionicPopup, $scope, $ionicLoading, utilities, $ionicHistory) {
        var vm = this;

        vm.dados = {};
        vm.dados.contas = [];
        vm.dados.movimentacoes = [];
        vm.movimentacoes = [];
        vm.grupos = [];
        
        vm.tooltipAjuda = tooltipAjuda;

        activate();

        function activate() {
            $ionicLoading.hide();
            if (!auth.verify())
                return;
            carregarDados();

            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
        }

        //////////////// Public

        function tooltipAjuda() {
            
        }

        //////////////// Private

        function carregarDados() {
            $http({
                url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.dados.contas = data;
                associaContaMov();
            }).error(utilities.apiError);
            $http({
                url: api.url() + 'Movimentacoes/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.dados.movimentacoes = data.movimentacoes;
                vm.movimentacoes = data;
                transformaMov();
                associaContaMov();
                associaGrupoMov();
            }).error(utilities.apiError);
            $http({
                url: api.url() + 'GrupoMovimentacoes/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.grupos = data;
                associaGrupoMov();
            }).error(utilities.apiError);
        }

        function associaGrupoMov() {
            if (vm.dados.movimentacoes.length == 0 || vm.grupos.length == 0)
                return;
            vm.dados.movimentacoes.forEach(function(mov) {
                for (var i = 0; i < vm.grupos.length; i++) {
                    var grupo = vm.grupos[i];
                    if (grupo.id == mov.grupoMovimentacoesId)
                        mov.grupoMovimentacoes = grupo;
                }
            });
        }

        function associaContaMov() {
            if (vm.dados.movimentacoes.length == 0 || vm.dados.contas.length == 0)
                return;
            vm.dados.movimentacoes.forEach(function(mov) {
                for (var i = 0; i < vm.dados.contas.length; i++) {
                    var conta = vm.dados.contas[i];
                    if (conta.id == mov.contaContabilId)
                        mov.contaContabil = conta;
                    if (mov.tipoMovimentacao == 2 && conta.id == mov.contaDestinoId)
                        mov.contaDestino = conta;
                }
            });
        }

        function transformaMov() {
            var transfs = vm.movimentacoes.transferencias;
            vm.dados.movimentacoes = vm.movimentacoes.movimentacoes;
            transfs.forEach(function(tr) {
                var transf = tr.despesa;
                transf.id = tr.id;
                transf.contaDestinoId = tr.receita.contaContabilId;
                transf.tipoMovimentacao = 2;
                vm.dados.movimentacoes.push(transf);
            });
            vm.dados.movimentacoes.forEach(function (mov) {
                mov.data = new Date(mov.data);
            });
            vm.dados.movimentacoes.sort(function (a, b) {
                a.data.getTime() - b.data.getTime();
            });
        }
    }
})();

