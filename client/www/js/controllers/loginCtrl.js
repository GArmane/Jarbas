(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('loginController', loginController);

    loginController.$inject = ['LoginService', '$state', 'api', '$ionicPopup', '$scope', 'promiseError'];
    function loginController(LoginService, $state, api, $ionicPopup, $scope, promiseError) {
        var vm = this;

        vm.dados = {
            email: '',
            senha: '',
            codigoRec: '',
            novaSenha: '',
            confirmaSenha: ''
        };
        vm.erro = false;
        vm.erroMsg = '';
        
        vm.fazerLogin = fazerLogin;
        vm.loginGoogle = loginGoogle;

        activate();

        //////////////// Public

        function activate() {

        }

        function fazerLogin() {
            LoginService.doLogin(vm.dados.user, vm.dados.pass)
                .then(loginSuccess, promiseError.rejection)
                .catch(promiseError.exception);
        }

        function loginGoogle() {
            LoginService.gLogin().then(loginSuccess, promiseError.rejection).catch(promiseError.exception);
        }

        //////////////// Private

        function loginSuccess(data) {
            /// TODO: Se for o primeiro acesso, não vai para a tela principal e sim
            /// para a tela de perfil completar o cadastro
            console.log(data);
            console.log('E A E   C A P A T R Ã O');
            return;
            if (result)
                $state.go('app.principal'); /// TODO: principal? acho que não
        }
    }
})();
