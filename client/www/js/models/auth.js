function Auth(data) {
    "use strict";
    if (!data) data = {};
    
    this.done = data.done;
    this.date = new Date(data.date);
    this.token = data.token;
    this.expiration = data.expiration; // segundos
    this.refresh = data.refresh;
    this.header = data.header;
    this.id = data.id;
    this.key = 1;
}

localEntities.register(Auth, {
    done: {
        type: 'boolean'
    },
    date: {
        type: 'Date'
    },
    token: {
        type: 'string'
    },
    expiration: {
        type: 'number'
    },
    refresh: {
        type: 'string'
    },
    header: {
        type: 'object'
    },
    id: {
        type: 'string'
    },
    key: {
        type: 'number',
        pk: true
    }
});
