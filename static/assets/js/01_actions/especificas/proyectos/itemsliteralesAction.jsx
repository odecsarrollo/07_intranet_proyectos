import {ITEMS_LITERALES_TYPES as TYPES} from '../../00_types';

import {
    fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'items_literales';

export function clearItemsLiterales() {
    return function (dispatch) {
        dispatch({type: TYPES.clear});
    }
}

export function fetchItemsLiterales(id_literal, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_items_x_literal/?id_literal=${id_literal}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(FULL_URL, dispatches, callback, callback_error)
    }
}