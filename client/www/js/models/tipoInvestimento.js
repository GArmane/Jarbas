function TipoInvestimento(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    this.nome = data.nome;
    this.taxa = data.taxa;
}

localEntities.register(TipoInvestimento, {
    id: {
        type: 'number',
        pk: true
    },
    nome: {
        type: 'string'
    },
    taxa: {
        type: 'number'
    }
});