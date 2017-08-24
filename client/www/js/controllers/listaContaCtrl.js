(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('LiscaContaController', LiscaContaController);

    LiscaContaController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope'];

    function LiscaContaController(auth, $state, api, $http, $ionicPopup, $scope) {
        var vm = this;

        vm.dados = [];
        vm.conta = {};
        vm.conta.Nome = '';
        vm.conta.Moeda = null;
        vm.conta.Saldo = 0;

        vm.add = add;
        vm.alterar = alterar;

        activate();

        function activate() {
            carregarDados();
        }

        //////////////// Public

        function add() {
            $ionicPopup.show({
                title: 'Adicionar conta contábil',
                template: '<i>Imagine um form de adição de conta contábil...</i>',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar',
                    type: 'button-default'
                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function (e) {
                        /// TODO: Faz validação e tenta exibir o erro se tiver (ideias: método ng-steps ou método swal2)
                    }
                }]
            }).then(function () {
                vm.conta.usuarioId = auth.id;
                $http({
                    method: 'POST',
                    url: api.url() + 'ContasContabeis/',
                    data: vm.conta,
                    headers: { 'Authorization': 'Bearer' + auth.token }
                }).success(function (data) {
                    vm.dados.push(data);
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
            vm.conta = vm.dados[index];
            
            $ionicPopup.show({
                title: 'Adicionar conta contábil',
                template: '<i>Imagine um form de adição de conta contábil...</i>',
                scope: $scope,
                buttons: [{
                    text: 'Excluir',
                    type: 'button-assertive',
                    onTap: function (e) {
                        excluir(index);
                    }
                }, {
                    text: 'Cancelar',
                    type: 'button-default'
                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function (e) {
                        /// TODO: Faz validação e tenta exibir o erro se tiver (ideias: método ng-steps ou método swal2)
                    }
                }]
            }).then(function () {
                $http({
                    method: 'POST',
                    url: api.url() + 'ContasContabeis/',
                    data: vm.conta,
                    headers: { 'Authorization': 'Bearer' + auth.token }
                }).success(function (data) {
                    vm.dados.push(data);
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
        
        //////////////// Private

        function excluir(index) {
            $ionicPopup.confirm({
                title: 'Excluir conta contábil',
                template: 'Tem certeza que deseja excluir a conta contábil ' + vm.conta.Nome + '?'
            }).then(function (res) {
                if (res)
                    $http({
                        method: 'DELETE',
                        url: api.url() + 'ContasContabeis/' + vm.conta.id,
                        headers: { 'Authorization': 'Bearer' + auth.token }
                    }).success(function () {
                        vm.dados.splice(index, 1);
                        $ionicPopup.alert({
                            title: 'Sucesso!',
                            template: 'Conta contábil excluída.'
                        });
                    }).error(function (data) {
                        $ionicPopup.alert({
                            title: 'Ops!',
                            template: data[0].errorMessage
                        });
                    });
            });
        }

        function carregarDados() {
            $http({
                method: 'GET',
                url: api.url() + 'ContasContabeis/' + auth.id,
                headers: {
                    'Authorization': 'Bearer' + auth.token
                }
            }).success(function (data) {
                vm.dados = data;
            }).error(function (data) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data[0].errorMessage
                });
            });
        }
    }
})();
