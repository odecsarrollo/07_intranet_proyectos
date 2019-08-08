import {BANDA_EUROBELT_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject, callApiMethodPostParameters,
} from '../../00_general_fuctions'

const current_url_api = 'banda_eurobelt_bandas';

export const adicionarComponenteBandaEurobelt = (id, componente_id, cantidad, cortado_a, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('componente_id', componente_id);
        params.append('cantidad', cantidad);
        params.append('cortado_a', cortado_a);
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_componente', params, options)
    }
};

export const quitarComponenteBandaEurobelt = (id, ensamblado_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('ensamblado_id', ensamblado_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'quitar_componente', params, options)
    }
};

export const createBandaEurobelt = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};
export const deleteBandaEurobelt = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchBandasEurobelt = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(current_url_api, options);
    }
};
export const fetchBandaEurobelt = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};
export const clearBandasEurobelt = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateBandaEurobelt = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};