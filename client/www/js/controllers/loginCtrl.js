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
            LoginService.doLogin(vm.dados.email, vm.dados.senha)
                .then(loginSuccess, promiseError.rejection)
                .catch(promiseError.exception);
        }

        function loginGoogle() {
            LoginService.gDialog()
                .then(LoginService.gLogin, promiseError.rejection)
                .then(loginSuccess, promiseError.rejection)
                .catch(promiseError.exception);
        }

        //////////////// Private

        function loginSuccess() {
            $state.go('app.tela_inicial');
        }
    }
})();
