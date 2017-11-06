function Movimentacao(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    if (data.contaContabil)
        this.contaContabil = new ContaContabil(data.contaContabil);
    this.contaContabilId = data.contaContabilId;
    if (data.grupoMovimentacoes)
        this.grupoMovimentacoes = new GrupoMovimentacoes(data.grupoMovimentacoes);
    this.grupoMovimentacoesId = data.grupoMovimentacoesId;
    this.valor = data.valor;
    this.descricao = data.descricao;
    this.agendamentoId = data.agendamentoId;
    if (data.agendamento)
        this.agendamento = new Agendamento(data.agendamento);
    this.data = data.data;
    this.tipoMovimentacao = data.tipoMovimentacao;
}

localEntities.register(Movimentacao, {
    id: {
        type: 'number',
        pk: true
    },
    contaContabil: {
        type: 'ContaContabil',
        relationKey: 'contaContabilId'
    },
    contaContabilId: {
        type: 'number',
        fk: true
    },
    grupoMovimentacoes: {
        type: 'GrupoMovimentacoes',
        relationKey: 'grupoMovimentacoesId'
    },
    grupoMovimentacoesId: {
        type: 'number',
        fk: true
    },
    valor: {
        type: 'number'
    },
    descricao: {
        type: 'string'
    },
    agendamentoId: {
        type: 'number',
        fk: true
    },
    agendamento: {
        type: 'Agendamento',
        relationKey: 'agendamentoId'
    },
    data: {
        type: 'Date'
    },
    tipoMovimentacao: {
        type: 'number'
    }
});