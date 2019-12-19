import {
    GRUPO_PERMISO_TYPES as TYPES
} from '../../00_types';

import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPostParameters
} from '../../00_general_fuctions'

const current_url_api = 'grupos_permisos';

export const addPermisoGrupo = (id, permiso_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_permiso', permiso_id);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_permiso', params, options)
    }
};

export const createGrupoPermiso = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteGrupoPermiso = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchGruposPermisos = (options_action = {}) => {
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

export const fetchGrupoPermiso = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};

export const clearGruposPermisos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateGrupoPermiso = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};