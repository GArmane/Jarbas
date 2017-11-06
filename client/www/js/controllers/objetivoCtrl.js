(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('objetivoController', objetivoController);

    objetivoController.$inject = ['auth', '$state', '$stateParams', 'api', '$http', '$ionicPopup', 'utilities', '$scope'];
    function objetivoController(auth, $state, $stateParams, api, $http, $ionicPopup, utilities, $scope) {
        var vm = this;

        vm.dados = {};
        vm.moedas = [];
        vm.alteracao = false;

        vm.salvar = salvar;
        vm.alterar = alterar;
        vm.excluir = excluir;
        vm.cancelar = cancelar;
        
        activate();

        ////////////////

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
            vm.alteracao = !!$stateParams.id;
        }

        function salvar() {
            if (utilities.online())
                $http({
                    method: 'POST',
                    url: api.url() + 'Objetivos',
                    data: vm.dados,
                    header: auth.header
                }).success(success)
                .error(utilities.apiError);
            else
                success(vm.dados);

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
            if (utilities.online())
                $http({
                    method: 'PUT',
                    url: api.url() + 'Objetivos/' + vm.dados.id,
                    data: vm.dados,
                    header: auth.header
                }).success(success)
                .error(utilities.apiError);
            else
                success(vm.dados);

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
                title: 'Excluir movimentação',
                template: 'Tem certeza que deseja excluir a movimentação ' + vm.dados.descricao + '?'
            }).then(function (res) {
                if (res) {
                    if (utilities.online())
                        $http({
                            method: 'DELETE',
                            url: api.url() + 'Objetivos/' + vm.dados.id,
                            header: auth.header
                        }).success(success)
                        .error(utilities.apiError);
                    else
                        success(vm.dados);
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
            history.back();
        }

        function carregarDados() {
            if ($stateParams.id) {
                if (utilities.online())
                    $http({
                        method: 'GET',
                        url: api.url() + 'Objetivos/' + $stateParams.id,
                        headers: auth.header
                    }).success(successObj).error(utilities.apiError);
                else
                    localEntities.get('Objetivo', $stateParams.id).then(successObj);
            }
            if (utilities.online()) {
                $http({
                    method: 'GET',
                    url: api.url() + 'Moedas',
                    headers: auth.header
                }).success(successMoedas).error(utilities.apiError);
            } else {
                localEntities.getAll('Moeda').then(successMoedas);
            }

            function successObj(data) {
                vm.dados = new Objetivo(data);
                vm.dados.dataInicial = new Date(vm.dados.dataInicial);
            }

            function successMoedas(data) {
                vm.moedas = data;
                if (!vm.alteracao && vm.moedas.length > 0)
                    vm.dados.moedaId = vm.moedas[0].id;
            }
        }
    }
})();
