(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('cadastroController', cadastroController);

    cadastroController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', 'tooltipAjuda', 'LoginService', 'promiseError'];
    function cadastroController(auth, $state, api, $http, $ionicPopup, $scope, tooltipAjuda, LoginService, promiseError) {
        var vm = this;

        vm.dados = {
            nome: '',
            email: '',
            senha: ''
        };
        vm.confirmaSenha = '';
        vm.forcaSenha = 0;
        
        vm.analisaSenha = analisaSenha;
        vm.cadastrar = cadastrar;
        vm.tooltipSenha = tooltipSenha;
        vm.cadastroGoogle = cadastroGoogle;
        vm.cadastroFacebook = cadastroFacebook;

        activate();

        ////////////////

        function activate() {

        }

        function analisaSenha() {
            /// TODO: usa uns regex pra testar a força da senha e
            /// retornar uma pontuação de 1 a 10
            if (vm.dados.senha.length > 6)
                vm.forcaSenha = 10;
            else
                vm.forcaSenha = 0;
        }

        function cadastrar() {
            $http({
                url: api.url() + 'usuarios',
                method: 'POST',
                data: vm.dados
            }).success(function (data) {
                LoginService.defineAuth(data);
                $state.go('app.principal'); /// TODO: principal? acho que não
            }).error(function (data) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data[0].errorMessage
                });
            });
        }

        function tooltipSenha() {
            // tooltipAjuda.create();
        }

        function cadastroGoogle() {
            LoginService.gLogin().then(loginResult, promiseError.rejection).catch(promiseError.exception);
        }

        function cadastroFacebook() {
            
        }

        function loginResult(result) {
            /// TODO: Se for o primeiro acesso, não vai para a tela principal e sim
            /// para a tela de perfil completar o cadastro
            if (result)
                $state.go('app.principal'); /// TODO: principal? acho que não
        }
    }
})();
