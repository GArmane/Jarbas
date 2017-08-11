(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('loginController', loginController);

    loginController.$inject = ['LoginService', '$state', 'api', '$ionicPopup', '$scope', '$rootScope'];
    function loginController(LoginService, $state, api, $ionicPopup, $scope, $rootScope) {
        var vm = this;

        vm.dados = {};
        
        vm.fazerLogin = fazerLogin;
        vm.recuperarConta = recuperarConta;
        vm.apiChange = apiChange;
        vm.tipoChange = tipoChange;

        activate();

        ////////////////

        function activate() {
            vm.apiOn = api.on();
        }

        function fazerLogin() {
            LoginService.doLogin(vm.dados.user, vm.dados.pass, function () { $state.go('app.principal'); })
        }

        function recuperarConta() {
            $ionicPopup.show({
                title: 'Recuperar Conta',
                template: '<label class="item item-input"><input ng-model="vm.dados.user" type="email" placeholder="E-mail"></label>',
                scope: $scope,
                buttons: [{
                    text: 'Cancelar',
                    type: 'button-default'
                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        return vm.dados.user;
                    }
                }]
            }).then(function(email) {
                if(!email) return;
                if (!api.on()) {
                    $ionicPopup.alert({
                        title: 'Falta pouco!',
                        template: 'Enviamos um e-mail com um link e instruções para que você possa recuperar a sua conta ;)'
                    });
                    return;
                }
                LoginService.recover(email);
            });
        }

        function apiChange() {
            if (!vm.apiOn)
                vm.dados = { user: 'asdf@asdf.com', pass: 'asdf' };
            api.on(vm.apiOn);
        }

        function tipoChange() {
            $rootScope.participante = vm.part;
        }
    }
})();