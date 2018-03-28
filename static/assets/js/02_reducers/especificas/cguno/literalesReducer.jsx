import {
    FETCH_LITERALES,
    FETCH_LITERAL,
    CLEAR_LITERALES
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_LITERALES:
            return _.mapKeys(action.payload.data, 'id');
            break;
        case FETCH_LITERAL:
            return {...state, [action.payload.data.id]: action.payload.data};
            break;
        case CLEAR_LITERALES:
            return {};
            break;
        default:
            return state;
    }
}