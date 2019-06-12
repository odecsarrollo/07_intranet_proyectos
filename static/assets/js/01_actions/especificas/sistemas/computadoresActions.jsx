import {SISTEMAS_EQUIPO_COMPUTADOR_TYPES as TYPES } from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject
} from '../../00_general_fuctions'

const current_url_api = 'computador';
export const createSistemasEquipoComputador = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type: TYPES.create, payload: response})};
const options = {dispatches, ...options_action, dispatch_method: dispatch};
       return createObject(current_url_api, values, options);
    }
};
export const deleteSistemasEquipoComputador = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type: TYPES.delete, payload: id})};
const options = {dispatches, ...options_action, dispatch_method: dispatch};
       return deleteObject(current_url_api, id, options);
    }
};
export const fetchSistemasEquiposComputadores = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type: TYPES.fetch_all, payload: response})};
const {limpiar_coleccion = true} = options_action;
const options = {dispatches, ...options_action, dispatch_method: dispatch, clear_action_type: limpiar_coleccion ? TYPES.clear : null};
       return fetchListGet(current_url_api, options);
    }
};
export const fetchSistemasEquipoComputador = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type: TYPES.fetch, payload: response})};
const options = {dispatches, ...options_action, dispatch_method: dispatch};
       return fetchObject(current_url_api, id, options);
    }
};
export const clearSistemasEquiposComputadores = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateSistemasEquipoComputador = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type:TYPES.update, payload: response})};
const options = {dispatches, ...options_action, dispatch_method: dispatch};
       return updateObject(current_url_api, id, values, options);
    }
};
export function fetchComputadoresFile(file, options_action = {}) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/subir_archivo/?file=${file}`;
        const dispatches = (response) => {
            dispatch({ type: TYPES.upload_file, payload: response })
        };
        const { limpiar_coleccion = true } = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return createObject(FULL_URL, file, options);
    }
}