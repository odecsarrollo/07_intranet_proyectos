import {PROYECTO_TYPES as TYPES} from '../../00_types';

import {
    fetchListGet,
    fetchObject,
    updateObject,
    createObject,
    deleteObject,
    fetchObjectWithParameterPDFOld,
    callApiMethodWithParametersPDFOld, fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'proyectos';

export function fetchProyectosxParametro(parametro, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_proyectos_x_parametro/?parametro=${parametro}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(FULL_URL, dispatches, callback, callback_error);
    }
}

export function printReporteCostoProyecto(id_proyecto, valores, callback = null, callback_error = null) {
    return function (dispatch) {
        let FULL_URL = `${current_url_api}/print_costos/?id_proyecto=${id_proyecto}`;
        if (valores.lapso) {
            FULL_URL = `${FULL_URL}&fecha_inicial=${valores.fecha_inicial}&fecha_final=${valores.fecha_final}&con_mo_saldo_inicial=${valores.con_mo_saldo_inicial}`
        }
        fetchObjectWithParameterPDFOld(FULL_URL, null, callback, callback_error)
    }
}

export function printReporteCostoDosProyecto(valores, callback = null, callback_error = null) {
    return function (dispatch) {
        let FULL_URL = `${current_url_api}/print_costos_dos/`;
        if (valores.lapso) {
            console.log('si tiene lapso')
            FULL_URL = `${FULL_URL}?fecha_inicial=${valores.fecha_inicial}&fecha_final=${valores.fecha_final}&con_mo_saldo_inicial=${valores.con_mo_saldo_inicial}`
        }
        fetchObjectWithParameterPDFOld(FULL_URL, null, callback, callback_error)
    }
}

export const fetchProyectos = (options_action = {}) => {
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

export const clearProyectos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear})
    }
};

export const fetchProyectosAbiertos = (options_action = {}) => {
    return (dispatch) => {
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

export const fetchProyectosConLiteralesAbiertos = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/con_literales_abiertos`;
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

export const fetchProyecto = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};

export const updateProyecto = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};

export const deleteProyecto = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};

export const createProyecto = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};

export const uploadArchivoProyecto = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.upload, payload: response})
        };
        callApiMethodWithParametersPDFOld(current_url_api, id, 'upload_archivo', values, dispatches, callback, callback_error)
    }
};