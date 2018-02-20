import {
    FETCH_ITEMS_LITERALES
} from '../../00_types';

import {
    fetchListWithParameter
} from '../../00_general_fuctions'

const current_url_api = 'items_literales';

export function fetchItemsLiterales(id_literal, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_items_x_literal/?id_literal=${id_literal}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_ITEMS_LITERALES, payload: response})
        };
        fetchListWithParameter(FULL_URL, dispatches, callback, callback_error)
    }
}