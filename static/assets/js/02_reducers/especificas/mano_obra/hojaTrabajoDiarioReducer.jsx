import {
    CREATE_MANO_OBRA_HOJA_TRABAJO,
    DELETE_MANO_OBRA_HOJA_TRABAJO,
    FETCH_MANOS_OBRAS_HOJAS_TRABAJOS,
    FETCH_MANO_OBRA_HOJA_TRABAJO,
    CLEAR_MANOS_OBRAS_HOJAS_TRABAJOS,
    UPDATE_MANO_OBRA_HOJA_TRABAJO,
} from '../../../01_actions/00_types';
import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case CREATE_MANO_OBRA_HOJA_TRABAJO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_MANO_OBRA_HOJA_TRABAJO:
            return _.omit(state, action.payload);
            break;
        case FETCH_MANOS_OBRAS_HOJAS_TRABAJOS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_MANO_OBRA_HOJA_TRABAJO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CLEAR_MANOS_OBRAS_HOJAS_TRABAJOS:
            return {};
            break;
        case UPDATE_MANO_OBRA_HOJA_TRABAJO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        default:
            return state;
    }
}