(function () {
    'use strict';

    angular
        .module('starter.controllers')
        .controller('listaObjetivoController', listaObjetivoController);

    listaObjetivoController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$timeout', 'utilities'];

    function listaObjetivoController(auth, $state, api, $http, $ionicPopup, $scope, $timeout, utilities) {
        var vm = this;

        vm.dados = [];

        activate();

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
        }

        //////////////// Public

        
        //////////////// Private

        function carregarDados() {
            if (utilities.online())
                $http({
                    method: 'GET',
                    url: api.url() + 'Objetivos/Usuario/' + auth.id,
                    headers: auth.header
                }).success(success).error(utilities.apiError);
            else
                localEntities.getAll('Objetivo').then(success);

            function success(data) {
                vm.dados = data;
            }
        }
    }
})();
