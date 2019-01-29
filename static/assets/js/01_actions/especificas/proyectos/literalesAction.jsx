import {FETCH_PROYECTOS, LITERAL_TYPES as TYPES} from '../../00_types';

import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListWithParameter,
    callApiMethodWithParameters,
    callApiMethodWithParametersPDF
} from '../../00_general_fuctions'

const current_url_api = 'literales';

export const clearLiterales = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear})
    }
};

export function fetchLiteralesxParametro(parametro, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_literales_x_parametro/?parametro=${parametro}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameter(FULL_URL, dispatches, callback, callback_error);
    }
}

export function adicionarQuitarFaseLiteral(id, id_fase, callback = null, callback_error = null) {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('id_fase', id_fase);
        callApiMethodWithParameters(current_url_api, id, 'adicionar_quitar_fase', params, null, callback, callback_error)
    }
}

export function adicionarMiembroLiteral(id, id_usuario, callback = null, callback_error = null) {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('id_usuario', id_usuario);
        callApiMethodWithParameters(current_url_api, id, 'adicionar_miembro', params, null, callback, callback_error)
    }
}

export function quitarMiembroLiteral(id, id_usuario, callback = null, callback_error = null) {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('id_usuario', id_usuario);
        callApiMethodWithParameters(current_url_api, id, 'quitar_miembro', params, null, callback, callback_error)
    }
}

export function fetchLiterales(callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error)
    }
}

export function fetchLiteralesXProyecto(proyecto_id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameter(`${current_url_api}/listar_x_proyecto/?proyecto_id=${proyecto_id}`, dispatches, callback, callback_error)
    }
}

export function fetchLiteralesAbiertos(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/abiertos`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error)
    }
}

export function fetchLiteralesConSeguimiento(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/con_seguimiento`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error)
    }
}

export function fetchLiteralesSinSincronizar(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/sin_sincronizar`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error)
    }
}

export function fetchLiteralesProyectoAbierto(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/proyecto_abierto`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error)
    }
}

export function fetchLiteral(id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error)
    }
}

export const createLiteral = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};

export const deleteLiteral = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};

export const updateLiteral = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};

export const uploadArchivoLiteral = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.upload, payload: response})
        };
        callApiMethodWithParametersPDF(current_url_api, id, 'upload_archivo', values, dispatches, callback, callback_error)
    }
};