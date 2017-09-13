(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('movimentacaoController', movimentacaoController);

    movimentacaoController.$inject = ['auth', '$state', '$stateParams', 'api', '$http', '$ionicPopup', 'utilities'];
    function movimentacaoController(auth, $state, $stateParams, api, $http, $ionicPopup, utilities) {
        var vm = this;

        vm.dados = {};
        vm.contas = [];
        vm.contasTransf = [];
        vm.grupos = [];
        vm.moedas = [];
        vm.alteracao = false;
        vm.contaDestinoId = 0;
        vm.contaSelecionada = {};
        
        var transferenciaOriginal = {};

        vm.salvar = salvar;
        vm.alterar = alterar;
        vm.excluir = excluir;
        vm.listaContaTransf = listaContaTransf;
        
        activate();

        ////////////////

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
            vm.alteracao = !!$stateParams.id;
        }

        //////////////// Public

        function salvar() {
            if (vm.dados.tipoMovimentacao == 2) {
                var transf = {
                    despesa: JSON.parse(JSON.stringify(vm.dados)),
                    receita: JSON.parse(JSON.stringify(vm.dados))
                };
                transf.despesa.tipoMovimentacao = 1;
                transf.receita.contaContabilId = vm.contaDestinoId;
                transf.receita.tipoMovimentacao = 0;

                $http({
                    url: api.url() + 'Movimentacoes/Transferencia/',
                    method: 'POST',
                    data: transf,
                    headers: auth.header
                }).success(function (data) {
                    history.back();
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Movimentação inserida.'
                    });
                }).error(utilities.apiError);
            } else {
                $http({
                    url: api.url() + 'Movimentacoes/',
                    method: 'POST',
                    data: vm.dados,
                    headers: auth.header
                }).success(function (data) {
                    history.back();
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Movimentação inserida.'
                    });
                }).error(utilities.apiError);
            }
        }

        function alterar() {
            if (vm.dados.tipoMovimentacao == 2) {
                var transf = {
                    despesa: JSON.parse(JSON.stringify(vm.dados)),
                    receita: JSON.parse(JSON.stringify(vm.dados))
                };
                transf.id = transferenciaOriginal.id;
                transf.despesa.id = transferenciaOriginal.despesa.id;
                transf.despesa.tipoMovimentacao = 1;
                transf.receita.id = transferenciaOriginal.receita.id;
                transf.receita.contaContabilId = vm.contaDestinoId;
                transf.receita.tipoMovimentacao = 0;

                $http({
                    url: api.url() + 'Movimentacoes/Transferencia/' + transf.id,
                    method: 'PUT',
                    data: transf,
                    headers: auth.header
                }).success(function (data) {
                    history.back();
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Movimentação alterada.'
                    });
                }).error(utilities.apiError);
            } else {
                $http({
                    url: api.url() + 'Movimentacoes/' + vm.dados.id,
                    method: 'PUT',
                    data: vm.dados,
                    headers: auth.header
                }).success(function (data) {
                    history.back();
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Movimentação alterada.'
                    });
                }).error(utilities.apiError);
            }
        }

        function excluir() {
            $ionicPopup.confirm({
                title: 'Excluir movimentação',
                template: 'Tem certeza que deseja excluir a movimentação ' + vm.dados.descricao + '?'
            }).then(function (res) {
                if (res)
                    $http({
                        method: 'DELETE',
                        url: api.url() + 'Movimentacoes/' + vm.dados.id,
                        headers: auth.header
                    }).success(function () {
                        history.back();
                        $ionicPopup.alert({
                            title: 'Sucesso!',
                            template: 'Movimentação excluída.'
                        });
                    }).error(utilities.apiError);
            });
        }

        function listaContaTransf() {
            vm.contasTransf = [];
            if (vm.contaSelecionada.id) {
                vm.dados.contaContabilId = vm.contaSelecionada.id;
                vm.contas.forEach(function(conta) {
                    if (conta.id != vm.dados.contaContabilId)
                        vm.contasTransf.push(conta);
                }, this);
                if (vm.contasTransf.length > 0)
                    vm.contaDestinoId = vm.contasTransf[0].id;
            }
        }

        //////////////// Private

        function carregarDados() {
            if ($stateParams.id && $stateParams.transf == 'true')
                $http({
                    url: api.url() + 'Movimentacoes/Transferencia/' + $stateParams.id,
                    method: 'GET',
                    headers: auth.header
                }).success(function (data) {
                    vm.dados = data.despesa;
                    transferenciaOriginal = data;
                    vm.dados.tipoMovimentacao = 2;
                    vm.contaDestinoId = data.receita.contaContabilId;
                    vm.dados.data = new Date(vm.dados.data);
                    associaConta();
                    listaContaTransf();
                }).error(utilities.apiError);
            else if ($stateParams.id)
                $http({
                    url: api.url() + 'Movimentacoes/' + $stateParams.id,
                    method: 'GET',
                    headers: auth.header
                }).success(function (data) {
                    vm.dados = data;
                    vm.dados.data = new Date(vm.dados.data);
                    associaConta();
                }).error(utilities.apiError);
            $http({
                url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.contas = data;
                if (vm.contas && vm.contas.length > 0 && !$stateParams.id) {
                    vm.contaSelecionada = vm.contas[0];
                    vm.dados.contaContabilId = vm.contaSelecionada.id;
                } else
                    associaConta();
            }).error(utilities.apiError);
            $http({
                url: api.url() + 'GrupoMovimentacoes/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.grupos = data;
                if (vm.grupos && vm.grupos.length > 0 && !$stateParams.id)
                    vm.dados.grupoMovimentacoesId = vm.grupos[0].id;
            }).error(utilities.apiError);
            $http({
                method: 'GET',
                url: api.url() + 'Moedas',
                headers: auth.header
            }).success(function (data) {
                vm.moedas = data;
            }).error(utilities.apiError);
        }

        function associaConta() {
            if (vm.dados.contaContabilId && vm.contas.length > 0) {
                vm.contaSelecionada = vm.contas.find(function (conta) {
                    return conta.id == vm.dados.contaContabilId;
                });
            }
        }
    }
})();
