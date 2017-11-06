function GrupoMovimentacoes(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    this.usuarioId = data.usuarioId;
    if (data.usuario)
        this.usuario = new Usuario(data.usuario);
    this.nome = data.nome;
}

localEntities.register(GrupoMovimentacoes, {
    id: {
        type: 'number',
        pk: true
    },
    usuarioId: {
        type: 'number',
        fk: true
    },
    usuario: {
        type: 'Usuario',
        relationKey: 'usuarioId'
    },
    nome: {
        type: 'string'
    }
});