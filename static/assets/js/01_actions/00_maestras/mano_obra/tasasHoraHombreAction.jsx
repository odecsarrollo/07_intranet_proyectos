import {
    CREATE_TASA_HORA_HOMBRE,
    FETCH_TASAS_HORAS_HOMBRES,
    FETCH_TASA_HORA_HOMBRE,
    UPDATE_TASA_HORA_HOMBRE,
    DELETE_TASA_HORA_HOMBRE
} from '../../00_types';

import {
    fetchList,
    fetchObject,
    updateObject,
    createObject,
    deleteObject
} from './../../00_general_fuctions'

const current_url_api = 'tasas_hora_mano_obra';

export function fetchTasasHorasHombres(callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_TASAS_HORAS_HOMBRES, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
}

export function fetchTasaHoraHombre(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_TASA_HORA_HOMBRE, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
}

export function updateTasaHoraHombre(id, values, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: UPDATE_TASA_HORA_HOMBRE, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
}

export function deleteTasaHoraHombre(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: DELETE_TASA_HORA_HOMBRE, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
}

export function createTasaHoraHombre(values, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: CREATE_TASA_HORA_HOMBRE, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
}
