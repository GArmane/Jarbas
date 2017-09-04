(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('cadastroController', cadastroController);

    cadastroController.$inject = ['auth', 'api', '$http', '$ionicPopup', 'tooltipAjuda', 'LoginService', 'utilities', '$state'];
    function cadastroController(auth, api, $http, $ionicPopup, tooltipAjuda, LoginService, utilities, $state) {
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
            /// retornar uma pontuação de 1 a 100
            if (vm.dados.senha.length >= 8)
                vm.forcaSenha = 100;
            else if (vm.dados.senha.length >= 6)
                vm.forcaSenha = 76;
            else if (vm.dados.senha.length >= 4)
                vm.forcaSenha = 26;
            else
                vm.forcaSenha = 0;
        }

        function cadastrar() {
            $http({
                url: api.url() + 'usuarios',
                method: 'POST',
                data: vm.dados,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                LoginService.doLogin(vm.dados.email, vm.dados.senha)
                    .then(function () {
                        $state.go('app.tela_inicial');
                        $ionicPopup.alert({
                            title: 'Bem-vindo ao Jarbas!'
                        });
                    }, utilities.promiseRejection)
                    .catch(utilities.promiseException);
            }).error(utilities.apiError);
        }

        function tooltipSenha() {
            // tooltipAjuda.create();
        }

        function cadastroGoogle() {
            LoginService.gDialog().then(function (auth) {
                $http({
                    url: api.url() + 'Usuarios/Google/',
                    data: '"' + auth.code + '"',
                    method: 'POST',
                }).success(function (data) {
                    LoginService.defineAuth(data.token, data.usuario.email).then(function () {
                        $state.go('app.tela_inicial');
                        $ionicPopup.alert({
                            title: 'Sucesso!',
                            template: 'Seu cadastro foi realizado. Bem-vindo ao Jarbas!'
                        });
                    }, utilities.promiseRejection).catch(utilities.promiseException);
                }).error(utilities.apiError);
            }, utilities.promiseRejection)
            .catch(utilities.promiseException);
        }

        function cadastroFacebook() {
            
        }
    }
})();
