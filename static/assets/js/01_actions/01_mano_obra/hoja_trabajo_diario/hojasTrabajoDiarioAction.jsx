import {
    CREATE_HOJA_TRABAJO_DIARIO,
    FETCH_HOJAS_TRABAJOS_DIARIOS,
    FETCH_HOJA_TRABAJO_DIARIO,
    UPDATE_HOJA_TRABAJO_DIARIO,
    DELETE_HOJA_TRABAJO_DIARIO
} from '../../00_types';

import axios from 'axios';

const axios_instance = axios.create({
    baseURL: '/api/hojas_trabajo_diario'
});
import {createRequest} from '../../00_general_fuctions';

const FORMAT = 'format=json';

export function fetchHojasTrabajosDiarios(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/';
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_HOJAS_TRABAJOS_DIARIOS, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchHojaTrabajoDiario(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/${id}/`;
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_HOJA_TRABAJO_DIARIO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function updateHojaTrabajoDiario(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.put(`/${id}/`, values);
        const dispatches = (response) => {
            dispatch({type: UPDATE_HOJA_TRABAJO_DIARIO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function deleteHojaTrabajoDiario(id, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const SUB_URL = `/${id}/`;
        const FULL_URL = `${SUB_URL}`;
        axios_instance.delete(FULL_URL)
            .then(response => {
                dispatch({type: DELETE_HOJA_TRABAJO_DIARIO, payload: id});
                if (callback) {
                    callback(response.data);
                }
            }).catch(error => {
                if (callback_error) {
                    callback_error(error);
                }
            }
        );
    }
}

export function createHojaTrabajoDiario(values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.post(`/`, values);
        const dispatches = (response) => {
            dispatch({type: CREATE_HOJA_TRABAJO_DIARIO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}
