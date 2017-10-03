(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('movimentacaoController', movimentacaoController);

    movimentacaoController.$inject = ['auth', '$state', '$stateParams', 'api', '$http', '$ionicPopup', 'utilities', '$scope'];

    function movimentacaoController(auth, $state, $stateParams, api, $http, $ionicPopup, utilities, $scope) {
        var vm = this;

        vm.dados = {};
        vm.dados.agendamento = {};
        vm.dados.agendamento.diasSemana = [];
        vm.contas = [];
        vm.contasTransf = [];
        vm.grupos = [];
        vm.alteracao = false;
        vm.originalTransf = false;
        vm.contaDestino = {};
        vm.contaSelecionada = {};
        vm.escalaTempo = [
            { name: 'Diário', id: 0 },
            { name: 'Semanal', id: 1 },
            { name: 'Mensal', id: 3 },
            { name: 'Anual', id: 4 },
            { name: 'Personalizado', id: 5 }
        ];
        vm.escalaEnum = {
            diario: 0,
            semanal: 1,
            mensal: 3,
            anual: 4,
            personalizado: 5
        };
        vm.diaSemana = {
            domingo: 0,
            segunda: 1,
            terca:   2,
            quarta:  3,
            quinta:  4,
            sexta:   5,
            sabado:  6
        };
        vm.escalaPersonalizada = 0;

        var transferenciaOriginal = {};

        vm.salvar = salvar;
        vm.alterar = alterar;
        vm.excluir = excluir;
        vm.listaContaTransf = listaContaTransf;
        vm.personalizar = personalizar;
        vm.diaSemanaSelecionado = diaSemanaSelecionado;
        vm.selecionarDiaSemana = selecionarDiaSemana;
        vm.setarRepeticaoMensal = setarRepeticaoMensal;
        vm.cancelar = cancelar;
        vm.resetarAgendamento = resetarAgendamento;

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
            agendamentoSalvar();
            if (vm.dados.tipoMovimentacao == 2) {
                var transf = {
                    despesa: JSON.parse(JSON.stringify(vm.dados)),
                    receita: JSON.parse(JSON.stringify(vm.dados))
                };
                transf.despesa.tipoMovimentacao = 1;
                transf.receita.contaContabilId = vm.contaDestino.id;
                transf.receita.tipoMovimentacao = 0;
                transf.receita.valor = (transf.despesa.valor * vm.contaSelecionada.moeda.cotacaoComercial) / vm.contaDestino.moeda.cotacaoComercial;

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
                }).error(function (data) {
                    utilities.apiError(data);
                    agendamentoCarregado();
                });
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
                }).error(function (data) {
                    agendamentoCarregado();
                    utilities.apiError(data);
                });
            }
        }

        function alterar() {
            agendamentoSalvar();
            if (vm.dados.tipoMovimentacao == 2) {
                var transf = {
                    despesa: JSON.parse(JSON.stringify(vm.dados)),
                    receita: JSON.parse(JSON.stringify(vm.dados))
                };
                transf.id = transferenciaOriginal.id;
                transf.despesa.id = transferenciaOriginal.despesa.id;
                transf.despesa.tipoMovimentacao = 1;
                transf.receita.id = transferenciaOriginal.receita.id;
                transf.receita.contaContabilId = vm.contaDestino.id;
                transf.receita.tipoMovimentacao = 0;
                transf.receita.valor = (transf.despesa.valor * vm.contaSelecionada.moeda.cotacaoComercial) / vm.contaDestino.moeda.cotacaoComercial;

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
                }).error(function (data) {
                    agendamentoCarregado();
                    utilities.apiError(data);
                });
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
                }).error(function (data) {
                    agendamentoCarregado();
                    utilities.apiError(data);
                });
            }
        }

        function excluir() {
            $ionicPopup.confirm({
                title: 'Excluir movimentação',
                template: 'Tem certeza que deseja excluir a movimentação ' + vm.dados.descricao + '?'
            }).then(function (res) {
                if (res) {
                    if (vm.dados.tipoMovimentacao == 2) {
                        $http({
                            method: 'DELETE',
                            url: api.url() + '/Movimentacoes/Transferencia/' + vm.dados.id,
                            headers: auth.header
                        }).success(function () {
                            history.back();
                            $ionicPopup.alert({
                                title: 'Sucesso!',
                                template: 'Movimentação excluída.'
                            });
                        }).error(utilities.apiError);
                    } else {
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
                    }
                }
            });
        }

        function cancelar() {
            history.back();
        }

        function listaContaTransf() {
            vm.contasTransf = [];
            if (vm.contaSelecionada.id) {
                vm.dados.contaContabilId = vm.contaSelecionada.id;
                vm.contas.forEach(function (conta) {
                    if (conta.id != vm.dados.contaContabilId)
                        vm.contasTransf.push(conta);
                }, this);
                if (vm.contasTransf.length > 0)
                    vm.contaDestino = vm.contasTransf[0];
            }
        }

        function personalizar() {
            if (vm.dados.agendamento.escalaTempo == vm.escalaTempo[vm.escalaTempo.length - 1].id) {
                vm.dados.agendamento.qtdTempo = 1;
                vm.escalaPersonalizada = vm.escalaTempo[0];
                $ionicPopup.confirm({
                    title: 'Repetição personalizada',
                    templateUrl: 'templates/personalizado.html',
                    scope: $scope,
                    buttons: [{
                        text: 'Cancelar',
                        type: 'button-default',
                        onTap: function () {
                            vm.dados.agendamento = null;
                            agendamentoCarregado();
                            return false;
                        }
                    }, {
                        text: 'OK',
                        type: 'button-positive',
                        onTap: function (e) {
                            return true; //validar(e); /// TODO: faz a validação
                        }
                    }]
                })
                // .then(function (salvar) {
                //     if (!salvar)
                //         return;
                // });
            } else {
                vm.dados.agendamento = {
                    escalaTempo: vm.dados.agendamento.escalaTempo,
                    qtdTempo: 0
                };
            }
        }

        function diaSemanaSelecionado(dia) {
            if (!vm.dados.agendamento.diasSemana)
                vm.dados.agendamento.diasSemana = [];
            return vm.dados.agendamento.diasSemana && vm.dados.agendamento.diasSemana.indexOf(dia) >= 0;
        }

        function selecionarDiaSemana(dia) {
            if (!vm.dados.agendamento.diasSemana)
                vm.dados.agendamento.diasSemana = [];
            var index = vm.dados.agendamento.diasSemana.indexOf(dia);
            if (index < 0)
                vm.dados.agendamento.diasSemana.push(dia);
            else
                vm.dados.agendamento.diasSemana.splice(index, 1);
        }

        function setarRepeticaoMensal(caso) {
            if (caso == 1) {
                vm.dados.agendamento.diaMes = 1;
                vm.dados.agendamento.semanaMes = null;
                vm.dados.agendamento.diaSemana = null;
            } else {
                vm.dados.agendamento.semanaMes = '1';
                vm.dados.agendamento.diaSemana = vm.escalaTempo.domingo;
                vm.dados.agendamento.diaMes = null;
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
                    vm.originalTransf = true;
                    vm.dados.tipoMovimentacao = 2;
                    vm.dados.data = new Date(vm.dados.data);
                    associaConta();
                    agendamentoCarregado();
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
                    agendamentoCarregado();
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
                agendamentoCarregado();
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
        }

        function associaConta() {
            if (vm.dados.contaContabilId && vm.contas.length > 0) {
                vm.contaSelecionada = vm.contas.find(function (conta) {
                    return conta.id == vm.dados.contaContabilId;
                });
                if ($stateParams.transf == 'true')
                    vm.contaDestino = vm.contas.find(function (conta) {
                        return conta.id == transferenciaOriginal.receita.contaContabilId;
                    });
            }
        }

        /// 2 casos especiais do agendamento: não tem agendamento e agendamento personalizado

        function agendamentoCarregado() {
            if (!vm.dados.agendamento) { // não tem agendamento
                vm.dados.agendamento = {};
                vm.dados.agendamento.diasSemana = [];
            } else if (vm.dados.agendamento.escalaTempo && vm.dados.agendamento.qtdTempo != 0) { // agendamento personalizado
                vm.escalaPersonalizada = vm.dados.agendamento.escalaTempo;
                vm.dados.agendamento.escalaTempo = vm.escalaTempo[vm.escalaTempo.length - 1];
            }
        }

        function agendamentoSalvar() {
            if (!vm.dados.agendamento.escalaTempo) { // não tem agendamento
                vm.dados.agendamentoId = null;
                vm.dados.agendamento = null;
            } else if (vm.dados.agendamento.escalaTempo == vm.escalaTempo[vm.escalaTempo.length - 1]) { // agendamento personalizado
                vm.dados.agendamento.escalaTempo = vm.escalaPersonalizada;
            } else { // se for normal, normaliza
                vm.dados.agendamento = {
                    escalaTempo: vm.dados.agendamento.escalaTempo
                };
            }
        }

        function resetarAgendamento() {
            vm.dados.agendamento = {
                escalaTempo: vm.dados.agendamento.escalaTempo
            };
            vm.dados.agendamento.diasSemana = [];
        }
    }
})();
