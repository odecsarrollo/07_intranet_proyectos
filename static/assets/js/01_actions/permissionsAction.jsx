import {
    FETCH_PERMISSIONS
} from './00_types';

import {
    fetchList
} from './00_general_fuctions'

const current_url_api = 'permisos';

export function fetchMisPermisos(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/mis_permisos';
        const FULL_URL = `${current_url_api}${SUB_URL}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_PERMISSIONS, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error);
    }
}