import {
    FETCH_COLABORADORES,
    FETCH_COLABORADOR,
    DELETE_COLABORADOR
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_COLABORADORES:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_COLABORADOR:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_COLABORADOR:
            return _.omit(state, action.payload);
            break;
        default:
            return state;
    }
}