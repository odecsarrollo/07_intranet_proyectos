import {
    CREATE_TASA_HORA_HOMBRE,
    FETCH_TASAS_HORAS_HOMBRES,
    FETCH_TASA_HORA_HOMBRE,
    UPDATE_TASA_HORA_HOMBRE,
    DELETE_TASA_HORA_HOMBRE
} from '../../00_types';

import axios from 'axios';

const axios_instance = axios.create({
    baseURL: '/api/tasas_hora_mano_obra'
});
import {createRequest} from '../../00_general_fuctions';

const FORMAT = 'format=json';

export function fetchTasasHorasHombres(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/';
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_TASAS_HORAS_HOMBRES, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchTasaHoraHombre(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/${id}/`;
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_TASA_HORA_HOMBRE, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function updateTasaHoraHombre(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.put(`/${id}/`, values);
        const dispatches = (response) => {
            dispatch({type: UPDATE_TASA_HORA_HOMBRE, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function deleteTasaHoraHombre(id, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const SUB_URL = `/${id}`;
        const FULL_URL = `${SUB_URL}`;
        axios_instance.delete(FULL_URL)
            .then(response => {
                dispatch({type: DELETE_TASA_HORA_HOMBRE, payload: id});
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

export function createTasaHoraHombre(values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.post(`/`, values);
        const dispatches = (response) => {
            dispatch({type: CREATE_TASA_HORA_HOMBRE, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}
