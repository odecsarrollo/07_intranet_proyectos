import {
    CREATE_CENTRO_COSTO_COLABORADOR,
    DELETE_CENTRO_COSTO_COLABORADOR,
    FETCH_CENTROS_COSTOS_COLABORADORES,
    FETCH_CENTRO_COSTO_COLABORADOR,
    CLEAR_CENTROS_COSTOS_COLABORADORES,
    UPDATE_CENTRO_COSTO_COLABORADOR,
} from '../../../01_actions/00_types';
import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case CREATE_CENTRO_COSTO_COLABORADOR:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_CENTRO_COSTO_COLABORADOR:
            return _.omit(state, action.payload);
            break;
        case FETCH_CENTROS_COSTOS_COLABORADORES:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_CENTRO_COSTO_COLABORADOR:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CLEAR_CENTROS_COSTOS_COLABORADORES:
            return {};
            break;
        case UPDATE_CENTRO_COSTO_COLABORADOR:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        default:
            return state;
    }
}