(function() {
'use strict';

    angular
        .module('starter.services')
        .service('auth', authService)
        .service('LoginService', LoginService);

    authService.$inject = ['$state'];
    function authService($state) {
        this.done = false;
        this.data = null;
        this.id = null;
        this.token = null;
        this.expiration = null;
        this.refresh = null;
        this.header = null;
        this.verify = function () {
            if (!this.done)
                $state.go('app.login');
            return this.done;
        };
    }

    LoginService.$inject = ['api', '$http', 'auth'];
    function LoginService(api, $http, auth) {
        this.defineAuth = defineAuth;
        this.doLogin = doLogin;
        this.sendRecoverCode = sendRecoverCode;
        this.recoverChangePswd = recoverChangePswd;
        this.gDialog = gDialog;
        this.gLogin = gLogin;

        var auth2 = {};
        var googleLoaded = false;
        
        activate();

        ////////////////

        function activate() { }
        
        function defineAuth(authResult, email, resolve, reject) {
            if (authResult) {
                auth.done = true;
                auth.data = authResult;
                auth.token = authResult.access_token;
                auth.expiration = authResult.expires_in;
                auth.refresh = authResult.refresh_token;
                auth.header = { 'Authorization': 'Bearer ' + auth.token };

                $http({
                    method: 'GET',
                    url: api.url() + 'Usuarios/Email/' + email,
                    headers: auth.header,
                }).success(function (data) {
                    auth.id = data.id;
                    resolve(data);
                }).error(function (data) {
                    auth.done = false;
                    console.log(data);
                    reject(data.error_description);
                });
            } else
                auth.done = false;
        }
        
        function doLogin(email, senha) {
            return new Promise(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: api.token(),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: formUrlEncode,
                    data: {
                        'client_id': 'jarbasApp',
                        'client_secret': 'secret',
                        'grant_type': 'password',
                        'scope': 'jarbasApi offline_access',
                        'username': email,
                        'password': senha
                    }
                }).success(function (data) {
                    defineAuth(data, email, resolve, reject);
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
                        scope: 'email',
                        fetch_basic_profile: true
                    });
                    googleLoaded = true;
                    cb();
                });
            } else
                cb();
        }
        
        function gDialog() {
            console.log('Lazily loading GAPI...');
            return new Promise(function (resolve, reject) {
                lazyLoadGoogle(cb);
                console.log('Logando com Google...');
                function cb() {
                    auth2.grantOfflineAccess().then(function(authRes) {
                        console.log('Objeto de auth obtido:');
                        console.log(authRes);
                        if (authRes.code)
                            resolve(authRes);
                        else {
                            console.log('Falha na autenticação: objeto auth não possui código.');
                            reject('Ocorreu uma falha no processo de autenticação com Google.');
                        }
                    });
                }
            });
        }

        function gLogin(gAuth) {
            return new Promise(function (resolve, reject) {
                var data = {
                    'grant_type': 'googleAuth',
                    'id_token': gAuth.code,
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

                    var authInstance = gapi.auth2.getAuthInstance();
                    var user = authInstance.currentUser.get();
                    var profile = user.getBasicProfile();
                    var email = profile.getEmail();

                    defineAuth(data, email, resolve, reject); /// TODO: Trata o retorno da api no objeto auth
                    resolve(data);
                }).error(function(data) {
                    console.log('API retornou falha:');
                    console.log(data);
                    reject(data.error_description);
                });
            });
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
