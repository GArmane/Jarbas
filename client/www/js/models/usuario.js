function Usuario(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    this.nome = data.nome;
    this.perfilId = data.perfilId;
    if (data.perfil)
        this.perfil = new Perfil(data.perfil);
}

localEntities.register(Usuario, {
    id: {
        type: 'number',
        pk: true
    },
    nome: {
        type: 'string'
    },
    perfilId: {
        type: 'number',
        fk: true
    },
    perfil: {
        type: 'Perfil',
        relationKey: 'perfilId'
    },
});