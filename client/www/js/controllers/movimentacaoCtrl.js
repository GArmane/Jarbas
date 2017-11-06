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

        var movOriginal = {};

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

        function salvar() {
            agendamentoSalvar();
            vm.dados.contaContabilId = vm.contaSelecionada.id;
            if (vm.dados.tipoMovimentacao == 2) {
                var transf = new Transferencia();
                transf.despesa = JSON.parse(JSON.stringify(vm.dados));
                transf.receita = JSON.parse(JSON.stringify(vm.dados));
                transf.despesa.tipoMovimentacao = 1;
                transf.receita.contaContabilId = vm.contaDestino.id;
                transf.receita.tipoMovimentacao = 0;
                transf.receita.agendamento = null;
                transf.receita.valor = (transf.despesa.valor * vm.contaSelecionada.moeda.cotacaoComercial) / vm.contaDestino.moeda.cotacaoComercial;

                if (utilities.online())
                    $http({
                        url: api.url() + 'Movimentacoes/Transferencia/',
                        method: 'POST',
                        data: transf,
                        headers: auth.header
                    }).success(successTransf)
                    .error(error);
                else
                    successTransf(transf);
            } else {
                if (utilities.online())
                    $http({
                        url: api.url() + 'Movimentacoes/',
                        method: 'POST',
                        data: vm.dados,
                        headers: auth.header
                    }).success(successMov)
                    .error(error);
                else
                    successMov(vm.dados);
            }

            function successTransf(data) {
                localEntities.set(data);

                vm.contaSelecionada.saldo -= +vm.dados.valor;
                vm.contaDestino.saldo += +vm.dados.valor;
                localEntities.set(vm.contaSelecionada);
                localEntities.set(vm.contaDestino);
                
                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Movimentação inserida.'
                });
            }
            
            function successMov(data) {
                localEntities.set(data);
                
                if (vm.dados.tipoMovimentacao == 0)
                    vm.contaSelecionada.saldo += +vm.dados.valor;
                else
                    vm.contaSelecionada.saldo -= +vm.dados.valor;
                localEntities.set(vm.contaSelecionada);
                
                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Movimentação inserida.'
                });
            }

            function error(data) {
                agendamentoCarregado();
                utilities.apiError(data);
            }
        }

        function alterar() {
            agendamentoSalvar();
            if (vm.dados.tipoMovimentacao == 2) {
                var transf = {
                    despesa: JSON.parse(JSON.stringify(vm.dados)),
                    receita: JSON.parse(JSON.stringify(vm.dados))
                };
                transf.id = movOriginal.id;
                transf.despesaId = movOriginal.despesa.id;
                transf.despesa.id = movOriginal.despesa.id;
                transf.despesa.tipoMovimentacao = 1;
                transf.receitaId = movOriginal.receita.id;
                transf.receita.id = movOriginal.receita.id;
                transf.receita.contaContabilId = vm.contaDestino.id;
                transf.receita.tipoMovimentacao = 0;
                transf.receita.valor = (transf.despesa.valor * vm.contaSelecionada.moeda.cotacaoComercial) / vm.contaDestino.moeda.cotacaoComercial;

                if (utilities.online())
                    $http({
                        url: api.url() + 'Movimentacoes/Transferencia/' + transf.id,
                        method: 'PUT',
                        data: transf,
                        headers: auth.header
                    }).success(successTransf)
                    .error(error);
                else
                    successTransf(transf);
            } else {
                if (utilities.online())
                    $http({
                        url: api.url() + 'Movimentacoes/' + vm.dados.id,
                        method: 'PUT',
                        data: vm.dados,
                        headers: auth.header
                    }).success(successMov)
                    .error(error);
                else
                    successMov(vm.dados);
            }

            function successMov(data) {
                desfazMovOriginal();
                localEntities.set(data);

                if (vm.dados.tipoMovimentacao == 0)
                    vm.contaSelecionada.saldo += +vm.dados.valor;
                else
                    vm.contaSelecionada.saldo -= +vm.dados.valor;
                localEntities.set(vm.contaSelecionada);

                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Movimentação alterada.'
                });
            }

            function successTransf(data) {
                desfazMovOriginal();
                localEntities.set(data);

                localEntities.set(data);
                vm.contaSelecionada.saldo -= +vm.dados.valor;
                vm.contaDestino.saldo += +vm.dados.valor;
                localEntities.set(vm.contaSelecionada);
                localEntities.set(vm.contaDestino);

                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Movimentação alterada.'
                });
            }

            function error(data) {
                agendamentoCarregado();
                utilities.apiError(data);
            }
        }

        function excluir() {
            $ionicPopup.confirm({
                title: 'Excluir movimentação',
                template: 'Tem certeza que deseja excluir a movimentação ' + vm.dados.descricao + '?'
            }).then(function (res) {
                if (res) {
                    if (utilities.online()) {
                        if (vm.dados.tipoMovimentacao == 2) {
                            $http({
                                method: 'DELETE',
                                url: api.url() + '/Movimentacoes/Transferencia/' + vm.dados.id,
                                headers: auth.header
                            }).success(success)
                            .error(utilities.apiError);
                        } else
                            $http({
                                method: 'DELETE',
                                url: api.url() + 'Movimentacoes/' + vm.dados.id,
                                headers: auth.header
                            }).success(success)
                            .error(utilities.apiError);
                    } else
                        success();
                }
                
                function success() {
                    if (vm.dados.agendamentoId)
                    localEntities.remove('Agendamento', vm.dados.agendamentoId);
                    if (vm.dados.tipoMovimentacao == 2) {
                        localEntities.remove('Movimentacao', movOriginal.despesaId);
                        localEntities.remove('Movimentacao', movOriginal.receitaId);                        
                        localEntities.remove('Transferencia', vm.dados.id);
                    }
                    else
                    localEntities.remove('Movimentacao', vm.dados.id);
                    desfazMovOriginal();
                    history.back();
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Movimentação excluída.'
                    });
                }
            });
        }

        function cancelar() {
            history.back();
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
            if (utilities.online()) {
                if ($stateParams.id && $stateParams.transf == 'true')
                    $http({
                        url: api.url() + 'Movimentacoes/Transferencia/' + $stateParams.id,
                        method: 'GET',
                        headers: auth.header
                    }).success(successTransf)
                        .error(utilities.apiError);
                else if ($stateParams.id)
                    $http({
                        url: api.url() + 'Movimentacoes/' + $stateParams.id,
                        method: 'GET',
                        headers: auth.header
                    }).success(successMov)
                        .error(utilities.apiError);

                $http({
                    url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                    method: 'GET',
                    headers: auth.header
                }).success(successConta)
                    .error(utilities.apiError);

                $http({
                    url: api.url() + 'GrupoMovimentacoes/Usuario/' + auth.id,
                    method: 'GET',
                    headers: auth.header
                }).success(successGrupo)
                    .error(utilities.apiError);
            } else {
                if ($stateParams.id && $stateParams.transf == 'true')
                    localEntities.get('Transferencia', $stateParams.id, ['receita', 'despesa.agendamento'])
                        .then(successTransf, utilities.apiError);
                else if ($stateParams.id)
                    localEntities.get('Movimentacao', $stateParams.id, ['agendamento'])
                        .then(successMov, utilities.apiError);

                localEntities.getAll('ContaContabil').then(successConta, utilities.apiError);
                localEntities.getAll('GrupoMovimentacoes').then(successGrupo, utilities.apiError);
            }

            function successTransf(data) {
                vm.dados = data.despesa;
                movOriginal = JSON.parse(JSON.stringify(data));
                vm.originalTransf = true;
                vm.dados.tipoMovimentacao = 2;
                vm.dados.data = new Date(vm.dados.data);
                associaConta();
                agendamentoCarregado();
                listaContaTransf();
            }

            function successMov(data) {
                vm.dados = data;
                movOriginal = JSON.parse(JSON.stringify(data));
                vm.dados.data = new Date(vm.dados.data);
                associaConta();
                agendamentoCarregado();
            }

            function successConta(data) {
                vm.contas = data;

                if (vm.contas.length > 0) {
                    localEntities.getAll('Moeda').then(function (data) {
                        var moedaId;
                        function findMoeda(moeda) {
                            return moeda.id == moedaId;
                        }
                        vm.contas.forEach(function(conta) {
                            moedaId = conta.moedaId;
                            conta.moeda = data.find(findMoeda);
                        }, this);
                    }, utilities.apiError);
                }

                if (vm.contas && vm.contas.length > 0 && !$stateParams.id) {
                    vm.contaSelecionada = vm.contas[0];
                    vm.dados.contaContabilId = vm.contaSelecionada.id;
                } else
                    associaConta();
                agendamentoCarregado();
            }

            function successGrupo(data) {
                vm.grupos = data;
                if (vm.grupos && vm.grupos.length > 0 && !$stateParams.id)
                    vm.dados.grupoMovimentacoesId = vm.grupos[0].id;
            }
        }

        function associaConta() {
            if (vm.dados.contaContabilId && vm.contas.length > 0) {
                vm.contaSelecionada = vm.contas.find(function (conta) {
                    return conta.id == vm.dados.contaContabilId;
                });
                if ($stateParams.transf == 'true')
                    vm.contaDestino = vm.contas.find(function (conta) {
                        return conta.id == movOriginal.receita.contaContabilId;
                    });
                listaContaTransf();
            }
        }

        function desfazMovOriginal() {
            var contaId;
            var contaOrigem;
            var contaDestino;
            function findConta(conta) {
                return conta.id == contaId;
            }
            if (movOriginal.despesa) { // é transferência
                contaId = movOriginal.despesa.contaContabilId;
                contaOrigem = vm.contas.find(findConta);
                contaId = movOriginal.receita.contaContabilId;
                contaDestino = vm.contas.find(findConta);

                contaOrigem.saldo += movOriginal.despesa.valor;
                localEntities.set(contaOrigem);
                contaDestino.saldo -= movOriginal.receita.valor;
                localEntities.set(contaDestino);
            } else {
                contaId = movOriginal.contaContabilId;
                contaOrigem = vm.contas.find(findConta);

                if (movOriginal.tipoMovimentacao == 0)
                    contaOrigem.saldo -= movOriginal.valor;
                else
                    contaOrigem.saldo += movOriginal.valor;
                localEntities.set(contaOrigem);
            }
        }

        /// 2 casos especiais do agendamento: não tem agendamento e agendamento personalizado

        function agendamentoCarregado() {
            if (!vm.dados.agendamento) { // não tem agendamento
                vm.dados.agendamento = {};
                vm.dados.agendamento.diasSemana = [];
            } else if (vm.dados.agendamento.escalaTempo != null && vm.dados.agendamento.qtdTempo != 0) { // agendamento personalizado
                vm.escalaPersonalizada = vm.dados.agendamento.escalaTempo;
                vm.dados.agendamento.escalaTempo = vm.escalaTempo[vm.escalaTempo.length - 1].id;
            }
        }

        function agendamentoSalvar() {
            if (vm.dados.agendamento.escalaTempo == null) { // não tem agendamento
                vm.dados.agendamentoId = null;
                vm.dados.agendamento = null;
            } else if (vm.dados.agendamento.escalaTempo == vm.escalaTempo[vm.escalaTempo.length - 1].id) { // agendamento personalizado
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
