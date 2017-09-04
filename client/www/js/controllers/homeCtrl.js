(function() {
'use strict';

    angular
        .module('starter.controllers')
        .controller('homeController', homeController);

    homeController.$inject = ['auth', '$state', 'api', '$http', '$ionicPopup', '$scope', '$ionicLoading', 'utilities'];
    function homeController(auth, $state, api, $http, $ionicPopup, $scope, $ionicLoading, utilities) {
        var vm = this;

        vm.dados = {};
        vm.dados.contas = [];
        vm.dados.movimentacoes = [];
        
        vm.tooltipAjuda = tooltipAjuda;

        activate();

        function activate() {
            $ionicLoading.hide();
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
            }).error(utilities.apiError);
            $http({
                url: api.url() + 'Movimentacoes/Usuario/' + auth.id,
                method: 'GET',
                headers: auth.header
            }).success(function (data) {
                vm.dados.movimentacoes = data;
            }).error(utilities.apiError);
        }
    }
})();

