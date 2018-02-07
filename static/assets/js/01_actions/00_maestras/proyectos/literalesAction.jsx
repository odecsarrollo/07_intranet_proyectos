import {
    FETCH_LITERALES,
    FETCH_LITERAL
} from '../../00_types';

import axios from 'axios';

const axios_instance = axios.create({
    baseURL: '/api/literales'
});
import {createRequest} from '../../00_general_fuctions';

const FORMAT = 'format=json';

export function fetchLiterales(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/';
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_LITERALES, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchLiteralesAbiertos(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/abiertos/';
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_LITERALES, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchLiteral(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/${id}/`;
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_LITERAL, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}
