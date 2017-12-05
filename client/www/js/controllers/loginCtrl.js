(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('loginController', loginController);

    loginController.$inject = ['LoginService', '$state', 'api', '$ionicPopup', '$scope', 'utilities', '$ionicLoading', '$http'];
    function loginController(LoginService, $state, api, $ionicPopup, $scope, utilities, $ionicLoading, $http) {
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
        vm.esqueciSenha = esqueciSenha;

        activate();

        //////////////// Public

        function activate() {
            // window.loadingScreen.avoid = true;
            window.loadingScreen.loadingService = $ionicLoading;
            window.loadingScreen.ready = true;

            // $ionicLoading.show();
            LoginService.silentLogin().then(loginSuccess, function () {
                // $ionicLoading.hide();
            });
        }

        function fazerLogin() {
            startLoading();
            LoginService.doLogin(vm.dados.email, vm.dados.senha)
                .then(loginSuccess, utilities.promiseRejection)
                .catch(utilities.promiseException);
        }

        function esqueciSenha() {
            $ionicPopup.show({
                title: 'Recuperar senha',
                template: '<span style="font-size:16px">Digite/confirme seu email:</span><label class="item item-input"><input type="email" ng-model="vm.dados.email"></label>',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar',
                    type: 'button-default',
                    onTap: function () {
                        return false;
                    }
                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function (e) {
                        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(vm.dados.email);
                    }
                }]
            }).then(function (salvar) {
                if (!salvar)
                    return;
                
                $http({
                    method: 'POST',
                    url: api.url() + 'Usuarios/Enviar/' + vm.dados.email
                }).success(function (data) {
                    $ionicPopup.show({
                        title: 'Recuperar senha',
                        template: '<span style="font-size:16px">Enviamos uma mensagem de e-mail para ' + vm.dados.email + ' com um código de recuperação.</span><br><br>' +
                                '<span style="font-size:16px">Digite o código:</span><label class="item item-input"><input type="text" ng-model="vm.dados.codigo"></label>' + 
                                '<span style="font-size:16px">Digite sua nova senha:</span><label class="item item-input"><input type="password" ng-model="vm.dados.novaSenha"></label>' +
                                '<span style="font-size:16px">Confirme sua nova senha:</span><label class="item item-input"><input type="password" ng-model="vm.dados.confirmaSenha"></label>',
                        scope: $scope,
                        buttons: [{
                            text: 'Cancelar',
                            type: 'button-default',
                            onTap: function () {
                                return false;
                            }
                        }, {
                            text: 'OK',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!vm.dados.codigo || !vm.dados.novaSenha || (vm.dados.novaSenha != vm.dados.confirmaSenha)) {
                                    e.preventDefault();
                                    return false;
                                }
                                return true;
                            }
                        }]
                    }).then(function (salvar) {
                        if (!salvar)
                            return;
                        
                        $http({
                            method: 'POST',
                            url: api.url() + 'Usuarios/Recuperar/',
                            data: {
                                email: vm.dados.email,
                                codigo: vm.dados.codigo,
                                senha: vm.dados.novaSenha
                            }
                        }).success(function (data) {
                            $ionicPopup.alert({
                                title: 'Sucesso!',
                                template: 'Sua senha foi alterada.'
                            });
                        }).error(utilities.apiError);
                    });
                }).error(utilities.apiError);
            });
        }

        function loginGoogle() {
            startLoading();
            LoginService.gDialog()
                .then(function (res) {
                    LoginService.gLogin(res)
                        .then(loginSuccess, utilities.promiseRejection)
                        .catch(utilities.promiseException);
                }, utilities.promiseRejection)
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
