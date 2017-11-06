function Perfil(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    if (data.moeda)
        this.moeda = new Moeda(data.moeda);
    this.moedaId = data.moedaId;
    this.valor = data.valor;
    this.rendaFixa = data.rendaFixa;
    this.profissao = data.profissao;
    this.faixaEtaria = data.faixaEtaria;
    this.escalaTempo = data.escalaTempo;
}

localEntities.register(Perfil, {
    id: {
        type: 'number',
        pk: true
    },
    moeda: {
        type: 'Moeda',
        relationKey: 'moedaId'
    },
    moedaId: {
        type: 'number',
        fk: true
    },
    valor: {
        type: 'number'
    },
    rendaFixa: {
        type: 'boolean'
    },
    profissao: {
        type: 'number'
    },
    faixaEtaria: {
        type: 'number'
    },
    escalaTempo: {
        type: 'number'
    }
});