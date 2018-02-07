import {
    CREATE_HORA_TRABAJO_DIARIO,
    FETCH_HORAS_TRABAJOS_DIARIOS,
    FETCH_HORA_TRABAJO_DIARIO,
    UPDATE_HORA_TRABAJO_DIARIO,
    DELETE_HORA_TRABAJO_DIARIO,
    CLEAR_HORAS_TRABAJOS_DIARIOS
} from '../../00_types';

import axios from 'axios';

const axios_instance = axios.create({
    baseURL: '/api/horas_hojas_trabajo'
});
import {createRequest} from '../../00_general_fuctions';

const FORMAT = 'format=json';

export function clearHorasHojasTrabajos() {
    return function (dispatch) {
        dispatch({type: CLEAR_HORAS_TRABAJOS_DIARIOS});
    }
}

export function fetchHorasHojasTrabajos(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/';
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_HORAS_TRABAJOS_DIARIOS, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchHorasHojasTrabajosxHoja(hoja_id, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/horas_por_hoja_trabajo?hoja_id=${hoja_id}`;
        const FULL_URL = `${SUB_URL}&${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_HORAS_TRABAJOS_DIARIOS, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}


export function fetchHoraHojaTrabajo(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/${id}/`;
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_HORA_TRABAJO_DIARIO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function updateHoraHojaTrabajo(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.put(`/${id}/`, values);
        const dispatches = (response) => {
            dispatch({type: UPDATE_HORA_TRABAJO_DIARIO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function deleteHoraHojaTrabajo(id, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const SUB_URL = `/${id}`;
        const FULL_URL = `${SUB_URL}`;
        axios_instance.delete(FULL_URL)
            .then(response => {
                dispatch({type: DELETE_HORA_TRABAJO_DIARIO, payload: id});
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

export function createHoraHojaTrabajo(values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.post(`/`, values);
        const dispatches = (response) => {
            dispatch({type: CREATE_HORA_TRABAJO_DIARIO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}
