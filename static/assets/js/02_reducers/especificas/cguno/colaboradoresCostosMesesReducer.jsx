import {
    CREATE_COLABORADOR_COSTO_MES,
    DELETE_COLABORADOR_COSTO_MES,
    FETCH_COLABORADORES_COSTOS_MESES,
    FETCH_COLABORADOR_COSTO_MES,
    CLEAR_COLABORADORES_COSTOS_MESES,
    UPDATE_COLABORADOR_COSTO_MES,
} from '../../../01_actions/00_types';
import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case CREATE_COLABORADOR_COSTO_MES:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_COLABORADOR_COSTO_MES:
            return _.omit(state, action.payload);
            break;
        case FETCH_COLABORADORES_COSTOS_MESES:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_COLABORADOR_COSTO_MES:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CLEAR_COLABORADORES_COSTOS_MESES:
            return {};
            break;
        case UPDATE_COLABORADOR_COSTO_MES:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        default:
            return state;
    }
}