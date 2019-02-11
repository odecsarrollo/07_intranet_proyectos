import {LITERAL_TYPES as TYPES} from '../../00_types';

import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListWithParameterOld,
    callApiMethodWithParametersOld,
    callApiMethodWithParametersPDFOld,
    fetchListGetURLParameters
} from '../../00_general_fuctions'

const current_url_api = 'literales';

export const clearLiterales = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear})
    }
};

export function fetchLiteralesxParametro(parametro, options_action = {}) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_literales_x_parametro/?parametro=${parametro}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchListGetURLParameters(FULL_URL, options);
    }
}

export function adicionarQuitarFaseLiteral(id, id_fase, callback = null, callback_error = null) {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('id_fase', id_fase);
        callApiMethodWithParametersOld(current_url_api, id, 'adicionar_quitar_fase', params, null, callback, callback_error)
    }
}

export function adicionarMiembroLiteral(id, id_usuario, callback = null, callback_error = null) {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('id_usuario', id_usuario);
        callApiMethodWithParametersOld(current_url_api, id, 'adicionar_miembro', params, null, callback, callback_error)
    }
}

export function quitarMiembroLiteral(id, id_usuario, callback = null, callback_error = null) {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('id_usuario', id_usuario);
        callApiMethodWithParametersOld(current_url_api, id, 'quitar_miembro', params, null, callback, callback_error)
    }
}

export const fetchLiterales = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(current_url_api, options);
    }
};

export function fetchLiteralesXProyecto(proyecto_id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(`${current_url_api}/listar_x_proyecto/?proyecto_id=${proyecto_id}`, dispatches, callback, callback_error)
    }
}

export const fetchLiteralesAbiertos = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/abiertos`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(FULL_URL, options);
    }
};

export const fetchLiteralesConSeguimiento = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/con_seguimiento`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(FULL_URL, options);
    }
};


export const fetchLiteralesSinSincronizar = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/sin_sincronizar`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(FULL_URL, options);
    }
};

export const fetchLiteralesProyectoAbierto = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/proyecto_abierto`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(FULL_URL, options);
    }
};

export const fetchLiteral = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};

export const createLiteral = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};

export const deleteLiteral = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};

export const updateLiteral = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};

export const uploadArchivoLiteral = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.upload, payload: response})
        };
        callApiMethodWithParametersPDFOld(current_url_api, id, 'upload_archivo', values, dispatches, callback, callback_error)
    }
};