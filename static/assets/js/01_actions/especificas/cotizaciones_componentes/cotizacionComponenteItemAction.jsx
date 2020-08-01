import {
    createObject,
    deleteObject,
    fetchListGet,
    fetchListGetURLParameters,
    fetchObject,
    updateObject,
} from '../../00_general_fuctions'
import {ITEM_COTIZACION_COMPONENTE_TYPES as TYPES} from '../../00_types';

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

export const fetchItemsCotizacionesComponentesVentasPerdidasPorAnoMes = (filtro, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/items_venta_perdida/?${filtro_url}`, options);
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