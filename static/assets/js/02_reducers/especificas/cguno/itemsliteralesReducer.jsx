import {
    FETCH_ITEMS_LITERALES
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_ITEMS_LITERALES:
            return _.mapKeys(action.payload.data, 'id');
            break;
        default:
            return state;
    }
}