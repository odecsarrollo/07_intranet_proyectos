import {
    CREATE_HORA_TRABAJO_DIARIO,
    FETCH_HORAS_TRABAJOS_DIARIOS,
    FETCH_HORA_TRABAJO_DIARIO,
    UPDATE_HORA_TRABAJO_DIARIO,
    DELETE_HORA_TRABAJO_DIARIO,
    CLEAR_HORAS_TRABAJOS_DIARIOS
} from '../../00_types';


import {
    fetchList,
    fetchListWithParameter,
    fetchObject,
    updateObject,
    createObject,
    deleteObject
} from './../../00_general_fuctions'

const current_url_api = 'horas_hojas_trabajo';

export function clearHorasHojasTrabajos() {
    return function (dispatch) {
        dispatch({type: CLEAR_HORAS_TRABAJOS_DIARIOS});
    }
}

export function fetchHorasHojasTrabajos(callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_HORAS_TRABAJOS_DIARIOS, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
}

export function fetchHorasHojasTrabajosxHoja(hoja_id, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/horas_por_hoja_trabajo?hoja_id=${hoja_id}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_HORAS_TRABAJOS_DIARIOS, payload: response})
        };
        fetchListWithParameter(FULL_URL, dispatches, callback, callback_error)
    }
}


export function fetchHoraHojaTrabajo(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_HORA_TRABAJO_DIARIO, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
}

export function updateHoraHojaTrabajo(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: UPDATE_HORA_TRABAJO_DIARIO, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
}

export function deleteHoraHojaTrabajo(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: DELETE_HORA_TRABAJO_DIARIO, payload: id});
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
}

export function createHoraHojaTrabajo(values, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: CREATE_HORA_TRABAJO_DIARIO, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
}
