import { ADHESIVO_MEDIOS_TYPES as TYPES } from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListGetURLParameters,
} from '../../00_general_fuctions'

const current_url_api = 'adhesivo';
export const createEtiquetaMedios = (values, options_action = {}) => {
    values.append('tipo', 1);
    return (dispatch) => {
        const dispatches = (response) => { dispatch({ type: TYPES.create, payload: response }) };
        const options = { dispatches, ...options_action, dispatch_method: dispatch };
        return createObject(current_url_api, values, options);
    }
};
export const createStickerMedios = (values, options_action = {}) => {
    values.append('tipo', 2);
    return (dispatch) => {
        const dispatches = (response) => { dispatch({ type: TYPES.create, payload: response }) };
        const options = { dispatches, ...options_action, dispatch_method: dispatch };
        return createObject(current_url_api, values, options);
    }
};
export const deleteAdhesivoMedios = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => { dispatch({ type: TYPES.delete, payload: id }) };
        const options = { dispatches, ...options_action, dispatch_method: dispatch };
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchAdhesivosMedios = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => { dispatch({ type: TYPES.fetch_all, payload: response }) };
        const { limpiar_coleccion = true } = options_action;
        const options = { dispatches, ...options_action, dispatch_method: dispatch, clear_action_type: limpiar_coleccion ? TYPES.clear : null };
        return fetchListGet(current_url_api, options);
    }
};
export function fetchAdhesivoTipo(tipo, options_action = {}) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_adhesivos_x_tipo/?tipo=${tipo}`;
        const dispatches = (response) => {
            dispatch({ type: TYPES.fetch_all, payload: response })
        };
        const { limpiar_coleccion = true } = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGetURLParameters(FULL_URL, options);
    }
}
export const fetchAdhesivoMedios = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => { dispatch({ type: TYPES.fetch, payload: response }) };
        const options = { dispatches, ...options_action, dispatch_method: dispatch };
        return fetchObject(current_url_api, id, options);
    }
};
export const clearAdhesivoMedios = () => {
    return (dispatch) => {
        dispatch({ type: TYPES.clear });

    }
};
export const updateAdhesivoMedios = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => { dispatch({ type: TYPES.update, payload: response }) };
        const options = { dispatches, ...options_action, dispatch_method: dispatch };
        return updateObject(current_url_api, id, values, options);
    }
};
