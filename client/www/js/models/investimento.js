function Investimento(data) {
    "use strict";
    if (!data) data = {};
    
    this.id = data.id;
    if (data.usuario)
        this.usuario = new Usuario(data.usuario);
    this.usuarioId = data.usuarioId;
    if (data.tipoInvestimento)
        this.tipoInvestimento = new TipoInvestimento(data.tipoInvestimento);
    this.tipoInvestimentoId = data.tipoInvestimentoId;
    if (data.moeda)
        this.moeda = new Moeda(data.moeda);
    this.moedaId = data.moedaId;
    this.descricao = data.descricao;
    this.valorAtual = data.valorAtual;
    this.valorInvestido = data.valorInvestido;
    this.qtdTempo = data.qtdTempo;
    this.dataInicio = data.dataInicio;
    this.escalaTempo = data.escalaTempo;
}

localEntities.register(Investimento, {
    id: {
        type: 'number',
        pk: true
    },
    usuario: {
        type: 'Usuario',
        relationKey: 'usuarioId'
    },
    usuarioId: {
        type: 'number',
        fk: true,
    },
    tipoInvestimento: {
        type: 'TipoInvestimento',
        relationKey: 'tipoInvestimentoId'
    },
    tipoInvestimentoId: {
        type: 'number',
        fk: true
    },
    moeda: {
        type: 'Moeda',
        relationKey: 'moedaId'
    },
    moedaId: {
        type: 'number',
        fk: true
    },
    descricao: {
        type: 'string'
    },
    valorAtual: {
        type: 'number'
    },
    valorInvestido: {
        type: 'number'
    },
    qtdTempo: {
        type: 'number'
    },
    dataInicio: {
        type: 'Date'
    },
    escalaTempo: {
        type: 'number'
    },
});