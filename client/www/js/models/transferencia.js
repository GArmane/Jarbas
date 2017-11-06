function Transferencia(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    this.receitaId = data.receitaId;
    if (data.receita)
        this.receita = new Movimentacao(data.receita);
    this.despesaId = data.despesaId;
    if (data.despesa)
        this.despesa = new Movimentacao(data.despesa);
}

localEntities.register(Transferencia, {
    id: {
        type: 'number',
        pk: true
    },
    receitaId: {
        type: 'number',
        fk: true
    },
    receita: {
        type: 'Movimentacao',
        relationKey: 'receitaId'
    },
    despesaId: {
        type: 'number',
        fk: true
    },
    despesa: {
        type: 'Movimentacao',
        relationKey: 'despesaId'
    }
});