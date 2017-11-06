// (function () {
//     'use strict';

//     angular
//         .module('starter.controllers')
//         .controller('movimentacaoController', movimentacaoController);

//     movimentacaoController.$inject = ['auth', '$state', '$stateParams', 'api', '$http', '$ionicPopup', 'utilities', '$scope'];

//     function movimentacaoController(auth, $state, $stateParams, api, $http, $ionicPopup, utilities, $scope) {
//         var vm = this;

//         vm.dados = {};
//         vm.dados.agendamento = {};
//         vm.dados.agendamento.diasSemana = [];
//         vm.contas = [];
//         vm.contasTransf = [];
//         vm.grupos = [];
//         vm.alteracao = false;
//         vm.originalTransf = false;
//         vm.contaDestino = {};
//         vm.contaSelecionada = {};
//         vm.escalaTempo = [
//             { name: 'Diário', id: 0 },
//             { name: 'Semanal', id: 1 },
//             { name: 'Mensal', id: 3 },
//             { name: 'Anual', id: 4 },
//             { name: 'Personalizado', id: 5 }
//         ];
//         vm.escalaEnum = {
//             diario: 0,
//             semanal: 1,
//             mensal: 3,
//             anual: 4,
//             personalizado: 5
//         };
//         vm.diaSemana = {
//             domingo: 0,
//             segunda: 1,
//             terca:   2,
//             quarta:  3,
//             quinta:  4,
//             sexta:   5,
//             sabado:  6
//         };
//         vm.escalaPersonalizada = 0;

//         var transferenciaOriginal = {};

//         vm.salvar = salvar;
//         vm.alterar = alterar;
//         vm.excluir = excluir;
//         vm.listaContaTransf = listaContaTransf;
//         vm.personalizar = personalizar;
//         vm.diaSemanaSelecionado = diaSemanaSelecionado;
//         vm.selecionarDiaSemana = selecionarDiaSemana;
//         vm.setarRepeticaoMensal = setarRepeticaoMensal;
//         vm.cancelar = cancelar;
//         vm.resetarAgendamento = resetarAgendamento;

//         activate();

//         ////////////////

//         function activate() {
//             if (!auth.verify())
//                 return;
//             carregarDados();
//             vm.alteracao = !!$stateParams.id;
//         }

//         //////////////// Public

//         function salvar() {
//             if (vm.dados.tipoMovimentacao == 2) {
//                 var transf = {
//                     despesa: JSON.parse(JSON.stringify(vm.dados)),
//                     receita: JSON.parse(JSON.stringify(vm.dados))
//                 };
//                 transf.despesa.tipoMovimentacao = 1;
//                 transf.receita.contaContabilId = vm.contaDestino.id;
//                 transf.receita.tipoMovimentacao = 0;
//                 transf.receita.valor = (transf.despesa.valor * vm.contaSelecionada.moeda.cotacaoComercial) / vm.contaDestino.moeda.cotacaoComercial;

//                 $http({
//                     url: api.url() + 'Movimentacoes/Transferencia/',
//                     method: 'POST',
//                     data: transf,
//                     headers: auth.header
//                 }).success(function (data) {
//                     history.back();
//                     $ionicPopup.alert({
//                         title: 'Sucesso!',
//                         template: 'Movimentação inserida.'
//                     });
//                 }).error(function (data) {
//                     utilities.apiError(data);
//                     agendamentoCarregado();
//                 });
//             } else {
//                 $http({
//                     url: api.url() + 'Movimentacoes/',
//                     method: 'POST',
//                        data: vm.dados,
//                     headers: auth.header
//                 }).success(function (data) {
//                     history.back();
//                     $ionicPopup.alert({
//                         title: 'Sucesso!',
//                         template: 'Movimentação inserida.'
//                     });
//                 }).error(function (data) {
//                     agendamentoCarregado();
//                     utilities.apiError(data);
//                 });
//             }
//         }

//         function alterar() {
//             agendamentoSalvar();
//             if (vm.dados.tipoMovimentacao == 2) {
//                 var transf = {
//                     despesa: JSON.parse(JSON.stringify(vm.dados)),
//                     receita: JSON.parse(JSON.stringify(vm.dados))
//                 };
//                 transf.id = transferenciaOriginal.id;
//                 transf.despesa.id = transferenciaOriginal.despesa.id;
//                 transf.despesa.tipoMovimentacao = 1;
//                 transf.receita.id = transferenciaOriginal.receita.id;
//                 transf.receita.contaContabilId = vm.contaDestino.id;
//                 transf.receita.tipoMovimentacao = 0;
//                 transf.receita.valor = (transf.despesa.valor * vm.contaSelecionada.moeda.cotacaoComercial) / vm.contaDestino.moeda.cotacaoComercial;

