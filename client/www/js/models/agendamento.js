function Agendamento(data) {
    "use strict";
    if (!data) data = {};
    
    this.id = data.id;
    this.escalaTempo = data.escalaTempo;
    this.qtdTempo = data.qtdTempo;
    this.dataLimite = data.dataLimite;
    this.vezesLimite = data.vezesLimite;
    this.diasSemana = data.diasSemana;
    this.diaMes = data.diaMes;
    this.semanaMes = data.semanaMes;
    this.diaSemana = data.diaSemana;
    this.movimentacaoId = data.movimentacaoId;
    if (data.movimentacao)
        this.movimentacao = new Movimentacao(data.movimentacao);
}

localEntities.register(Agendamento, {
    id: {
        pk: true,
        type: 'number'
    },
    escalaTempo: {
        type: 'number'
    },
    qtdTempo: {
        type: 'number'
    },
    dataLimite: {
        type: 'Date'
    },
    vezesLimite: {
        type: 'number'
    },
    diasSemana: {
        type: 'Array:number'
    },
    diaMes: {
        type: 'number'
    },
    semanaMes: {
        type: 'number'
    },
    diaSemana: {
        type: 'number'
    },
    movimentacaoId: {
        fk: true,
        type: 'number'
    },
    movimentacao: {
        relationKey: 'movimentacaoId',
        type: 'Movimentacao'
    }
});