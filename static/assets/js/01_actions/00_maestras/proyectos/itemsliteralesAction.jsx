import {
    FETCH_ITEMS_LITERALES
} from '../../00_types';

import axios from 'axios';

const axios_instance = axios.create({
    baseURL: '/api/items_literales'
});
import {createRequest} from '../../00_general_fuctions';

const FORMAT = 'format=json';

export function fetchItemsLiterales(id_literal, callback = null, callback_error = null) {
    return function (dispatch) {
        const SUB_URL = `/listar_items_x_literal?id_literal=${id_literal}&`;
        const FULL_URL = `${SUB_URL}${FORMAT}`;
        const request = axios_instance.get(FULL_URL);
        const dispatches = (response) => {
            dispatch({type: FETCH_ITEMS_LITERALES, payload: response})
        };
        createRequest(
            request,
            dispatches,
            callback,
            callback_error
        );
    }
}