//                 $http({
//                     url: api.url() + 'Movimentacoes/Transferencia/' + transf.id,
//                     method: 'PUT',
//                     data: transf,
//                     headers: auth.header
//                 }).success(function (data) {
//                     history.back();
//                     $ionicPopup.alert({
//                         title: 'Sucesso!',
//                         template: 'Movimentação alterada.'
//                     });
//                 }).error(function (data) {
//                     agendamentoCarregado();
//                     utilities.apiError(data);
//                 });
//             } else {
//                 $http({
//                     url: api.url() + 'Movimentacoes/' + vm.dados.id,
//                     method: 'PUT',
//                     data: vm.dados,
//                     headers: auth.header
//                 }).success(function (data) {
//                     history.back();
//                     $ionicPopup.alert({
//                         title: 'Sucesso!',
//                         template: 'Movimentação alterada.'
//                     });
//                 }).error(function (data) {
//                     agendamentoCarregado();
//                     utilities.apiError(data);
//                 });
//             }
//         }

//         function excluir() {
//             $ionicPopup.confirm({
//                 title: 'Excluir movimentação',
//                 template: 'Tem certeza que deseja excluir a movimentação ' + vm.dados.descricao + '?'
//             }).then(function (res) {
//                 if (res) {
//                     if (vm.dados.tipoMovimentacao == 2) {
//                         $http({
//                             method: 'DELETE',
//                             url: api.url() + '/Movimentacoes/Transferencia/' + vm.dados.id,
//                             headers: auth.header
//                         }).success(function () {
//                             history.back();
//                             $ionicPopup.alert({
//                                 title: 'Sucesso!',
//                                 template: 'Movimentação excluída.'
//                             });
//                         }).error(utilities.apiError);
//                     } else {
//                         $http({
//                             method: 'DELETE',
//                             url: api.url() + 'Movimentacoes/' + vm.dados.id,
//                             headers: auth.header
//                         }).success(function () {
//                             history.back();
//                             $ionicPopup.alert({
//                                 title: 'Sucesso!',
//                                 template: 'Movimentação excluída.'
//                             });
//                         }).error(utilities.apiError);
//                     }
//                 }
//             });
//         }

//         function cancelar() {
//             history.back();
//         }

//         //////////////// Private

//         function carregarDados() {
//             if ($stateParams.id && $stateParams.transf == 'true')
//                 $http({
//                     url: api.url() + 'Movimentacoes/Transferencia/' + $stateParams.id,
//                     method: 'GET',
//                     headers: auth.header
//                 }).success(function (data) {
//                     vm.dados = data.despesa;
//                     transferenciaOriginal = data;
//                     vm.originalTransf = true;
//                     vm.dados.tipoMovimentacao = 2;
//                     vm.dados.data = new Date(vm.dados.data);
//                     associaConta();
//                     agendamentoCarregado();
//                     listaContaTransf();
//                 }).error(utilities.apiError);
//             else if ($stateParams.id)
//                 $http({
//                     url: api.url() + 'Movimentacoes/' + $stateParams.id,
//                     method: 'GET',
//                     headers: auth.header
//                 }).success(function (data) {
//                     vm.dados = data;
//                     vm.dados.data = new Date(vm.dados.data);
//                     associaConta();
//                     agendamentoCarregado();
//                 }).error(utilities.apiError);
//             $http({
//                 url: api.url() + 'ContasContabeis/Usuario/' + auth.id,
//                 method: 'GET',
//                 headers: auth.header
//             }).success(function (data) {
//                 vm.contas = data;
//                 if (vm.contas && vm.contas.length > 0 && !$stateParams.id) {
//                     vm.contaSelecionada = vm.contas[0];
//                     vm.dados.contaContabilId = vm.contaSelecionada.id;
//                 } else
//                     associaConta();
//                 agendamentoCarregado();
//             }).error(utilities.apiError);
//             $http({
//                 url: api.url() + 'GrupoMovimentacoes/Usuario/' + auth.id,
//                 method: 'GET',
//                 headers: auth.header
//             }).success(function (data) {
//                 vm.grupos = data;
//                 if (vm.grupos && vm.grupos.length > 0 && !$stateParams.id)
//                     vm.dados.grupoMovimentacoesId = vm.grupos[0].id;
//             }).error(utilities.apiError);
//         }

//         function associaConta() {
//             if (vm.dados.contaContabilId && vm.contas.length > 0) {
//                 vm.contaSelecionada = vm.contas.find(function (conta) {
//                     return conta.id == vm.dados.contaContabilId;
//                 });
//                 if ($stateParams.transf == 'true')
//                     vm.contaDestino = vm.contas.find(function (conta) {
//                         return conta.id == transferenciaOriginal.receita.contaContabilId;
//                     });
//             }
//         }
//     }
// })();
