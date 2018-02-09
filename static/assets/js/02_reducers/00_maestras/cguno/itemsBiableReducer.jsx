import {
    FETCH_ITEMS_BIABLE,
    FETCH_ITEM_BIABLE
} from '../../../01_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_ITEMS_BIABLE:
            return _.mapKeys(action.payload.data, 'id_item');
            break;
        case FETCH_ITEM_BIABLE:
            return {...state, [action.payload.data.id_item]: action.payload.data};
            break;
        default:
            return state;
    }
}