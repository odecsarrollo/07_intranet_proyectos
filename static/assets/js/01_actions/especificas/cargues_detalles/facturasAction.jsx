import {FACTURA_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    fetchListGetURLParameters, callApiMethodPostParameters,
} from '../../00_general_fuctions'

const current_url_api = 'cargues_detalles_facturas';
export const fetchFacturas = (options_action = {}) => {
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

export const relacionarCotizacionComponenteFactura = (id, cotizacion_componente_id, accion, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('cotizacion_componente_id', cotizacion_componente_id);
        params.append('accion', accion);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'relacionar_cotizacion_componente', params, options)
    }
};

export const fetchFacturasCliente = (cliente_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/facturas_por_cliente/?cliente_id=${cliente_id}`, options);
    }
};

export const fetchFacturasPorRangoFecha = (fecha_inicial, fecha_final, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/facturacion_por_rango_fechas/?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`, options);
    }
};

export const fetchFacturasPorAnoMes = (filtro, options_action = {}) => {
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
        let months = '['
        let years = '['
        filtro.months.map(m =>
            months = `${months}${m},`
        )
        months = `${months}]`.replace(',]', ']').replace('[', '').replace(']', '')

        filtro.years.map(y =>
            years = `${years}${y},`
        )
        years = `${years}]`.replace(',]', ']').replace('[', '').replace(']', '')
        let filtro_url = `months=${months}&years=${years}`;
        return fetchListGetURLParameters(`${current_url_api}/facturacion_por_ano_mes/?${filtro_url}`, options);
    }
};

export const fetchFacturasComponentesTrimestre = (options_action = {}) => {
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
        return fetchListGet(`${current_url_api}/facturacion_componentes_trimestre`, options);
    }
};
export const fetchFactura = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearFacturas = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});
    }
};
export const updateFactura = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};