function Sync(data) {
    "use strict";
    if (!data)
        data = {};

    this.data = JSON.stringify(data);
}

localEntities.register(Sync, {
    id: {
        type: 'number',
        pk: true
    }
});