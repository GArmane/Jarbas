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
            grupo: { nome: 'Grupo', id: 2 },
            data: { nome: 'Data', id: 3 }
        };
        vm.filtro1Lista = [
            vm.filtro1.semFiltro,
            vm.filtro1.conta,
            vm.filtro1.grupo,
            vm.filtro1.data
        ];
        vm.filtro1Selected = vm.filtro1Lista[0];
        vm.filtro2Lista = [];
        vm.filtro2Selected = null;
        vm.filtro2DataInicio = null;
        vm.filtro2DataFim = null;

        vm.filtro1Changed = filtro1Changed;
        vm.filtro2Changed = filtro2Changed;
        vm.filtro2DataChanged = filtro2DataChanged;

        var moedas = [];
        var grafico;

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
            } else if (vm.filtro1Selected == vm.filtro1.data) {

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
                        if (mov.grupoMovimentacoes.id == vm.filtro2Selected.id)
                            vm.dados.push(mov);
                    });
                }
            }
        }

        function filtro2DataChanged() {
            if (!(vm.filtro2DataInicio instanceof Date) && !(vm.filtro2DataFim instanceof Date))
                vm.dados = vm.movimentacoes;
            else if (vm.filtro2DataInicio instanceof Date && !(vm.filtro2DataFim instanceof Date)) {
                vm.dados = [];
                vm.movimentacoes.forEach(function(mov) {
                    if (mov.data.getTime() >= vm.filtro2DataInicio.getTime())
                        vm.dados.push(mov);
                });
            } else if (!(vm.filtro2DataInicio instanceof Date) && vm.filtro2DataFim instanceof Date) {
                vm.dados = [];
                vm.movimentacoes.forEach(function(mov) {
                    if (mov.data.getTime() <= vm.filtro2DataFim.getTime())
                        vm.dados.push(mov);
                });
            } else {
                vm.dados = [];
                vm.movimentacoes.forEach(function(mov) {
                    if (mov.data.getTime() >= vm.filtro2DataInicio.getTime() && mov.data.getTime() <= vm.filtro2DataFim.getTime())
                        vm.dados.push(mov);
                });
            }
        }

        //////////////// Private

        function criarGrafico() {
            var labels = [];
            var receitas = [];
            var despesas = [];

            var dataPesquisa;
            vm.dados.forEach(function (mov) {
                var data = new Date(mov.data);
                data = data.getMonth() + 1 + '/' + data.getFullYear();
                dataPesquisa = data;
                var i = labels.findIndex(temData);
                if (i == -1) {
                    labels.push(dataPesquisa);
                    i = labels.length - 1;
                }
                if (receitas[i] == null) {
                    receitas[i] = 0;
                    despesas[i] = 0;
                }

                if (mov.tipoMovimentacao == 0)
                    receitas[i] += mov.valor;
                else
                    despesas[i] += mov.valor;
            });

            function temData(data) {
                return dataPesquisa == data;
            }

            var ctx = document.getElementById("graficoRecVsDesp");
            grafico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Receitas',
                        backgroundColor: utilities.getColor(0, false),
                        borderColor: utilities.getColor(0, false),
                        fill: false,
                        data: receitas
                    }, {
                        label: 'Despesas',
                        backgroundColor: utilities.getColor(1, false),
                        borderColor: utilities.getColor(1, false),
                        fill: false,
                        data: despesas
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            // scaleLabel: {
                            //     display: true,
                            //     labelString: 'Month'
                            // }
                        }],
                        yAxes: [{
                            display: true,
                            // scaleLabel: {
                            //     display: true,
                            //     labelString: 'Value'
                            // }
                            min: 0
                        }]
                    }
                }
            });
        }

        function carregarDados() {
            if (utilities.online()) {
                $http({
                    url: api.url() + 'Movimentacoes/Usuario/' + auth.id,
                    method: 'GET',
                    headers: auth.header
                }).success(function (data) {
                    vm.movimentacoes = data;
                    transformaMov();
                    associaContaMov();
                    associaGrupoMov();
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
                    associaGrupoMov();
                }).error(utilities.apiError);
            } else {
                localEntities.getAll('ContaContabil').then(function (data) {
                    vm.contas = data;
                    vm.contas.unshift({ nome: 'Sem filtro' });
                    associaContaMov();
                    associaContaMoeda();
                });
                localEntities.getAll('Moeda').then(function (data) {
                    moedas = data;
                    associaContaMoeda();
                });
                localEntities.getAll('Movimentacao').then(function (data) {
                    vm.dados = data;
                    vm.movimentacoes = {
                        movimentacoes: data
                    };
                    localEntities.getAll('Transferencia').then(function (data) {
                        var movId;
                        function findMov(mov) {
                            return mov.id == movId;
                        }

                        data.forEach(function(transf) {
                            movId = transf.receitaId;
                            var recIdx = vm.dados.findIndex(findMov);
                            movId = transf.despesaId;
                            var despIdx = vm.dados.findIndex(findMov);

                            var despesa = vm.dados[despIdx];
                            var receita = vm.dados[recIdx];
                            despesa.contaDestinoId = receita.contaContabilId;
                            despesa.tipoMovimentacao = 2;
                            despesa.id = transf.id;
                            vm.dados.splice(recIdx, 1);
                        }, this);

                        vm.dados.forEach(function (mov) {
                            mov.data = new Date(mov.data);
                        });
                        vm.dados.sort(function (a, b) {
                            a.data.getTime() - b.data.getTime();
                        });
                        vm.movimentacoes = vm.dados;

                        associaContaMov();
                        associaGrupoMov();
                    });
                });
                localEntities.getAll('GrupoMovimentacoes').then(function (data) {
                    vm.grupos = data;
                    vm.grupos.unshift({ nome: 'Sem filtro' });
                    associaGrupoMov();
                });
            }
        }

        function associaContaMoeda() {
            if (vm.contas.length == 0 || moedas.length == 0)
                return;
            vm.contas.forEach(function(conta) {
                for (var i = 0; i < moedas.length; i++) {
                    var moeda = moedas[i];
                    if (moeda.id == conta.moedaId)
                        conta.moeda = moeda;
                }
            });
        }

        function associaGrupoMov() {
            if (vm.dados.length == 0 || vm.grupos.length == 0)
                return;
            vm.dados.forEach(function(mov) {
                for (var i = 0; i < vm.grupos.length; i++) {
                    var grupo = vm.grupos[i];
                    if (grupo.id == mov.grupoMovimentacoesId)
                        mov.grupoMovimentacoes = grupo;
                }
            });
            criarGrafico();
        }

        function associaContaMov() {
            if (vm.dados.length == 0 || vm.contas.length == 0)
                return;
            vm.dados.forEach(function(mov) {
                for (var i = 0; i < vm.contas.length; i++) {
                    var conta = vm.contas[i];
                    if (conta.id == mov.contaContabilId)
                        mov.contaContabil = conta;
                    if (mov.tipoMovimentacao == 2 && conta.id == mov.contaDestinoId)
                        mov.contaDestino = conta;
                }
            });
        }

        function transformaMov() {
            var transfs = vm.movimentacoes.transferencias;
            vm.movimentacoes = vm.movimentacoes.movimentacoes;
            transfs.forEach(function(tr) {
                var transf = tr.despesa;
                transf.id = tr.id;
                transf.contaDestinoId = tr.receita.contaContabilId;
                transf.tipoMovimentacao = 2;
                vm.movimentacoes.push(transf);
            });
            vm.movimentacoes.forEach(function (mov) {
                mov.data = new Date(mov.data);
            });
            vm.movimentacoes.sort(function (a, b) {
                return a.data.getTime() - b.data.getTime();
            });
            vm.dados = vm.movimentacoes;
        }
    }
})();
