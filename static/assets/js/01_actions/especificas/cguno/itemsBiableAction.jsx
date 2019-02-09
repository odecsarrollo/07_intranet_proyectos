import {ITEMS_BIABLE_TYPES as TYPES} from '../../00_types';

import {
    fetchObject,
    fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'items_biable';

export function clearItemsBiable() {
    return function (dispatch) {
        dispatch({type: TYPES.clear});
    }
}

export function fetchItemsBiablexParametro(tipo_consulta, parametro, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_items_x_parametro/?parametro=${parametro}&tipo_parametro=${tipo_consulta}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(FULL_URL, dispatches, callback, callback_error);
    }
}

export function fetchItemsBiablexCodigos(codigos, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/consultar_arreglo_codigos/?codigos=${codigos}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(FULL_URL, dispatches, callback, callback_error);
    }
}

export const fetchItemBiable = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};