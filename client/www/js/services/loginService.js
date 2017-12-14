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
                $state.go('login');
            window.authDone = this.done;
            return this.done;
        };
    }

    LoginService.$inject = ['api', '$http', 'auth', 'utilities', '$rootScope', '$q'];
    function LoginService(api, $http, auth, utilities, $rootScope, $q) {
        this.defineAuth = defineAuth;
        this.doLogin = doLogin;
        this.sendRecoverCode = sendRecoverCode;
        this.recoverChangePswd = recoverChangePswd;
        this.gDialog = gDialog;
        this.gLogin = gLogin;
        this.silentLogin = silentLogin;
        this.logout = logout;

        var auth2 = {};
        var googleLoaded = false;

        var requestingRefresh = false;
        var waitingRequests = [];

        $rootScope.logout = logout;
        
        ////////////////

        function silentLogin() {
            return new Promise(function (resolve, reject) {
                try {
                    localforage.getItem('auth').then(function (value) {
                        if (!value) {
                            reject();
                            return;
                        }

                        // Verifica se o token venceu (ou se está próximo disso)
                        if ((value.date.getTime() + ((value.expiration - 1800) * 1000)) <= new Date().getTime())
                            requestNewToken(value.refresh).then(resolve, reject);
                        else {
                            auth.done = value.done;
                            auth.data = value.data;
                            auth.token = value.token;
                            auth.expiration = value.expiration;
                            auth.refresh = value.refresh;
                            auth.header = value.header;
                            auth.id = value.id;
                            auth.verify();
                            resolve();
                        }
                    });
                } catch (ex) {
                    reject(ex);
                }
            });
        }

        // Muito complexo. Esse método deve ser chamado toda vez que houver um responseError com
        // status 401 Unauthorized. Esse método vai requisitar um novo token usando o refresh token
        // NA PRIMEIRA VEZ QUE FOR INVOCADO. Sempre vai retornar uma promise para continuação da
        // request. ***A primeira promise deve resolver as outras.*** Mas como?
        // function refreshToken(httpConfig) {

        //     return $q(function(resolve, reject) {
        //         if (!requestingRefresh) {
        //             requestingRefresh = true;
        //             requestNewToken(auth.refresh).then(function () {
        //                 requestingRefresh = false;
        //                 $http(waitingRequests.shift()).success(resolve).error(reject);
        //             });
        //         }
        //     });


        // }

        function requestNewToken(token) {
            return new Promise(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: api.token(),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: formUrlEncode,
                    data: {
                        'client_id': 'jarbasApp',
                        'client_secret': 'secret',
                        'grant_type': 'refresh_token',
                        'scope': 'jarbasApi offline_access',
                        'refresh_token': token
                    }
                }).success(function (data) {
                    auth.done = true;
                    auth.date = new Date();
                    auth.token = data.access_token;
                    auth.expiration = data.expires_in;
                    auth.refresh = data.refresh_token;
                    auth.header = { 'Authorization': 'Bearer ' + auth.token };
                    auth.id = value.id;
                    localforage.setItem('auth', new Auth(auth));
                    auth.verify();
                    resolve();
                }).error(function (data) {
                    reject();
                });
            });
        }

        function logout() {
            localforage.removeItem('auth');
            auth.done = false;
            auth.verify();
        }
        
        function defineAuth(authResult, email) {
            return new Promise(function (resolve, reject) {
                try {
                    if (authResult) {
                        auth.done = true;
                        auth.date = new Date();
                        auth.token = authResult.access_token;
                        auth.expiration = authResult.expires_in;
                        auth.refresh = authResult.refresh_token;
                        auth.header = { 'Authorization': 'Bearer ' + auth.token };
        
                        $http({
                            method: 'GET',
                            url: api.url() + 'Usuarios/Email/' + email,
                            headers: auth.header,
                        }).success(function (data) {
                            try {
                                auth.id = data.id;
                                localforage.setItem('auth', new Auth(auth));
                                resolve(data);
                            } catch (error) {
                                utilities.promiseException(error);
                            }
                        }).error(function (data) {
                            try {
                                auth.done = false;
                                console.log(data);
                                if (data.error_description == 'invalid_username_or_password')
                                    reject('E-mail e ou senha incorreto(s).');
                                else
                                    reject(data.error_description);
                            } catch (error) {
                                utilities.promiseException(error);
                            }
                        });
                    } else {
                        auth.done = false;
                        reject('Erro no login: authResult é nulo ou indefinido.');
                    }
                } catch (error) {
                    utilities.promiseException(error);
                }
            });
        }
        
        function doLogin(email, senha) {
            return new Promise(function (resolve, reject) {
                try {
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
                        try {
                            defineAuth(data, email)
                                .then(resolve, reject)
                                .catch(utilities.promiseException);
                        } catch (error) {
                            utilities.promiseException(error);
                        }
                    }).error(function (data) {
                        try {
                            auth.done = false;
                            console.log(data);
                            if (data.error_description == 'invalid_username_or_password')
                                reject('Nome de usuário e/ou senha inválidos');
                            else
                                reject(data.error_description);
                        } catch (error) {
                            utilities.promiseException(error);
                        }
                    });
                } catch (error) {
                    utilities.promiseException(error);
                }
            });
        }
        
        function sendRecoverCode(email) {
            return new Promise(function (resolve, reject) {
                try {
                    $http({
                        method: 'POST',
                        url: api.url() + 'logins/recuperar',
                        data: email
                    }).success(function () {
                        resolve();
                    }).error(function (data) {
                        try {
                            console.log(data);
                            reject(data[0].errorMessage);
                        } catch (error) {
                            utilities.promiseException(error);
                        }
                    });
                } catch (error) {
                    utilities.promiseException(error);
                }
            });
        }
        
        function recoverChangePswd(dados) {
            return new Promise(function (resolve, reject) {
                try {
                    $http({
                        method: 'POST',
                        url: api.url() + 'logins/recuperar', /// TODO: Olha essa URL ai
                        data: dados
                    }).success(function () {
                        resolve();
                    }).error(function (data) {
                        try {
                            console.log(data);
                            reject(data[0].errorMessage);
                        } catch (error) {
                            utilities.promiseException(error);
                        }
                    });
                } catch (error) {
                    utilities.promiseException(error);
                }
            });
        }

        function lazyLoadGoogle(cb) {
            try {
                if (!googleLoaded) {
                    window.gapi.load('auth2', function() {
                        try {
                            auth2 = gapi.auth2.init({
                                client_id: '646057312978-8voqfqkpn4aicqnamtdl7o2pj0k4qkp4.apps.googleusercontent.com',
                                scope: 'email',
                                fetch_basic_profile: true
                            });
                            googleLoaded = true;
                            cb();
                        } catch (error) {
                            utilities.promiseException(error);
                        }
                    });
                } else
                    cb();
            } catch (error) {
                utilities.promiseException(error);
            }
        }
        
        function gDialog() {
            if (utilities.isApp()) {
                return new Promise(function (resolve, reject) {
                    try {
                        window.plugins.googleplus.login({
                            'scopes': 'email',
                            'webClientId': '646057312978-8voqfqkpn4aicqnamtdl7o2pj0k4qkp4.apps.googleusercontent.com',
                            'offline': true,
                        }, function (authRes) {
                            resolve(authRes);
                        }, function (msg) {
                            reject('Ocorreu uma falha no processo de autenticação com Google: ' + msg);
                        });
                    } catch (error) {
                        utilities.promiseException(error);
                    }
                });
            } else {
                console.log('Lazily loading GAPI...');
                return new Promise(function (resolve, reject) {
                    lazyLoadGoogle(cb);
                    console.log('Logando com Google...');
                    function cb() {
                        try {
                            auth2.grantOfflineAccess().then(then, function (err) {
                                if (err.error == 'popup_closed_by_user')
                                    auth2.grantOfflineAccess().then(then, reject);
                                else
                                    reject();
                            });

                            function then(authRes) {
                                try {
                                    console.log('Objeto de auth obtido:');
                                    console.log(authRes);
                                    if (authRes.code)
                                        resolve(authRes);
                                    else {
                                        console.log('Falha na autenticação: objeto auth não possui código.');
                                        reject('Ocorreu uma falha no processo de autenticação com Google.');
                                    }
                                } catch (error) {
                                    utilities.promiseException(error);
                                }
                            }

                        } catch (error) {
                            utilities.promiseException(error);
                        }
                    }
                });
            }
        }

        function gLogin(gAuth) {
            if (utilities.isApp()) {

                return doLogin(gAuth.email, gAuth.userId);

                // return new Promise(function (resolve, reject) {
                //     try {
                //         var data = {
                //             'grant_type': 'googleAuth',
                //             'id_token': gAuth.serverAuthCode,
                //             // 'id_token': gAuth.idToken,
                //             'scope': 'jarbasApi offline_access',
                //             'client_id': 'jarbasApp',
                //             'client_secret': 'secret'
                //         };
                        
                //         $http({
                //             method: 'POST',
                //             url: api.token(),
                //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                //             transformRequest: formUrlEncode,
                //             data: data
                //         }).success(function(data) {
                //             try {
                //                 defineAuth(data, gAuth.email).then(resolve, reject).catch(utilities.promiseException);
                //             } catch (error) {
                //                 utilities.promiseException(error);
                //             }
                //         }).error(function(data) {
                //             try {
                //                 reject(data.error_description);
                //             } catch (error) {
                //                 utilities.promiseException(error);
                //             }
                //         });
                //     } catch (error) {
                //         utilities.promiseException(error);
                //     }
                // });
            } else {
                return new Promise(function (resolve, reject) {
                    try {
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
                            try {
                                console.log('API retornou sucesso:');
                                console.log(data);
            
                                var authInstance = gapi.auth2.getAuthInstance();
                                var user = authInstance.currentUser.get();
                                var profile = user.getBasicProfile();
                                var email = profile.getEmail();
            
                                defineAuth(data, email).then(resolve, reject).catch(utilities.promiseException);
                            } catch (error) {
                                utilities.promiseException(error);
                            }
                        }).error(function(data) {
                            try {
                                console.log('API retornou falha:');
                                console.log(data);
                                reject(data.error_description);
                            } catch (error) {
                                utilities.promiseException(error);
                            }
                        });
                    } catch (error) {
                        utilities.promiseException(error);
                    }
                });
            }
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
