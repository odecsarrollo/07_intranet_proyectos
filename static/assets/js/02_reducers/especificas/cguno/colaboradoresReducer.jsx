import {
    CREATE_COLABORADOR,
    DELETE_COLABORADOR,
    FETCH_COLABORADORES,
    FETCH_COLABORADOR,
    CLEAR_COLABORADORES,
    UPDATE_COLABORADOR
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case CREATE_COLABORADOR:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_COLABORADOR:
            return _.omit(state, action.payload);
            break;
        case FETCH_COLABORADORES:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_COLABORADOR:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CLEAR_COLABORADORES:
            return {};
            break;
        case UPDATE_COLABORADOR:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        default:
            return state;
    }
}