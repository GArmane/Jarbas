(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('loginController', loginController);

    loginController.$inject = ['LoginService', '$state', 'api', '$ionicPopup', '$scope', '$rootScope'];
    function loginController(LoginService, $state, api, $ionicPopup, $scope, $rootScope) {
        var vm = this;

        vm.dados = {
            email: '',
            senha: '',
            codigoRec: '',
            novaSenha: '',
            confirmaSenha: ''
        };
        
        vm.fazerLogin = fazerLogin;
        vm.recuperarConta = recuperarConta;
        vm.loginGoogle = loginGoogle;
        vm.loginFacebook = loginFacebook;

        activate();

        ////////////////

        function activate() {
            vm.apiOn = api.on();
        }

        function fazerLogin() {
            LoginService.doLogin(vm.dados.user, vm.dados.pass, loginResult);
        }

        function recuperarConta() {
            LoginService.recover(email);
        }

        function loginGoogle() {
            LoginService.gLogin(loginResult);
        }

        function loginFacebook(params) {
            
        }

        function loginResult(result) {
            /// TODO: Se for o primeiro acesso, não vai para a tela principal e sim
            /// para a tela de perfil completar o cadastro
            if (result)
                $state.go('app.principal'); /// TODO: principal? acho que não
        }
    }
})();