import {
    FETCH_PROYECTOS,
    FETCH_PROYECTO,
    DELETE_PROYECTO
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_PROYECTOS:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_PROYECTO:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case DELETE_PROYECTO:
            return _.omit(state, action.payload);
            break;
        default:
            return state;
    }
}