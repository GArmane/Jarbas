(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('movimentacaoController', movimentacaoController);

    movimentacaoController.$inject = ['auth', '$state', '$stateParams', 'api', '$http', '$ionicPopup'];
    function movimentacaoController(auth, $state, $stateParams, api, $http, $ionicPopup) {
        var vm = this;

        vm.dados = {};
        vm.contas = [];
        vm.grupos = [];
        vm.moedas = [];
        vm.alteracao = false;

        vm.salvar = salvar;
        vm.alterar = alterar;
        vm.excluir = excluir;
        
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
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data
                });
            });
        }

        function alterar() {
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
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data
                });
            });
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
                    }).error(function (data) {
                        $ionicPopup.alert({
                            title: 'Ops!',
                            template: data
                        });
                    });
            });
        }

        //////////////// Private

        function carregarDados() {
            if ($stateParams.id)
                $http({
                    url: api.url() + 'Movimentacoes/' + $stateParams.id,
                    method: 'GET',
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
                url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.contas = data;
            }).error(function (data) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data
                });
            });
            $http({
                url: api.url() + 'GrupoMovimentacoes/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.grupos = data;
            }).error(function (data) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data[0].errorMessage
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
