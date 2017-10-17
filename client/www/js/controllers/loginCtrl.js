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
        vm.api = api;
        
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
                .then(function (res) {
                    if (utilities.isApp()) {
                        $ionicLoading.hide();
                        $ionicPopup.show({
                            title: 'ServerAuthCode',
                            template: '<input value="' + res.serverAuthCode + '">',
                            buttons: [{
                                text: 'Cancelar',
                                type: 'button-default',
                                onTap: function () {
                                    return false;
                                }
                            }, {
                                text: 'Prosseguir com login',
                                type: 'button-positive',
                                onTap: function () {
                                    $ionicLoading.show();
                                    return true;
                                }
                            }]
                        }).then(function (pross) {
                            if (pross)
                                LoginService.gLogin(res)
                                    .then(loginSuccess, utilities.promiseRejection)
                                    .catch(utilities.promiseException);
                        });
                    } else {
                        LoginService.gLogin(res)
                            .then(loginSuccess, utilities.promiseRejection)
                            .catch(utilities.promiseException);
                    }
                }, utilities.promiseRejection)
                .catch(utilities.promiseException);
                // .then(LoginService.gLogin, utilities.promiseRejection)
                // .then(loginSuccess, utilities.promiseRejection)
                // .catch(utilities.promiseException);
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
