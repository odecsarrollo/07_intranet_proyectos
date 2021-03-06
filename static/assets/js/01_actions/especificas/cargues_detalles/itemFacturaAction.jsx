import {ITEM_FACTURA_TYPES as TYPES} from '../../00_types';
import {
    callApiMethodPostParameters,
    fetchListGet,
    fetchListGetURLParameters,
    fetchObject,
} from '../../00_general_fuctions'

const current_url_api = 'cargues_detalles_facturas_items';
export const fetchItemsFacturas = (options_action = {}) => {
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

export const setNoAfectaIngresoItemFactura = (id, valor, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('valor', valor);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'no_afecta_ingreso', params, options)
    }
};


export const fetchItemsFacturasPorRangoFecha = (fecha_inicial, fecha_final, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/por_rango_fechas/?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`, options);
    }
};

export const fetchItemFactura = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearItemsFacturas = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});

    }
};

export const fetchItemFacturasClienteParametro = (cliente_id, parametro, options_action = {}) => {
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