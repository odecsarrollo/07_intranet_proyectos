import {
    FETCH_PERMISSIONS
} from './00_types';

import {createRequest} from './00_general_fuctions';

import axios from 'axios';

const axios_instance = axios.create({
    baseURL: '/api/Permisos'
});
const FORMAT = 'format=json';

export function fetchMisPermisos(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/mis_permisos';
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_PERMISSIONS, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}