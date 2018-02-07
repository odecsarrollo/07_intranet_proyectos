import {
    FETCH_HORAS_TRABAJOS_DIARIOS,
    CLEAR_HORAS_TRABAJOS_DIARIOS,
    FETCH_HORA_TRABAJO_DIARIO,
    DELETE_HORA_TRABAJO_DIARIO
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_HORAS_TRABAJOS_DIARIOS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case CLEAR_HORAS_TRABAJOS_DIARIOS:
            return {};
            break;
        case FETCH_HORA_TRABAJO_DIARIO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_HORA_TRABAJO_DIARIO:
            return _.omit(state, action.payload);
            break;
        default:
            return state;
    }
}