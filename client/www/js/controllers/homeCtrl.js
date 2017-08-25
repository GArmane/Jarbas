(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('homeController', homeController);

    homeController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope'];
    function homeController(auth, $state, api, $http, $ionicPopup, $scope) {
        var vm = this;

        vm.dados = {};
        vm.dados.contas = [];
        vm.dados.movimentacoes = [];
        
        vm.tooltipAjuda = tooltipAjuda;

        activate();

        function activate() {
            if (!auth.verify())
                return;
            carregarDados();
        }

        //////////////// Public

        function tooltipAjuda() {
            
        }

        //////////////// Private

        function carregarDados() {
            $http({
                url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.dados.contas = data;
            }).error(function (data) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data[0].errorMessage
                });
            });
            $http({
                url: api.url() + 'Movimentacoes/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.dados.movimentacoes = data;
            }).error(function (data) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: data[0].errorMessage
                });
            });
        }
    }
})();

