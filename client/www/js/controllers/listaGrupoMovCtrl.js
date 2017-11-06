(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('listaGrupoMovController', listaGrupoMovController);

    listaGrupoMovController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$timeout', 'utilities'];

    function listaGrupoMovController(auth, $state, api, $http, $ionicPopup, $scope, $timeout, utilities) {
        var vm = this;

        vm.dados = [];
        vm.grupo = new GrupoMovimentacoes();
        vm.grupo.nome = '';

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
                title: 'Adicionar grupo de movimentações',
                templateUrl: 'templates/add_grupos.html',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar',
                    type: 'button-default',
                    onTap: function () {
                        vm.grupo = new GrupoMovimentacoes();
                        vm.grupo.nome = '';
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
                vm.grupo.usuarioId = auth.id;
                if (utilities.online())
                    $http({
                        method: 'POST',
                        url: api.url() + 'GrupoMovimentacoes/',
                        data: vm.grupo,
                        headers: auth.header
                    }).success(success)
                    .error(utilities.apiError);
                else
                    success(vm.grupo);

                function success(data) {
                    localEntities.set(data);
                    vm.dados.push(data);
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Grupo adicionado.'
                    });
                    vm.grupo = new GrupoMovimentacoes();
                    vm.grupo.nome = '';
                }
            });
        }

        function alterar(index) {
            vm.grupo = JSON.parse(JSON.stringify(vm.dados[index]));            
            $ionicPopup.show({
                title: 'Alterar grupo de movimentações',
                templateUrl: 'templates/add_grupos.html',
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
                        vm.grupo = {};
                        vm.grupo.nome = '';
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
                
                if (utilities.online())
                    $http({
                        method: 'PUT',
                        url: api.url() + 'GrupoMovimentacoes/' + vm.grupo.id,
                        data: vm.grupo,
                        headers: auth.header
                    }).success(success)
                    .error(utilities.apiError);
                else
                    success(vm.grupo);

                function success(data) {
                    localEntities.set(data);
                    vm.dados[index] = data;
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Grupo alterado.'
                    });
                    vm.grupo = new GrupoMovimentacoes();
                    vm.grupo.nome = '';
                }
            });
        }
        
        //////////////// Private

        function validar(e) {
            if (!vm.grupo.nome) {
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
                title: 'Excluir grupo',
                template: 'Tem certeza que deseja excluir o grupo ' + vm.grupo.nome + '?'
            }).then(function (res) {
                if (!res)
                    return;

                if (utilities.online())
                    $http({
                        method: 'DELETE',
                        url: api.url() + 'GrupoMovimentacoes/' + vm.grupo.id,
                        headers: auth.header
                    }).success(success)
                    .error(utilities.apiError);
                else
                    success();

                function success() {
                    localEntities.remove('GrupoMovimentacoes', vm.grupo.id);
                    vm.dados.splice(index, 1);
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Grupo excluído.'
                    });
                    vm.grupo = new GrupoMovimentacoes();
                    vm.grupo.nome = '';
                }
            });
        }

        function carregarDados() {
            if (utilities.online())
                $http({
                    method: 'GET',
                    url: api.url() + 'GrupoMovimentacoes/Usuario/' + auth.id,
                    headers: auth.header
                }).success(success)
                .error(utilities.apiError);
            else
                localEntities.getAll('GrupoMovimentacoes').then(success);

            function success(data) {
                vm.dados = data;
            }
        }
    }
})();
