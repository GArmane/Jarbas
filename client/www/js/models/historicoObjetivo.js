function HistoricoObjetivo(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    this.dataFinal = data.dataFinal;
    this.valorFinal = data.valorFinal;
    this.objetivoId = data.objetivoId;
    if (data.objetivo)
        this.objetivo = new Objetivo(data.objetivo);
}

localEntities.register(HistoricoObjetivo, {
    id: {
        pk: true,
        type: 'number'
    },
    dataFinal: {
        type: 'Date'
    },
    valorFinal: {
        type: 'number'
    },
    objetivoId: {
        fk: true,
        type: 'number'
    },
    objetivo: {
        type: 'Objetivo',
        relationKey: 'objetivoId'
    }
});