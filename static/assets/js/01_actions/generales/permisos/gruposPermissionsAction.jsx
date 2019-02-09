import {
    CREATE_GRUPO_PERMISO,
    DELETE_GRUPO_PERMISO,
    FETCH_GRUPOS_PERMISOS,
    FETCH_GRUPO_PERMISO,
    CLEAR_GRUPOS_PERMISOS,
    UPDATE_GRUPO_PERMISO
} from '../../00_types';

import {
    fetchListOld,
    updateObjectOld,
    fetchObjectOld,
    deleteObjectOld,
    createObjectOld,
    callApiMethodWithParametersOld
} from '../../00_general_fuctions'

const current_url_api = 'grupos_permisos';

export const addPermisoGrupo = (id, permiso_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_permiso', permiso_id);
        callApiMethodWithParametersOld(current_url_api, id, 'adicionar_permiso', params, null, callback, callback_error)
    }
};

export const createGrupoPermiso = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: CREATE_GRUPO_PERMISO, payload: response})
        };
        createObjectOld(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteGrupoPermiso = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: DELETE_GRUPO_PERMISO, payload: id})
        };
        deleteObjectOld(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchGruposPermisos = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_GRUPOS_PERMISOS, payload: response})
        };
        fetchListOld(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchGrupoPermiso = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_GRUPO_PERMISO, payload: response})
        };
        fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearGruposPermisos = () => {
    return (dispatch) => {
        dispatch({type: CLEAR_GRUPOS_PERMISOS});

    }
};
export const updateGrupoPermiso = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: UPDATE_GRUPO_PERMISO, payload: response})
        };
        updateObjectOld(current_url_api, id, values, dispatches, callback, callback_error)
    }
};