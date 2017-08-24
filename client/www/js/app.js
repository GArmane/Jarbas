// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter')

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
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

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })


    // .state('app.solicitacoes', {
    //     url: '/solicitacoes',
    //     cache: false,
    //     views: {
    //         'menuContent': {
    //             templateUrl: 'templates/solicitacoes.html',
    //             controller: 'listaController',
    //             controllerAs: 'vm'
    //         }
    //     }
    // })
    // .state('app.solicitacoes_part_param', {
    //     url: '/solicitacoes_part/:id',
    //     cache: false,
    //     views: {
    //         'menuContent': {
    //             templateUrl: 'templates/solicitacoes_part.html',
    //             controller: 'solicitacaoController',
    //             controllerAs: 'vm'
    //         }
    //     }
    // })

     .state('app.tela_inicial', {
    url: '/tela_inicial',
    views: {
      'menuContent': {
        templateUrl: 'templates/tela_inicial.html'
      }
    }
  })

     .state('app.add_movimentacao', {
    url: '/add_movimentacao',
    views: {
      'menuContent': {
        templateUrl: 'templates/add_movimentacao.html'
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

  .state('app.cadastro', {
      url: '/cadastro',
      views: {
        'menuContent': {
          templateUrl: 'templates/cadastro.html'
        }
      }
    })

  .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'loginController',
          controllerAs: 'vm'
        }
      }
    })
  
    .state('app.lista_contas', {
      url: '/lista_contas',
      views: {
        'menuContent': {
          templateUrl: 'templates/lista_contas.html',
        }
      }
    })

    .state('app.lista_movimentacoes', {
      url: '/lista_movimentacoes',
      views: {
        'menuContent': {
          templateUrl: 'templates/lista_movimentacoes.html',
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
