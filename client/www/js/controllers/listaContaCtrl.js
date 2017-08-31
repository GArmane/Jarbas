(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('listaContaController', listaContaController);

    listaContaController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$timeout'];

    function listaContaController(auth, $state, api, $http, $ionicPopup, $scope, $timeout) {
        var vm = this;

        vm.dados = [];
        vm.conta = {};
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
                $http({
                    method: 'POST',
                    url: api.url() + 'ContasContabeis/',
                    data: conta,
                    headers: auth.header
                }).success(function (data) {
                    vm.dados.push(data);
                    data.moeda = vm.conta.moeda;
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Conta contábil adicionada.'
                    });
                }).error(function (data) {
                    $ionicPopup.alert({
                        title: 'Ops!',
                        template: data[0].errorMessage
                    });
                });
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
                $http({
                    method: 'PUT',
                    url: api.url() + 'ContasContabeis/' + vm.conta.id,
                    data: conta,
                    headers: auth.header
                }).success(function (data) {
                    vm.dados[index] = data;
                    data.moeda = vm.conta.moeda;
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Conta contábil alterada.'
                    });
                }).error(function (data) {
                    $ionicPopup.alert({
                        title: 'Ops!',
                        template: data
                    });
                });
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
                if (res)
                    $http({
                        method: 'DELETE',
                        url: api.url() + 'ContasContabeis/' + vm.conta.id,
                        headers: auth.header
                    }).success(function () {
                        vm.dados.splice(index, 1);
                        $ionicPopup.alert({
                            title: 'Sucesso!',
                            template: 'Conta contábil excluída.'
                        });
                    }).error(function (data) {
                        $ionicPopup.alert({
                            title: 'Ops!',
                            template: data
                        });
                    });
            });
        }

        function carregarDados() {
            $http({
                method: 'GET',
                url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                headers: auth.header
            }).success(function (data) {
                vm.dados = data;
            }).error(function (data) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data
                });
            });
            $http({
                method: 'GET',
                url: api.url() + 'Moedas',
                headers: auth.header
            }).success(function (data) {
                vm.moedas = data;
            }).error(function (data) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data[0].errorMessage
                });
            });
        }
    }
})();
