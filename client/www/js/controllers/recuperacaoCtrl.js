(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('recuperacaoController', recuperacaoController);

    recuperacaoController.$inject = ['$stateParams', '$ionicPopup', '$scope', 'tooltipAjuda', 'LoginService', 'promiseError'];

    function recuperacaoController($stateParams, $ionicPopup, $scope, tooltipAjuda, LoginService, promiseError) {
        var vm = this;

        vm.dados = {
            email: '',
            codigo: '',
            senha: ''
        };
        vm.confirmaSenha = '';
        vm.forcaSenha = 0;
        vm.passo = 1;

        vm.analisaSenha = analisaSenha;
        vm.tooltipSenha = tooltipSenha;
        vm.enviarCodigo = enviarCodigo;
        vm.alterarSenha = alterarSenha;

        activate();

        ////////////////

        function activate() {
            if ($stateParams.email)
                vm.dados.email = $stateParams.email;
        }

        function analisaSenha() {
            /// TODO: usa uns regex pra testar a força da senha e
            /// retornar uma pontuação de 1 a 10
            if (vm.dados.senha.length > 6)
                vm.forcaSenha = 10;
            else
                vm.forcaSenha = 0;
        }

        function enviarCodigo() {
            LoginService.sendRecoverCode(vm.Dados.email)
                .then(function () {
                    vm.passo = 2; // Ativa os inputs para digitação de código e nova senha
                }, promiseError.rejection)
                .catch(promiseError.exception);
        }
                 
        function alterarSenha() {
            LoginService.recoverChangePswd(vm.dados)
                .then(function () {
                    $ionicPopup.alert({
                        title: 'Ops!',
                        template: 'Senha alterada com sucesso!'
                    }).then(function () {
                        history.back();
                    });
                }, promiseError.rejection)
                .catch(promiseError.exception);
        }

        function tooltipSenha() {
            // tooltipAjuda.create()
        }
    }
})();
