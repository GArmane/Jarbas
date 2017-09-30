(function () {
    'use strict';

    angular.module('starter')

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'templates/menu.html',
                    controller: 'AppCtrl'
                })

                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'loginController',
                    controllerAs: 'vm'
                })

                .state('app.cadastro', {
                    url: '/cadastro',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/cadastro.html',
                            controller: 'cadastroController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.complete_cad', {
                    url: '/complete_cad',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/complete_cad.html'
                        }
                    }
                })
                .state('app.tela_inicial', {
                    url: '/tela_inicial',
                    cache: false,
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/tela_inicial.html',
                            controller: 'homeController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.lista_contas', {
                    url: '/lista_contas',
                    cache: false,
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/lista_contas.html',
                            controller: 'listaContaController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.grupos_movimentacoes', {
                    url: '/grupos_movimentacoes',
                    cache: false,
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/grupos_movimentacoes.html',
                            controller: 'listaGrupoMovController',
                            controllerAs: 'vm'
                        }
                    }
                })

                .state('app.lista_movimentacoes', {
                    url: '/lista_movimentacoes',
                    cache: false,
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/lista_movimentacoes.html',
                            controller: 'listaMovimentacaoController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.add_movimentacao', {
                    url: '/add_movimentacao',
                    cache: false,
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/add_movimentacao.html',
                            controller: 'movimentacaoController',
                            controllerAs: 'vm'
                        }
                    }
                })
                 .state('app.personalizado', {
                    url: '/personalizado',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/personalizado.html',
                            controller: 'movimentacaoController',
                            controllerAs: 'vm'
                        }
                    }
                })

                .state('app.add_movimentacao_param', {
                    url: '/add_movimentacao/:id/:transf',
                    cache: false,
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/add_movimentacao.html',
                            controller: 'movimentacaoController',
                            controllerAs: 'vm'
                        }
                    }
                })
                /*.state('app.single', {
                    url: '/playlists/:playlistId',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/playlist.html',
                            controller: 'PlaylistCtrl'
                        }
                    }
                })*/;
            
            // Rota default
            $urlRouterProvider.otherwise('/login');
        });
})();
