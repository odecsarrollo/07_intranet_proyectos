import {
    CREATE_COLABORADOR,
    FETCH_COLABORADORES,
    FETCH_COLABORADOR,
    UPDATE_COLABORADOR,
    DELETE_COLABORADOR,
    CLEAR_COLABORADORES
} from '../../00_types';

import {
    fetchList,
    fetchObject,
    updateObject,
    createObject,
    deleteObject,
    callApiMethod
} from './../../00_general_fuctions'

const current_url_api = 'colaboradores';

export function clearColaboradores() {
    return function (dispatch) {
        dispatch({type: CLEAR_COLABORADORES});
    }
}

export function fetchColaboradores(callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADORES, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
}

export function createColaboradorUsuario(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADOR, payload: response})
        };
        callApiMethod(current_url_api, id, 'crear_usuario', dispatches, callback, callback_error);
    }
}

export function activateColaboradorUsuario(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADOR, payload: response})
        };
        callApiMethod(current_url_api, id, 'cambiar_activacion', dispatches, callback, callback_error);
    }
}

export function fetchColaboradoresEnProyectos(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/en_proyectos`;
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADORES, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error)
    }
}

export function fetchColaboradoresGestionHorasTrabajadas(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/en_proyectos_para_gestion_horas_trabajadas`;
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADORES, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error)
    }
}

export function fetchColaborador(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_COLABORADOR, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
}

export function updateColaborador(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: UPDATE_COLABORADOR, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
}

export function deleteColaborador(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: DELETE_COLABORADOR, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
}

export function createColaborador(values, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: CREATE_COLABORADOR, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
}
