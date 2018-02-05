import {
    FETCH_TASAS_HORAS_HOMBRES,
    FETCH_TASA_HORA_HOMBRE,
    DELETE_TASA_HORA_HOMBRE
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_TASAS_HORAS_HOMBRES:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_TASA_HORA_HOMBRE:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_TASA_HORA_HOMBRE:
            return _.omit(state, action.payload);
            break;
        default:
            return state;
    }
}