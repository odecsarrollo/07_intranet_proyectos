import {API_REST_ACTIONS as TYPES} from '../../01_actions/00_types';

const initial_state = {
    trm_hoy: null
};
export default function (state = initial_state, action) {
    switch (action.type) {
        case TYPES.trm_colombia:
            return {...state, trm_hoy: action.payload.data ? action.payload.data[0] : null};
        default:
            return state;
    }
}