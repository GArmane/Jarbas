(function() {
'use strict';

    angular
        .module('starter.services')
        .value('auth', {
            done: false,
            data: null,
            id: null,
            token: null
        })
        .service('LoginService', LoginService);

    LoginService.$inject = ['api', '$http', 'auth', '$ionicPopup', '$rootScope'];
    function LoginService(api, $http, auth, $ionicPopup, $rootScope) {
        this.doLogin = doLogin;
        this.recover = recover;
        this.gLogin = gLogin;
        this.fLogin = fLogin;

        var auth2 = {};
        
        activate();

        ////////////////

        function activate() {
            window.gapi.load('auth2', function() {
                auth2 = gapi.auth2.init({
                    client_id: '641375641307-rcps29q38f8k9k19u7sribgt66c9n3l6.apps.googleusercontent.com',
                });
            });
        }

        function defineAuth(authResult) {
            if (authResult) {
                auth.data = authResult;
                auth.done = true;
                auth.token = authResult.tokenUsuario.tokenUsuario;
                auth.id = authResult.usuario.id;
            } else
                auth.done = false;
        }

        function doLogin(user, pass, cb) {
            if (!api.on()) {
                auth.done = true;
                cb(true);
                return;
            }
            $http({
                method: 'POST',
                url: api.url() + 'logins',
                data: { email: user, senha: pass }
            }).success(function (data) {
                defineAuth(data);
                cb(true);
            }).error(function (data) {
                auth.done = false;
                console.log(data);
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data[0].errorMessage
                });
                cb(false);
            });
        }

        function recover(email, $scope) { /// TODO: tira esse $scope daqui que isso é  C A G A D A
            $ionicPopup.show({
                title: 'Recuperar Conta',
                template: '<label class="item item-input"><input ng-model="vm.dados.usuario" type="email" placeholder="E-mail"></label>',
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
                $http({
                    method: 'POST',
                    url: api.url() + 'logins/recuperar',
                    data: email,
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    
                    /// TODO: No lugar dessa mensagem, mostra outro dialog solicitando o código enviado por email e a nova senha
                    $ionicPopup.alert({
                        title: 'Falta pouco!',
                        template: 'Enviamos um e-mail com um link e instruções para que você possa recuperar a sua conta ;)'
                    });

                }).error(function (data) {
                    console.log(data);
                    $ionicPopup.alert({
                        title: 'Ops!',
                        template: data[0].errorMessage
                    });
                });
            });
        }
        
        function gLogin(cb) {
            console.log('Logando com Google...');
            auth2.grantOfflineAccess().then(function(authRes) {
                console.log('Objeto de auth obtido:')
                console.log(authRes);
                if (authRes['code']) {
                    console.log('Código da auth: ' + authRes['code']);
                    var data = {
                        'grant_type': 'googleAuth',
                        'id_token': authRes['code'],
                        'scope': 'api1 offline_access',
                        'client_id': 'jarbasApp',
                        'client_secret': 'secret'
                    };
                    console.log('Enviando dados para a API:')
                    console.log(data);
                    $http({
                        method: 'POST',
                        url: 'http://localhost:5000/connect/token',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        transformRequest: formUrlEncode,
                        data: data
                    }).success(function(data) {
                        console.log('API retornou sucesso:')
                        console.log(data);
                        // defineAuth(data); /// TODO: Trata o retorno da api no objeto auth
                        cb(true);
                    }).error(function(data) {
                        console.log('API retornou falha:')
                        console.log(data);
                        $ionicPopup.alert({
                            title: 'Ops!',
                            template: data[0].errorMessage
                        });
                        cb(false);
                    });
                } else {
                    console.log('Falha na autenticação: objeto auth não possui código.');
                    $ionicPopup.alert({
                        title: 'Ops!',
                        template: 'Ocorreu uma falha no processo de autenticação com Google.'
                    });
                    cb(false);
                }
            });
        }

        function fLogin() {
            
        }

        function formUrlEncode(obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
    }
})();