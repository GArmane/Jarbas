(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('objetivoController', objetivoController);

    objetivoController.$inject = ['auth', '$state', '$stateParams', 'api', '$http', '$ionicPopup', 'utilities', '$scope', '$timeout'];
    function objetivoController(auth, $state, $stateParams, api, $http, $ionicPopup, utilities, $scope, $timeout) {
        var vm = this;

        vm.dados = {};
        vm.dados.historicoObjetivo = [];

        vm.moedas = [];
        vm.contas = [];
        vm.transf = {};
        vm.alteracao = false;
        vm.visualizacao = false;
        vm.valorConvertido = 0;

        vm.salvar = salvar;
        vm.alterar = alterar;
        vm.excluir = excluir;
        vm.cancelar = cancelar;
        vm.arquivar = arquivar;
        vm.addDinheiro = addDinheiro;
        vm.removeDinheiro = removeDinheiro;
        // }
        vm.atualizaConvertido = atualizaConvertido;

        var original;
        var grafico;
        
        activate();

        //////////////// Public

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
            vm.visualizacao = !!$stateParams.id;
        }

        function salvar() {
            vm.dados.usuarioId = auth.id;
            vm.dados.historicoObjetivo = [];
            var hist = new HistoricoObjetivo();
            hist.dataFinal = new Date();
            hist.valorFinal = 0;
            vm.dados.historicoObjetivo.push(hist);

            var req = {
                method: 'POST',
                url: api.url() + 'Objetivos',
                data: vm.dados,
                headers: auth.header
            };
            if (utilities.online())
                $http(req).success(success)
                .error(utilities.apiError);
            else {
                localEntities.set(new Sync(req));
                success(vm.dados);
            }

            function success(data) {
                localEntities.set(data);
                
                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Objetivo inserido.'
                });
            }
        }

        function alterar() {
            var hist = new HistoricoObjetivo();
            hist.dataFinal = vm.dados.dataInicial;
            hist.valorFinal = vm.dados.valor;
            vm.dados.historicoObjetivo.push(hist);
            var req = {
                method: 'PUT',
                url: api.url() + 'Objetivos/' + vm.dados.id,
                data: vm.dados,
                headers: auth.header
            };
            if (utilities.online())
                $http(req).success(success)
                .error(utilities.apiError);
            else {
                localEntities.set(new Sync(req));
                success(vm.dados);
            }

            function success(data) {
                localEntities.set(data);
                
                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Objetivo alterado.'
                });
            }
        }

        function excluir() {
            $ionicPopup.confirm({
                title: 'Excluir objetivo',
                template: 'Tem certeza que deseja excluir o objetivo ' + vm.dados.descricao + '?'
            }).then(function (res) {
                if (res) {
                    var req = {
                        method: 'DELETE',
                        url: api.url() + 'Objetivos/' + vm.dados.id,
                        headers: auth.header
                    };
                    if (utilities.online())
                        $http(req).success(success)
                        .error(utilities.apiError);
                    else {
                        localEntities.set(new Sync(req));
                        success(vm.dados);
                    }
                }
            });
                    
            function success(data) {
                localEntities.remove('Objetivo', vm.dados.id);
                
                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Objetivo excluído.'
                });
            }
        }

        function cancelar() {
            if (vm.alteracao) {
                vm.alteracao = false;
                vm.visualizacao = true;
                vm.dados = new Objetivo(JSON.parse(JSON.stringify(original)));
            } else
                history.back();
        }

        function arquivar() {
            original.arquivar = !original.arquivar;
            var req = {
                method: 'PUT',
                url: api.url() + 'Objetivos/' + vm.dados.id,
                data: original,
                headers: auth.header
            };
            if (utilities.online())
                $http(req).success(success)
                .error(utilities.apiError);
            else {
                localEntities.set(new Sync(req));
                success(vm.dados);
            }

            function success(data) {
                localEntities.set(data);
                
                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Objetivo ' + ((!data.arquivar) ? 'des' : '') + 'arquivado.'
                });
            }
        }

        function addDinheiro() {
            vm.tipoTransf = 'origem';
            vm.transf = {};
            $ionicPopup.show({
                title: 'Adicionar dinheiro ao objetivo',
                templateUrl: 'templates/transferencia.html',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar',
                    type: 'button-default',
                    onTap: function () {
                        vm.transf = {};
                        return false;
                    }
                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function (e) {
                        return validar(e);
                    }
                }]
            }).then(function (salvar) {
                if (!salvar)
                    return;
                
                // var params = {};
                var url;
                if (vm.transf.conta)
                    url = 'Objetivos/TransferirFromConta/' + vm.transf.conta.id + '/' + vm.dados.id;
                else
                    url = 'Objetivos/Inserir/' + vm.dados.id;

                var req = {
                    method: 'POST',
                    url: api.url() + url,
                    // params: params,
                    data: vm.transf.valor,
                    headers: auth.header
                };
                if (utilities.online())
                    $http(req).success(success)
                    .error(utilities.apiError);
                else {
                    localEntities.set(new Sync(req));
                    var conta = vm.transf.conta, objetivo = original;
                    if (vm.transf.conta) {
                        if (vm.transf.conta.moeda.id != vm.dados.moeda.id)
                            conta.saldo -= (vm.transf.valor * vm.dados.moeda.cotacaoComercial) / vm.transf.conta.moeda.cotacaoComercial;
                        else 
                            conta.saldo -= vm.transf.valor;
                    }
                    objetivo.valor += vm.transf.valor;
                    success({
                        conta: conta, objetivo: objetivo
                    });
                }

                function success(data) {
                    if (data.conta) {
                        vm.transf.conta.saldo = data.conta.saldo;
                        localEntities.set(data.conta);
                        original = data.objetivo;
                    } else
                        original = data;
                    vm.dados = new Objetivo(JSON.parse(JSON.stringify(original)));
                    localEntities.set(original);
                    original = JSON.parse(JSON.stringify(vm.dados));
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Dinheiro adicionado.'
                    });
                }
            });
        }

        function removeDinheiro() {
            vm.tipoTransf = 'destino';
            vm.transf = {};
            $ionicPopup.show({
                title: 'Remover dinheiro do objetivo',
                templateUrl: 'templates/transferencia.html',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar',
                    type: 'button-default',
                    onTap: function () {
                        vm.transf = {};
                        return false;
                    }
                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function (e) {
                        return validar(e);
                    }
                }]
            }).then(function (salvar) {
                if (!salvar)
                    return;
                
                var req = {
                    method: 'POST',
                    url: api.url() + 'Objetivos/TransferirToConta/' + vm.transf.conta.id + '/' + vm.dados.id,
                    data: vm.transf.valor,
                    headers: auth.header
                };
                if (utilities.online())
                    $http(req).success(success)
                    .error(utilities.apiError);
                else {
                    localEntities.set(new Sync(req));
                    var conta = vm.transf.conta, objetivo = original;
                    if (conta.moeda.id != vm.dados.moeda.id)
                        conta.saldo += (vm.transf.valor * vm.dados.moeda.cotacaoComercial) / conta.moeda.cotacaoComercial;
                    else
                        conta.saldo += vm.transf.valor;
                    objetivo.valor -= vm.transf.valor;
                    success({
                        conta: conta, objetivo: objetivo
                    });
                }

                function success(data) {
                    localEntities.set(data.conta);
                    original = data.objetivo;
                    original = data;
                    vm.dados = new Objetivo(JSON.parse(JSON.stringify(original)));
                    localEntities.set(original);
                    original = JSON.parse(JSON.stringify(vm.dados));
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Dinheiro removido.'
                    });
                }
            });
        }

        function atualizaConvertido() {
            if (vm.transf.conta)
                vm.valorConvertido = (vm.transf.valor * vm.dados.moeda.cotacaoComercial) / vm.transf.conta.moeda.cotacaoComercial;
        }
        
        //////////////// Private

        function validar(e) {
            if (!vm.transf.valor || (vm.tipoTransf != 'origem' && !vm.transf.conta) || (vm.transf.conta && vm.transf.conta.saldo < vm.valorConvertido && vm.tipoTransf == 'origem')) {
                e.preventDefault();
                $timeout(function () {
                    document.getElementById('hiddenSubmitTransf').click();
                }, 351);
                return false;
            } else
                return true;
        }

        function carregarDados() {
            if ($stateParams.id) {
                if (utilities.online()) {
                    $http({
                        method: 'GET',
                        url: api.url() + 'Objetivos/' + $stateParams.id,
                        headers: auth.header
                    }).success(successObj).error(utilities.apiError);
                    $http({
                        method: 'GET',
                        url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                        headers: auth.header
                    }).success(successContas).error(utilities.apiError);
                } else
                    localEntities.get('Objetivo', $stateParams.id).then(successObj);
            }
            if (utilities.online())
                $http({
                    method: 'GET',
                    url: api.url() + 'Moedas',
                    headers: auth.header
                }).success(successMoedas).error(utilities.apiError);
            else
                localEntities.getAll('Moeda').then(successMoedas);

            function successObj(data) {
                vm.visualizacao = true;
                vm.dados = new Objetivo(data);
                original = JSON.parse(JSON.stringify(data));
                vm.dados.dataInicial = new Date(vm.dados.dataInicial);
                successMoedas();
                criarGrafico();
            }

            function successContas(data) {
                vm.contas = data;
            }

            function successMoedas(data) {
                if (data)
                    vm.moedas = data;
                if (vm.moedas.length > 0) {
                    if (!vm.alteracao && !vm.visualizacao)
                        vm.dados.moedaId = vm.moedas[0].id;
                    else if (vm.dados.id)
                        vm.dados.moeda = vm.moedas.find(function (moeda) {
                            return moeda.id == vm.dados.moedaId;
                        });

                    if (!utilities.online())
                        localEntities.getAll('ContaContabil').then(function (data) {
                            var contaId;
                            data.forEach(function (conta) {
                                contaId = conta.id;
                                conta.moeda = vm.moedas.find(findMoeda);
                            });
                            function findMoeda(moeda) {
                                return moeda.id == contaId;
                            }
                            successContas(data);
                        });
                }
            }
        }

        function criarGrafico() {
            var ctx = document.getElementById("graficoHistorico");
            grafico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: vm.dados.historicoObjetivo.map(function (hist) {
                        return new Date(hist.dataFinal).toLocaleDateString();
                    }),
                    datasets: [{
                        label: 'Valor acumulado',
                        backgroundColor: 'rgb(54, 162, 235)',
                        borderColor: 'rgb(54, 162, 235)',
                        fill: false,
                        data: vm.dados.historicoObjetivo.map(function (hist) {
                            return hist.valorFinal;
                        })
                    },
                ]
                },
                options: {
                    responsive: true,
                    title: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Data'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: false
                            },
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: vm.dados.valor,
                                userCallback: function(value, index, values) {
                                    value = value.toString();
                                    value = value.split(/(?=(?:...)*$)/);
                                    value = value.join('.');
                                    return vm.dados.moeda.simbolo + ' ' + value;
                                }
                            },
                        }]
                    }
                }
            });
        }
    }
})();
