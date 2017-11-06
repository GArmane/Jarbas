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

        var moedas = [];
        
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
            if (utilities.online()) {
                $http({
                    url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                    method: 'GET',
                    headers: auth.header
                }).success(function (data) {
                    localEntities.refresh(JSON.parse(JSON.stringify(data)));
                    vm.dados.contas = data;
                    associaContaMov();
                }).error(utilities.apiError);
                $http({
                    url: api.url() + 'Movimentacoes/Usuario/' + auth.id,
                    method: 'GET',
                    headers: auth.header
                }).success(function (data) {
                    localEntities.refresh(JSON.parse(JSON.stringify(data.transferencias)));
                    localEntities.refresh(JSON.parse(JSON.stringify(data.movimentacoes)));
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
                    localEntities.refresh(JSON.parse(JSON.stringify(data)));
                    vm.grupos = data;
                    associaGrupoMov();
                }).error(utilities.apiError);
            } else {
                localEntities.getAll('ContaContabil').then(function (data) {
                    vm.dados.contas = data;
                    associaContaMov();
                    associaContaMoeda();
                });
                localEntities.getAll('Moeda').then(function (data) {
                    moedas = data;
                    associaContaMoeda();
                });
                localEntities.getAll('Movimentacao').then(function (data) {
                    vm.dados.movimentacoes = data;
                    vm.movimentacoes = {
                        movimentacoes: data
                    };
                    localEntities.getAll('Transferencia').then(function (data) {
                        vm.movimentacoes.transferencias = data;
                        data.forEach(function(transf) {
                            for (var i = 0; i < vm.dados.movimentacoes.length; i++) {
                                var mov = vm.dados.movimentacoes[i];
                                if (transf.receitaId == mov.id || transf.despesaId == mov.id) {
                                    if (transf.receitaId == mov.id)
                                        transf.receita = mov;
                                    else
                                        transf.despesa = mov;
                                    vm.dados.movimentacoes.splice(i--, 1);
                                }
                            }
                        }, this);
                        transformaMov();
                        associaContaMov();
                        associaGrupoMov();
                    });
                });
                localEntities.getAll('GrupoMovimentacoes').then(function (data) {
                    vm.grupos = data;
                    associaGrupoMov();
                });
            }
        }
        
        function associaContaMoeda() {
            if (vm.dados.contas.length == 0 || moedas.length == 0)
                return;
            vm.dados.contas.forEach(function(conta) {
                for (var i = 0; i < moedas.length; i++) {
                    var moeda = moedas[i];
                    if (moeda.id == conta.moedaId)
                        conta.moeda = moeda;
                }
            });
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

