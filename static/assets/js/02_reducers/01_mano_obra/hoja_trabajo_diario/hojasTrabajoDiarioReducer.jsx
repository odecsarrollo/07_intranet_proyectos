import {
    FETCH_HOJAS_TRABAJOS_DIARIOS,
    FETCH_HOJA_TRABAJO_DIARIO,
    CLEAR_HOJAS_TRABAJOS_DIARIOS,
    DELETE_HOJA_TRABAJO_DIARIO
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_HOJAS_TRABAJOS_DIARIOS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_HOJA_TRABAJO_DIARIO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_HOJA_TRABAJO_DIARIO:
            return _.omit(state, action.payload);
            break;
        case CLEAR_HOJAS_TRABAJOS_DIARIOS:
            return {};
            break;
        default:
            return state;
    }
}