import {
    FETCH_PERMISSIONS
} from '../1_actions/00_types';

import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_PERMISSIONS:
            return action.payload.data.map((permiso) => {
                return permiso.codename
            });
            break;
        default:
            return state;
    }
}