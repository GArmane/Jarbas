(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('listaContaController', listaContaController);

    listaContaController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$timeout', 'utilities'];

    function listaContaController(auth, $state, api, $http, $ionicPopup, $scope, $timeout, utilities) {
        var vm = this;

        vm.dados = [];
        vm.conta = new ContaContabil();
        vm.conta.nome = '';
        vm.conta.moeda = null;
        vm.conta.moedaId = null;
        vm.conta.saldo = null;
        vm.moedas = [];

        vm.add = add;
        vm.alterar = alterar;

        activate();

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
        }

        //////////////// Public

        function add() {
            $ionicPopup.show({
                title: 'Adicionar conta contábil',
                templateUrl: 'templates/add_conta.html',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar',
                    type: 'button-default',
                    onTap: function () {
                        vm.conta = new ContaContabil();
                        vm.conta.nome = '';
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
                vm.conta.usuarioId = auth.id;
                var conta = JSON.parse(JSON.stringify(vm.conta));
                conta.moedaId = conta.moeda.id;
                conta.moeda = null;
                var req = {
                    method: 'POST',
                    url: api.url() + 'ContasContabeis/',
                    data: conta,
                    headers: auth.header
                };
                if (utilities.online())
                    $http(req).success(success)
                    .error(utilities.apiError);
                else {
                    localEntities.set(new Sync(req));
                    success(conta);
                }

                function success(data) {
                    localEntities.set(data);
                    vm.dados.push(data);
                    data.moeda = vm.conta.moeda;
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Conta contábil adicionada.'
                    });
                    vm.conta = new ContaContabil();
                    vm.conta.nome = '';
                }
            });
        }

        function alterar(index) {
            vm.conta = JSON.parse(JSON.stringify(vm.dados[index]));
            vm.conta.moeda = vm.moedas.find(function (moeda) {
                return moeda.id == vm.conta.moeda.id;
            });
            $ionicPopup.show({
                title: 'Alterar conta contábil',
                templateUrl: 'templates/add_conta.html',
                scope: $scope,
                buttons: [{
                    text: 'Excluir',
                    type: 'button-assertive',
                    onTap: function () {
                        excluir(index);
                        return false;
                    }
                }, {
                    text: 'Cancelar',
                    type: 'button-default',
                    onTap: function () {
                        vm.conta = {};
                        vm.conta.nome = '';
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
                var conta = JSON.parse(JSON.stringify(vm.conta));
                conta.moedaId = conta.moeda.id;
                conta.moeda = null;
                if (utilities.online())
                    $http({
                        method: 'PUT',
                        url: api.url() + 'ContasContabeis/' + vm.conta.id,
                        data: conta,
                        headers: auth.header
                    }).success(success)
                    .error(utilities.apiError);
                else
                    success(conta);

                function success(data) {
                    localEntities.set(data);
                    vm.dados[index] = data;
                    data.moeda = vm.conta.moeda;
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Conta contábil alterada.'
                    });
                    vm.conta = {};
                    vm.conta.nome = '';
                }
            });
        }
        
        //////////////// Private

        function validar(e) {
            if (!vm.conta.nome || !vm.conta.moeda || !vm.conta.saldo) {
                e.preventDefault();
                $timeout(function () {
                    document.getElementById('hiddenSubmit').click();
                }, 351);
                return false;
            } else
                return true;
        }

        function excluir(index) {
            $ionicPopup.confirm({
                title: 'Excluir conta contábil',
                template: 'Tem certeza que deseja excluir a conta contábil ' + vm.conta.nome + '?'
            }).then(function (res) {
                if (res) {
                    if (utilities.online())
                        $http({
                            method: 'DELETE',
                            url: api.url() + 'ContasContabeis/' + vm.conta.id,
                            headers: auth.header
                        }).success(success)
                        .error(utilities.apiError);
                    else
                        success();
                    
                    function success() {
                        localEntities.remove('ContaContabil', vm.conta.id);
                        vm.dados.splice(index, 1);
                        $ionicPopup.alert({
                            title: 'Sucesso!',
                            template: 'Conta contábil excluída.'
                        });
                        vm.conta = {};
                        vm.conta.nome = '';
                    }
                }
            });
        }

        function carregarDados() {
            if (utilities.online()) {
                $http({
                    method: 'GET',
                    url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                    headers: auth.header
                }).success(function (data) {
                    vm.dados = data;
                }).error(utilities.apiError);
                $http({
                    method: 'GET',
                    url: api.url() + 'Moedas',
                    headers: auth.header
                }).success(function (data) {
                    vm.moedas = data;
                }).error(utilities.apiError);
            } else {
                localEntities.getAll('ContaContabil').then(function (data) {
                    vm.dados = data;
                    associaContaMoeda();
                });
                localEntities.getAll('Moeda').then(function (data) {
                    vm.moedas = data;
                    associaContaMoeda();
                });
            }
        }

        function associaContaMoeda() {
            if (vm.dados.length == 0 || vm.moedas.length == 0)
                return;
            vm.dados.forEach(function(conta) {
                for (var i = 0; i < vm.moedas.length; i++) {
                    var moeda = vm.moedas[i];
                    if (moeda.id == conta.moedaId)
                        conta.moeda = moeda;
                }
            });
        }
    }
})();
