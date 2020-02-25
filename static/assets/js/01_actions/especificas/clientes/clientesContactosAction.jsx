import {CONTACTO_CLIENTE_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListGetURLParameters, callApiMethodPostParameters
} from '../../00_general_fuctions'

const current_url_api = 'clientes_contactos';
export const createContactoClienteCotizacionComponentes = (values, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        _.mapKeys(values, (v, k) => {
            params.append(k, v);
        });
        params.append('tipo_cotizacion', 'Componentes');
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, null, 'contacto_cliente_crear_desde_cotizacion', params, options)
    }
};

export const fusionarContactosCliente = (contacto_que_permanece_id, contacto_a_eliminar_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('contacto_a_eliminar_id', contacto_a_eliminar_id);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, contacto_que_permanece_id, 'fusionar_contactos', params, options)
    }
};


export const createContactoCliente = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteContactoCliente = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchContactosClientes = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(current_url_api, options);
    }
};

export const fetchContactosClientes_por_cliente = (cliente_id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGetURLParameters(`${current_url_api}/por_cliente/?cliente_id=${cliente_id}`, options);
    }
};
export const fetchContactoCliente = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};

export const clearContactosClientes = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateContactoCliente = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};