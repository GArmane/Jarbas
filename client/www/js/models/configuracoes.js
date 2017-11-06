function Configuracoes(data) {
    "use strict";
    if (!data) data = {};

    this.id = data.id;
    if (data.usuario)
        this.usuario = new Usuario(data.usuario);
    this.usuarioId = data.usuarioId;
    this.idioma = data.idioma;
}

localEntities.register(Configuracoes, {
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
        type: 'number'
    },
    idioma: {
        type: 'number'
    }
});