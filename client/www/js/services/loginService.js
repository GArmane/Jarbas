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

    LoginService.$inject = ['api', '$http', 'auth'];
    function LoginService(api, $http, auth) {
        this.defineAuth = defineAuth;
        this.doLogin = doLogin;
        this.sendRecoverCode = sendRecoverCode;
        this.recoverChangePswd = recoverChangePswd;
        this.gLogin = gLogin;
        this.fLogin = fLogin;

        var auth2 = {};
        var googleLoaded = false;
        
        activate();

        ////////////////

        function activate() {
            
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
        
        function doLogin(user, pass) {
            return new Promise(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: api.token(),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: formUrlEncode,
                    data: {
                        'grant_type': 'password',
                        'scope': 'jarbasApi offline_access',
                        'client_id': 'jarbasApp',
                        'client_secret': 'secret',
                        'username': user,
                        'pass': pass
                    }
                }).success(function (data) {
                    defineAuth(data);
                    resolve(data);
                }).error(function (data) {
                    auth.done = false;
                    console.log(data);
                    reject(data.error_description);
                });
            });
        }
        
        function sendRecoverCode(email) {
            return new Promise(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: api.url() + 'logins/recuperar',
                    data: email
                }).success(function () {
                    resolve();
                }).error(function (data) {
                    console.log(data);
                    reject(data[0].errorMessage);
                });
            });
        }
        
        function recoverChangePswd(dados) {
            return new Promise(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: api.url() + 'logins/recuperar', /// TODO: Olha essa URL ai
                    data: dados
                }).success(function () {
                    resolve();
                }).error(function (data) {
                    console.log(data);
                    reject(data[0].errorMessage);
                });
            });
        }

        function lazyLoadGoogle(cb) {
            if (!googleLoaded) {
                window.gapi.load('auth2', function() {
                    auth2 = gapi.auth2.init({
                        client_id: '646057312978-8voqfqkpn4aicqnamtdl7o2pj0k4qkp4.apps.googleusercontent.com',
                    });
                    if (typeof cb === 'function')
                        cb();
                });
                googleLoaded = true;
            } else
                cb();
        }
        
        function gLogin() {
            console.log('Lazily Loading GAPI...');
            return new Promise(function (resolve, reject) {
                lazyLoadGoogle(cb);
                console.log('Logando com Google...');
                function cb() {
                    auth2.grantOfflineAccess().then(function(authRes) {
                        console.log('Objeto de auth obtido:');
                        console.log(authRes);
                        if (authRes.code) {
                            console.log('Código da auth: ' + authRes.code);
                            var data = {
                                'grant_type': 'googleAuth',
                                'id_token': authRes.code,
                                'scope': 'jarbasApi offline_access',
                                'client_id': 'jarbasApp',
                                'client_secret': 'secret'
                            };
                            console.log('Enviando dados para a API:');
                            console.log(data);
                            $http({
                                method: 'POST',
                                url: api.token(),
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                transformRequest: formUrlEncode,
                                data: data
                            }).success(function(data) {
                                console.log('API retornou sucesso:');
                                console.log(data);
                                // defineAuth(data); /// TODO: Trata o retorno da api no objeto auth
                                resolve(data);
                            }).error(function(data) {
                                console.log('API retornou falha:');
                                console.log(data);
                                reject(data.error_description);
                            });
                        } else {
                            console.log('Falha na autenticação: objeto auth não possui código.');
                            reject('Ocorreu uma falha no processo de autenticação com Google.');
                        }
                    });
                }
            });
        }

        function fLogin() {
            
        }

        function formUrlEncode(obj) {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p))
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
    }
})();