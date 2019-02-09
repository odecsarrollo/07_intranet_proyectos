import {
    FETCH_ITEMS_BIABLE,
    FETCH_ITEM_BIABLE,
    CLEAR_ITEMS_BIABLE
} from '../../00_types';

import {
    fetchObjectOld,
    fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'items_biable';

export function clearItemsBiable() {
    return function (dispatch) {
        dispatch({type: CLEAR_ITEMS_BIABLE});
    }
}

export function fetchItemsBiablexParametro(tipo_consulta, parametro, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_items_x_parametro/?parametro=${parametro}&tipo_parametro=${tipo_consulta}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_ITEMS_BIABLE, payload: response})
        };
        fetchListWithParameterOld(FULL_URL, dispatches, callback, callback_error);
    }
}

export function fetchItemsBiablexCodigos(codigos, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/consultar_arreglo_codigos/?codigos=${codigos}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_ITEMS_BIABLE, payload: response})
        };
        fetchListWithParameterOld(FULL_URL, dispatches, callback, callback_error);
    }
}

export function fetchItemBiable(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: FETCH_ITEM_BIABLE, payload: response})
        };
        fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
}