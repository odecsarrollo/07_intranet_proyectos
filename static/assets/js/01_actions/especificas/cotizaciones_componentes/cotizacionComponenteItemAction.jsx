import {ITEM_COTIZACION_COMPONENTE_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject, fetchListGetURLParameters, callApiMethodPostParameters,
} from '../../00_general_fuctions'

const current_url_api = 'cotizaciones_componentes_items';

export const fetchItemsCotizacionesComponentesParametro = (cliente_id, parametro, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGetURLParameters(`${current_url_api}/items_por_cliente_historico/?cliente_id=${cliente_id}&parametro=${parametro}`, options);
    }
};

export const createItemCotizacionComponente = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteItemCotizacionComponente = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchItemsCotizacionesComponentes = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(current_url_api, options);
    }
};
export const fetchItemCotizacionComponente = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearItemsCotizacionesComponentes = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateItemCotizacionComponente = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};

export const personalizarItemCotizacionComponente = (id, caracteristica_a_cambiar, valor_string = null, valor_float = null, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('caracteristica_a_cambiar', caracteristica_a_cambiar);
        if (valor_string) {
            params.append('valor_string', valor_string);
        }
        if (valor_float) {
            params.append('valor_float', valor_float);
        }
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'personalizar_item_cotizacion', params, options)
    }
};