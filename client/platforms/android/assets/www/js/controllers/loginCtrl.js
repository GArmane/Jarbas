(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('loginController', loginController);

    loginController.$inject = ['LoginService', '$state', 'api', '$ionicPopup', '$scope', 'utilities', '$ionicLoading'];
    function loginController(LoginService, $state, api, $ionicPopup, $scope, utilities, $ionicLoading) {
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
            // alert(document.URL);
        }

        function fazerLogin() {
            startLoading();
            LoginService.doLogin(vm.dados.email, vm.dados.senha)
                .then(loginSuccess, utilities.promiseRejection)
                .catch(utilities.promiseException);
        }

        function loginGoogle() {
            startLoading();
            LoginService.gDialog()
                .then(LoginService.gLogin, utilities.promiseRejection)
                .then(loginSuccess, utilities.promiseRejection)
                .catch(utilities.promiseException);
        }

        //////////////// Private

        function startLoading() {
            $ionicLoading.show({
                content: 'Carregando',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        }

        function loginSuccess() {
            $state.go('app.tela_inicial');
        }
    }
})();
