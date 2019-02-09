import {COLABORADOR_TYPES as TYPES} from '../../00_types';

import {
    fetchListGet,
    updateObject,
    fetchObject,
    createObject,
    deleteObject,
    callApiMethodWithParametersOld,
    callApiMethodOld
} from '../../00_general_fuctions'

const current_url_api = 'colaboradores';

export const modificarAutorizacionLiteralColaborador = (id, literal_id, tipo, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('literal_id', literal_id);
        params.append('tipo', tipo);
        callApiMethodWithParametersOld(current_url_api, id, 'modificar_autorizacion_literal', params, dispatches, callback, callback_error);
    }
};

export const createColaborador = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};
export const deleteColaborador = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchColaboradores = (options_action = {}) => {
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

export const fetchColaborador = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};

export const clearColaboradores = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateColaborador = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};


export function createColaboradorUsuario(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        callApiMethodOld(current_url_api, id, 'crear_usuario', dispatches, callback, callback_error);
    }
}

export function activateColaboradorUsuario(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        callApiMethodOld(current_url_api, id, 'cambiar_activacion', dispatches, callback, callback_error);
    }
}

export const fetchColaboradoresEnProyectos = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/en_proyectos`;
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

export const fetchColaboradoresGestionHorasTrabajadas = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/en_proyectos_autogestion_horas_trabajadas`;
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