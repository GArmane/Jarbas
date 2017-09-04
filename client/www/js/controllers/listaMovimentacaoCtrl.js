(function() {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('listaMovimentacaoController', listaMovimentacaoController);

    listaMovimentacaoController.$inject = ['auth', 'api', '$http', '$ionicPopup', 'utilities'];
    function listaMovimentacaoController(auth, api, $http, $ionicPopup, utilities) {
        var vm = this;
        
        vm.movimentacoes = []; // Tem todas as movimentações
        vm.dados = vm.movimentacoes; // Tem as movimentações exibidas na tela
        vm.contas = [];
        vm.grupos = [];

        vm.filtro1 = {
            semFiltro: { nome: 'Sem filtro', id: 0 },
            conta: { nome: 'Conta', id: 1 },
            grupo: { nome: 'Grupo', id: 2 }
        };
        vm.filtro1Lista = [
            vm.filtro1.semFiltro,
            vm.filtro1.conta,
            vm.filtro1.grupo
        ];
        vm.filtro1Selected = vm.filtro1Lista[0];
        vm.filtro2Lista = [];
        vm.filtro2Selected = null;

        vm.filtro1Changed = filtro1Changed;
        vm.filtro2Changed = filtro2Changed;

        activate();

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
        }

        //////////////// Public

        function filtro1Changed() {
            vm.dados = vm.movimentacoes;
            if (vm.filtro1Selected == vm.filtro1.conta) {
                vm.filtro2Lista = vm.contas;
                vm.filtro2Selected = vm.filtro2Lista[0];
            } else if (vm.filtro1Selected == vm.filtro1.grupo) {
                vm.filtro2Lista = vm.grupos;
                vm.filtro2Selected = vm.filtro2Lista[0];
            }
        }

        function filtro2Changed() {
            if (vm.filtro2Selected.nome == 'Sem filtro') {
                vm.dados = vm.movimentacoes;
            } else {
                if (vm.filtro1Selected == vm.filtro1.conta) {
                    vm.dados = [];
                    vm.movimentacoes.forEach(function(mov) {
                        if (mov.contaContabil.id == vm.filtro2Selected.id)
                            vm.dados.push(mov);
                    });
                } else if (vm.filtro1Selected == vm.filtro1.grupo) {
                    vm.dados = [];
                    vm.movimentacoes.forEach(function(mov) {
                        if (mov.GrupoMovimentacoes.id == vm.filtro2Selected.id)
                            vm.dados.push(mov);
                    });
                }
            }
        }

        //////////////// Private

        function carregarDados() {
            $http({
                url: api.url() + 'Movimentacoes/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.dados = data;
                vm.movimentacoes = data;
            }).error(utilities.apiError);
            $http({
                url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.contas = data;
                vm.contas.unshift({ nome: 'Sem filtro' });
                associaContaMov();
            }).error(utilities.apiError);
            $http({
                url: api.url() + 'GrupoMovimentacoes/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.grupos = data;
                vm.grupos.unshift({ nome: 'Sem filtro' });
                associaContaMov();
            }).error(utilities.apiError);
        }

        function associaContaMov() {
            if (vm.movimentacoes.length == 0 || vm.contas.length == 0)
                return;
            vm.movimentacoes.forEach(function(mov) {
                for (var i = 0; i < vm.contas.length; i++) {
                    var conta = vm.contas[i];
                    if (conta.id == mov.contaContabilId)
                        mov.contaContabil = conta;
                }
            }, this);
        }
    }
})();
