import {
    CREATE_PROYECTO,
    FETCH_PROYECTOS,
    FETCH_PROYECTO,
    UPDATE_PROYECTO,
    DELETE_PROYECTO
} from '../../00_types';

import axios from 'axios';

const axios_instance = axios.create({
    baseURL: '/api/proyectos'
});
import {createRequest} from '../../00_general_fuctions';

const FORMAT = 'format=json';

export function fetchProyectos(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/';
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTOS, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchProyecto(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/${id}/`;
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function updateProyecto(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.put(`/${id}/`, values);
        const dispatches = (response) => {
            dispatch({type: UPDATE_PROYECTO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function deleteProyecto(id, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const SUB_URL = `/${id}`;
        const FULL_URL = `${SUB_URL}`;
        axios_instance.delete(FULL_URL)
            .then(response => {
                dispatch({type: DELETE_PROYECTO, payload: id});
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

export function createProyecto(values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.post(`/`, values);
        const dispatches = (response) => {
            dispatch({type: CREATE_PROYECTO, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}
