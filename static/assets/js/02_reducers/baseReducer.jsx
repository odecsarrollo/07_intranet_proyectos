import {omit, mapKeys} from 'lodash';

const mostrarLogs = (tipo) => {
    const mostrar = true;
    if (mostrar) {
        console.log('usando base reducers');
        console.log(`Entro a base reducer ${tipo}`);
    }
};

export default function (actions_types, state = {}, action, mapKey = 'id') {
    switch (action.type) {
        case actions_types.create:
            mostrarLogs('create');
            return {...state, [action.payload.data.id]: action.payload.data};
        case actions_types.delete:
            mostrarLogs('delete');
            return omit(state, action.payload);
        case actions_types.fetch_all:
            mostrarLogs('fetch_all');
            return mapKeys(action.payload.data, mapKey);
        case actions_types.fetch:
            mostrarLogs('fetch');
            if (!_.isEqual(state[action.payload.data.id], action.payload.data)) {
                return {...state, [action.payload.data.id]: action.payload.data};
            } else {
                return state
            }
        case actions_types.clear:
            mostrarLogs('clear');
            return {};
        case actions_types.update:
            mostrarLogs('update');
            return {...state, [action.payload.data.id]: action.payload.data};
        default:
            return state;
    }
}