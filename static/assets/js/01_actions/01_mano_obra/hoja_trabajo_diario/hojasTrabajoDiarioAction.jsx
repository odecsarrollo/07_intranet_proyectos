import {
    CREATE_HOJA_TRABAJO_DIARIO,
    FETCH_HOJAS_TRABAJOS_DIARIOS,
    CLEAR_HOJAS_TRABAJOS_DIARIOS,
    FETCH_HOJA_TRABAJO_DIARIO,
    UPDATE_HOJA_TRABAJO_DIARIO,
    DELETE_HOJA_TRABAJO_DIARIO
} from '../../00_types';

import {
    fetchList,
    fetchObject,
    updateObject,
    createObject,
    deleteObject,
    fetchListWithParameter
} from './../../00_general_fuctions'

const current_url_api = 'hojas_trabajo_diario';

export function clearHojasTrabajos(callback = null, callback_error = null) {
    return function (dispatch) {
        dispatch({type: CLEAR_HOJAS_TRABAJOS_DIARIOS})
    }
}

export function fetchHojasTrabajosxFechas(fecha_inicial, fecha_final, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_x_fechas/?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_HOJAS_TRABAJOS_DIARIOS, payload: response})
        };
        fetchListWithParameter(FULL_URL, dispatches, callback, callback_error);
    }
}

export function fetchHojasTrabajosDiarios(callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_HOJAS_TRABAJOS_DIARIOS, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
}

export function fetchHojaTrabajoDiario(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_HOJA_TRABAJO_DIARIO, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
}

export function updateHojaTrabajoDiario(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: UPDATE_HOJA_TRABAJO_DIARIO, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
}

export function deleteHojaTrabajoDiario(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: DELETE_HOJA_TRABAJO_DIARIO, payload: id});
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
}

export function createHojaTrabajoDiario(values, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: CREATE_HOJA_TRABAJO_DIARIO, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
}
