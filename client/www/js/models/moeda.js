function Moeda(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    this.simbolo = data.simbolo;
    this.nome = data.nome;
    this.cotacaoComercial = data.cotacaoComercial;
    this.ultimaConsulta = data.ultimaConsulta;
    this.fonte = data.fonte;
}

localEntities.register(Moeda, {
    id: {
        type: 'number',
        pk: true
    },
    simbolo: {
        type: 'string'
    },
    nome: {
        type: 'string'
    },
    cotacaoComercial: {
        type: 'number'
    },
    ultimaConsulta: {
        type: 'Date'
    },
    fonte: {
        type: 'string'
    }
});