(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('listaGrupoMovController', listaGrupoMovController);

    listaGrupoMovController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$timeout', 'utilities'];

    function listaGrupoMovController(auth, $state, api, $http, $ionicPopup, $scope, $timeout, utilities) {
        var vm = this;

        vm.dados = [];
        vm.movimentacoes = [];
        vm.grupo = new GrupoMovimentacoes();
        vm.grupo.nome = '';
        vm.coresFundo = [];
        vm.coresBorda = [];
        vm.dadosGrafico = [];
        vm.labels = [];
        
        vm.add = add;
        vm.alterar = alterar;
        
        var grafico;

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
                var req = {
                    method: 'POST',
                    url: api.url() + 'GrupoMovimentacoes/',
                    data: vm.grupo,
                    headers: auth.header
                };
                if (utilities.online())
                    $http(req).success(success)
                    .error(utilities.apiError);
                else {
                    localEntities.set(new Sync(req));
                    success(vm.grupo);
                }

                function success(data) {
                    localEntities.set(data);
                    data.valor = 0;
                    vm.dados.push(data);
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Grupo adicionado.'
                    });
                    vm.grupo = new GrupoMovimentacoes();
                    vm.grupo.nome = '';
                    criarGrafico();
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
                
                var req = {
                    method: 'PUT',
                    url: api.url() + 'GrupoMovimentacoes/' + vm.grupo.id,
                    data: vm.grupo,
                    headers: auth.header
                };
                if (utilities.online())
                    $http(req).success(success)
                    .error(utilities.apiError);
                else {
                    localEntities.set(new Sync(req));
                    success(vm.grupo);
                }

                function success(data) {
                    localEntities.set(data);
                    vm.dados[index] = data;
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Grupo alterado.'
                    });
                    vm.grupo = new GrupoMovimentacoes();
                    vm.grupo.nome = '';
                    criarGrafico();
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

                var req = {
                    method: 'DELETE',
                    url: api.url() + 'GrupoMovimentacoes/' + vm.grupo.id,
                    headers: auth.header
                };
                if (utilities.online())
                    $http(req).success(success)
                    .error(utilities.apiError);
                else {
                    localEntities.set(new Sync(req));
                    success();
                }

                function success() {
                    localEntities.remove('GrupoMovimentacoes', vm.grupo.id);
                    vm.dados.splice(index, 1);
                    $ionicPopup.alert({
                        title: 'Sucesso!',
                        template: 'Grupo excluído.'
                    });
                    vm.grupo = new GrupoMovimentacoes();
                    vm.grupo.nome = '';
                    criarGrafico();
                }
            });
        }

        function criarGrafico() {
            var ctx = document.getElementById("graficoGrupos");
            vm.coresFundo = vm.dados.map(function (grupo, i) {
                return utilities.getColor(i, true);
            });
            vm.coresBorda = vm.dados.map(function (grupo, i) {
                return utilities.getColor(i, false);
            });
            vm.dadosGrafico = vm.dados.map(function (grupo) {
                return grupo.valor;
            });
            vm.labels = vm.dados.map(function (grupo) {
                return grupo.nome;
            });
            grafico = new Chart(ctx, {
                type: 'pie',
                data: {
                    datasets: [{
                        label: 'Valor acumulado',
                        backgroundColor: vm.coresFundo,
                        borderColor: vm.coresBorda,
                        data: vm.dadosGrafico,
                        borderWidth: 4
                    }],
                    labels: vm.labels
                },
                options: {
                    responsive: true,
                    title: {
                        display: false
                    },
                    layout: {
                        padding: 10
                    },
                    legend: {
                        display: false,
                        // position: 'right',
                        // labels: {
                        //     boxWidth: 12,
                        //     fontSize: 16
                        // }
                    }
                }
            });
        }

        function carregarDados() {
            if (utilities.online()) {
                $http({
                    method: 'GET',
                    url: api.url() + 'GrupoMovimentacoes/Usuario/' + auth.id,
                    headers: auth.header
                }).success(success)
                .error(utilities.apiError);
                $http({
                    url: api.url() + 'Movimentacoes/Usuario/' + auth.id,
                    method: 'GET',
                    headers: auth.header
                }).success(function (data) {
                    vm.movimentacoes = data.movimentacoes;
                    associaGrupoMov();
                }).error(utilities.apiError);
            } else {
                localEntities.getAll('GrupoMovimentacoes').then(success);
                localEntities.getAll('Movimentacao').then(function (data) {
                    vm.movimentacoes = data;
                    localEntities.getAll('Transferencia').then(function (data) {
                        data.forEach(function(transf) {
                            for (var i = 0; i < vm.movimentacoes.length; i++) {
                                var mov = vm.movimentacoes[i];
                                if (transf.receitaId == mov.id || transf.despesaId == mov.id)
                                    vm.movimentacoes.splice(i--, 1);
                            }
                        }, this);
                        associaGrupoMov();
                    });
                });
            }

            function success(data) {
                vm.dados = data;
                associaGrupoMov();
            }
        }

        function associaGrupoMov() {
            if (vm.movimentacoes.length == 0 || vm.dados.length == 0)
                return;
            vm.dados.forEach(function (grupo) {
                grupo.valor = 0;
            })
            for (var i = 0; i < vm.movimentacoes.length; i++) {
                var mov = vm.movimentacoes[i];
                if (mov.tipoMovimentacao == 0)
                    vm.movimentacoes.splice(i--, 1);
                else
                    for (var j = 0; j < vm.dados.length; j++) {
                        var grupo = vm.dados[j];
                        if (grupo.id == mov.grupoMovimentacoesId)
                            grupo.valor += mov.valor;
                    }
            }
            criarGrafico();
        }
    }
})();
