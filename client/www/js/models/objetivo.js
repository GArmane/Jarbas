function Objetivo(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.valor = data.valor;
    this.moedaId = data.moedaId;
    this.dataInicial = data.dataInicial;
    this.descricao = data.descricao;
    this.arquivar = data.arquivar;
    if (data.usuario)
        this.usuario = new Usuario(data.usuario);
    if (data.moeda)
        this.moeda = new Moeda(data.moeda);
    if (data.historicoObjetivo) {
        this.historicoObjetivo = [];
        for (var i = 0; i < data.historicoObjetivo.length; i++) 
            this.historicoObjetivo.push(new HistoricoObjetivo(data.historicoObjetivo[i]));
    }
}

localEntities.register(Objetivo, {
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
        fk: true
    },
    valor: {
        type: 'number'
    },
    moeda: {
        type: 'Moeda',
        relationKey: 'moedaId'
    },
    moedaId: {
        type: 'number',
        fk: true
    },
    dataInicial: {
        type: 'Date'
    },
    descricao: {
        type: 'string'
    },
    arquivar: {
        type: 'boolean'
    },
    historicoObjetivo: {
        type: 'Array:HistoricoObjetivo'
    },
});