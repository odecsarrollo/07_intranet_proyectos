import {CONFIGURACION_BANDA_EUROBELT_TYPES as TYPES} from '../../00_types';
import {
    updateObject,
    fetchListGet
} from '../../00_general_fuctions'

const current_url_api = 'banda_eurobelt_configuracion';

export const fetchConfiguracionBandaEurobelt = (options_action = {}) => {
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

export const clearConfiguracionBandaEurobelt = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateConfiguracionBandaEurobelt = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};