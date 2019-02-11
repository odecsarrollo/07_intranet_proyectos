import {ITEMS_LITERALES_TYPES as TYPES} from '../../00_types';

import {
    fetchListGetURLParameters,
} from '../../00_general_fuctions'

const current_url_api = 'items_literales';

export function clearItemsLiterales() {
    return function (dispatch) {
        dispatch({type: TYPES.clear});
    }
}

export function fetchItemsLiterales(id_literal, options_action = {}) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_items_x_literal/?id_literal=${id_literal}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGetURLParameters(FULL_URL, options);
    }
}