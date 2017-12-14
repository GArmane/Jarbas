(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('perfilController', perfilController);

    perfilController.$inject = ['auth', '$state', 'api', '$http', '$scope', 'utilities', '$ionicLoading', '$ionicPopup'];
    function perfilController(auth, $state, api, $http, $scope, utilities, $ionicLoading, $ionicPopup) {
        var vm = this;

        vm.dados = {};
        vm.grupos = [
            { 
                titulo: 'Alimentação',
                descricao: 'Restaurante, fast-food, lanchonete, etc.',
                checked: false
            },
            { 
                titulo: 'Transporte',
                descricao: 'Ônibus, metrô, Taxi, combustível, etc.',
                checked: false
            },
            { 
                titulo: 'Contas e serviços',
                descricao: 'Luz, água, telefone, internet, etc.',
                checked: false
            },
            { 
                titulo: 'Bens duráveis',
                descricao: 'Roupas, eletrônicos, livros etc.',
                checked: false
            },
            { 
                titulo: 'Supermercado',
                descricao: 'Produtos de limpeza, cesta básica, etc.',
                checked: false
            },
            { 
                titulo: 'Lazer',
                descricao: 'Balada, parque, cinema, viagens, etc.',
                checked: false
            }
        ];
        vm.contas = [
            {
                titulo: 'Conta corrente',
                descricao: 'Débito em conta',
                checked: false
            },
            {
                titulo: 'Carteira',
                descricao: 'Dinheiro',
                checked: false
            },
            {
                titulo: 'Cartão de crédito',
                descricao: 'Crédito',
                checked: false
            }
        ];
        vm.moedas = [];

        vm.cadastrar = cadastrar;
        vm.pular = pular;
        vm.tooltipRenda = tooltipRenda;

        activate();

        ////////////////

        function activate() {
            $http({
                method: 'GET',
                url: api.url() + 'Moedas',
                headers: auth.header
            }).success(function (data) {
                vm.moedas = data;
                vm.dados.moedaId = vm.moedas[0].id;
            });
        }

        function pular() {
            $state.go('app.tela_inicial');
            $ionicPopup.alert({
                title: 'Sucesso!',
                template: 'Seu cadastro foi realizado. Bem-vindo ao Jarbas!'
            });
        }

        function cadastrar() {
            var restante = 0, rodouTudo;
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br><br>Estamos adaptando sua conta ao seu perfil. Por favor aguarde.',
                scope: $scope
            });
            vm.grupos.forEach(function (grupo) {
                if (grupo.checked) {
                    restante++;
                    $http({
                        method: 'POST',
                        url: api.url() + 'GrupoMovimentacoes/',
                        data: {
                            usuarioId: auth.id,
                            nome: grupo.titulo
                        },
                        headers: auth.header
                    }).success(finaliza).error(finaliza);
                }
            });
            vm.contas.forEach(function (conta) {
                if (conta.checked) {
                    restante++;
                    $http({
                        method: 'POST',
                        url: api.url() + 'ContasContabeis/',
                        data: {
                            usuarioId: auth.id,
                            moedaId: vm.dados.moedaId,
                            nome: conta.titulo,
                            saldo: 0
                        },
                        headers: auth.header
                    }).success(finaliza).error(finaliza);
                }
            });
            rodouTudo = true;

            function finaliza() {
                restante--;
                if (restante == 0 && rodouTudo) {
                    $ionicLoading.hide();
                    pular();
                }
            }
        }

        function tooltipRenda() {
            /// TODO: Quando resolver o tooltip do login, resolve aqui também
        }
    }
})();
