function ContaContabil(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    if (data.usuario)
        this.usuario = new Usuario(data.usuario);
    this.usuarioId = data.usuarioId;
    if (data.moeda)
        this.moeda = new Moeda(data.moeda);
    this.moedaId = data.moedaId;
    this.nome = data.nome;
    this.saldo = data.saldo;
}

localEntities.register(ContaContabil, {
    id: {
        pk: true,
        type: 'number'
    },
    usuario: {
        relationKey: 'usuarioId',
        type: 'Usuario'
    },
    usuarioId: {
        fk: true,
        type: 'string'
    },
    moeda: {
        type: 'Moeda',
        relationKey: 'moedaId'
    },
    moedaId: {
        type: 'number',
        fk: true
    },
    nome: {
        type: 'string'
    },
    saldo: {
        type: 'number'
    }
});