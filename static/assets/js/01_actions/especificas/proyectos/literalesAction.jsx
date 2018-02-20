import {
    FETCH_LITERALES,
    FETCH_LITERAL
} from '../../00_types';

import {
    fetchList,
    fetchObject
} from '../../00_general_fuctions'

const current_url_api = 'literales';

export function fetchLiterales(callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_LITERALES, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error)
    }
}

export function fetchLiteralesAbiertos(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/abiertos`;
        const dispatches = (response) => {
            dispatch({type: FETCH_LITERALES, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error)
    }
}

export function fetchLiteral(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_LITERAL, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error)
    }
}
