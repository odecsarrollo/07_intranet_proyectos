import {
    CREATE_COLABORADOR,
    FETCH_COLABORADORES,
    FETCH_COLABORADOR,
    UPDATE_COLABORADOR,
    DELETE_COLABORADOR, FETCH_ITEMS_LITERALES
} from '../../00_types';

import axios from 'axios';

const axios_instance = axios.create({
    baseURL: '/api/colaboradores'
});
import {createRequest} from '../../00_general_fuctions';

const FORMAT = 'format=json';

export function fetchColaboradores(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = '/';
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADORES, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchColaboradoresEnProyectos(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/en_proyectos/`;
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADORES, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchColaboradoresGestionHorasTrabajadas(callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/en_proyectos_para_gestion_horas_trabajadas/`;
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADORES, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function fetchColaborador(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/${id}/`;
        const FULL_URL = `${SUB_URL}?${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADOR, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function updateColaborador(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.put(`/${id}/`, values);
        const dispatches = (response) => {
            dispatch({type: UPDATE_COLABORADOR, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}

export function deleteColaborador(id, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const SUB_URL = `/${id}`;
        const FULL_URL = `${SUB_URL}`;
        axios_instance.delete(FULL_URL)
            .then(response => {
                dispatch({type: DELETE_COLABORADOR, payload: id});
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

export function createColaborador(values, callback = null, callback_error = null) {
    return function (dispatch) {
        axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios_instance.defaults.xsrfCookieName = "csrftoken";
        const request = axios_instance.post(`/`, values);
        const dispatches = (response) => {
            dispatch({type: CREATE_COLABORADOR, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}
