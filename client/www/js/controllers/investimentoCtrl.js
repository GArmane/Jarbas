(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('investimentoController', investimentoController);

    investimentoController.$inject = ['auth', '$state', '$stateParams', 'api', '$http', '$ionicPopup', 'utilities', '$scope', '$timeout'];

    function investimentoController(auth, $state, $stateParams, api, $http, $ionicPopup, utilities, $scope, $timeout) {
        var vm = this;

        vm.dados = {};
        vm.dados.tipoInvestimento = {};
        
        vm.alteracao = false;
        vm.visualizacao = false;
        vm.escalaTempo = [
            { name: 'Dias', id: 0 },
            { name: 'Semanas', id: 1 },
            { name: 'Meses', id: 3 },
            { name: 'Anos', id: 4 },
        ];
        vm.escalaEnum = {
            diario: 0,
            semanal: 1,
            mensal: 3,
            anual: 4,
            personalizado: 5
        };
        vm.moedas = [];
        vm.contas = [];
        vm.transf = {};
        vm.valorConvertido = 0;

        vm.salvar = salvar;
        vm.alterar = alterar;
        vm.excluir = excluir;
        vm.cancelar = cancelar;
        vm.prever = prever;
        vm.addDinheiro = addDinheiro;
        vm.removeDinheiro = removeDinheiro;
        vm.atualizaConvertido = atualizaConvertido;

        var original;
        var grafico;
        
        activate();

        ////////////////

        function activate() {
            if (!auth.verify())
                return;
            vm.dados.escalaTempo = vm.escalaEnum.diario;
            carregarDados();
            vm.visualizacao = !!$stateParams.id;
        }

        //////////////// Public

        function salvar() {
            vm.dados.usuarioId = auth.id;
            vm.dados.moedaId = vm.dados.moeda.id;
            vm.dados.moeda = null;
            if (!vm.iniciado) {
                vm.dados.valorAtual = vm.dados.valorInvestido;
                vm.dados.dataInicio = new Date();
            }
            var req = {
                method: 'POST',
                url: api.url() + 'Investimentos',
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
                    template: 'Investimento inserido.'
                });
            }
        }

        function alterar() {
            var req = {
                method: 'PUT',
                url: api.url() + 'Investimentos/' + vm.dados.id,
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
                    template: 'Investimento alterado.'
                });
            }
        }

        function excluir() {
            $ionicPopup.confirm({
                title: 'Excluir investimento',
                template: 'Tem certeza que deseja excluir o investimento ' + vm.dados.descricao + '?'
            }).then(function (res) {
                if (res) {
                    var req = {
                        method: 'DELETE',
                        url: api.url() + 'Investimentos/' + vm.dados.id,
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
                localEntities.remove('Investimento', vm.dados.id);
                
                history.back();
                $ionicPopup.alert({
                    title: 'Sucesso!',
                    template: 'Investimento excluído.'
                });
            }
        }

        function cancelar() {
            if (vm.alteracao) {
                vm.alteracao = false;
                vm.visualizacao = true;
                vm.dados = new Investimento(JSON.parse(JSON.stringify(original)));
            } else
                history.back();
        }

        function addDinheiro() {
            vm.tipoTransf = 'origem';
            vm.transf = {};
            $ionicPopup.show({
                title: 'Adicionar dinheiro ao investimento',
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
                
                var url;
                if (vm.transf.conta)
                    url = 'Investimentos/TransferirFromConta/' + vm.transf.conta.id + '/' + vm.dados.id;
                else
                    url = 'Investimentos/Inserir/' + vm.dados.id;

                var req = {
                    method: 'POST',
                    url: api.url() + url,
                    data: vm.transf.valor,
                    headers: auth.header
                };
                if (utilities.online(req))
                    $http(req).success(success)
                    .error(utilities.apiError);
                else {
                    localEntities.set(new Sync(req));
                    var conta = vm.transf.conta, investimento = original;
                    if (vm.transf.conta) {
                        if (vm.transf.conta.moeda.id != vm.dados.moeda.id)
                            conta.saldo -= (vm.transf.valor * vm.dados.moeda.cotacaoComercial) / vm.transf.conta.moeda.cotacaoComercial;
                        else 
                            conta.saldo -= vm.transf.valor;
                    }
                    investimento.valorAtual += vm.transf.valor;
                    success({
                        conta: conta, investimento: investimento
                    });
                }

                function success(data) {
                    if (data.conta) {
                        vm.transf.conta.saldo = data.conta.saldo;
                        localEntities.set(data.conta);
                        original = data.investimento;
                    } else
                        original = data;
                    vm.dados = new Investimento(JSON.parse(JSON.stringify(original)));
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
                title: 'Remover dinheiro do investimento',
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
                    url: api.url() + 'Investimentos/TransferirToConta/' + vm.transf.conta.id + '/' + vm.dados.id,
                    data: vm.transf.valor,
                    headers: auth.header
                };
                if (utilities.online())
                    $http(req).success(success)
                    .error(utilities.apiError);
                else {
                    localEntities.set(new Sync(req));
                    var conta = vm.transf.conta, investimento = original;
                    if (conta.moeda.id != vm.dados.moeda.id)
                        conta.saldo += (vm.transf.valor * vm.dados.moeda.cotacaoComercial) / conta.moeda.cotacaoComercial;
                    else
                        conta.saldo += vm.transf.valor;
                    investimento.valorAtual -= vm.transf.valor;
                    success({
                        conta: conta, objetivo: investimento
                    });
                }

                function success(data) {
                    localEntities.set(data.conta);
                    original = data.investimento;
                    vm.dados = new Investimento(JSON.parse(JSON.stringify(original)));
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
        
        function prever() {
            if (!utilities.online()) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: 'A previsão só funciona com conexão à internet.'
                });
                return;
            }
            $ionicPopup.show({
                title: 'Prever valor futuro',
                template: '<span class="input-label">Data futura</span>' + 
                '<label class="item item-input">' + 
                    '<input type="date" ng-model="vm.dataFutura">' + 
                '</label>',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar',
                    type: 'button-default',
                    onTap: function () {
                        return false;
                    }
                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!(vm.dataFutura && new Date().getTime() < vm.dataFutura.getTime())) {
                            $ionicPopup.alert({
                                title: 'Ops!',
                                template: 'Insira uma data maior que a atual.'
                            });
                            return false;
                        } else
                            return true;
                    }
                }]
            }).then(function (prever) {
                if (!prever)
                    return;

                $http({
                    method: 'POST',
                    url: api.url() + 'Investimentos/Prever/' + vm.dados.id,
                    data: vm.dataFutura,
                    headers: auth.header
                }).success(function (data) {
                    $ionicPopup.alert({
                        title: 'Valor do investimento em ' + vm.dataFutura.toLocaleDateString() + ':',
                        template: vm.dados.moeda.simbolo + ' ' + data.valorFuturo
                    });
                }).error(utilities.apiError);
            });
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
                        url: api.url() + 'Investimentos/' + $stateParams.id,
                        method: 'GET',
                        headers: auth.header
                    }).success(successInv).error(utilities.apiError);
                    $http({
                        method: 'GET',
                        url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                        headers: auth.header
                    }).success(successContas).error(utilities.apiError);
                } else {
                    localEntities.get('Investimento', $stateParams.id, ['tipoInvestimento']).then(successInv);
                    localEntities.getAll('ContaContabil').then(successContas);
                }
            }
            if (utilities.online())
                $http({
                    method: 'GET',
                    url: api.url() + 'Moedas',
                    headers: auth.header
                }).success(successMoeda).error(utilities.apiError);
            else
                localEntities.getAll('Moeda').then(successMoeda);

            function successContas(data) {
                vm.contas = data;
            }

            function successMoeda(data) {
                if (data)
                    vm.moedas = data;
                if (vm.moedas.length == 0)
                    return;
                if (vm.dados.id)
                    vm.dados.moeda = vm.moedas.find(function (moeda) {
                        return moeda.id == vm.dados.moedaId;
                    });
                else
                    vm.dados.moeda = vm.moedas[0];

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

            function successInv(data) {
                vm.visualizacao = true;
                vm.dados = new Investimento(data);
                original = JSON.parse(JSON.stringify(data));
                vm.dados.dataInicio = new Date(vm.dados.dataInicio);
                successMoeda();
            }
        }
    }
})();
