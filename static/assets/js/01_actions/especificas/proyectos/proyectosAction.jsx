import {PROYECTO_TYPES as TYPES} from '../../00_types';

import {
    fetchListGet,
    fetchObject,
    updateObject,
    createObject,
    deleteObject,
    fetchObjectWithParameterPDF,
    fetchListGetURLParameters,
    uploadArchivo,
    callApiMethodPost
} from '../../00_general_fuctions'

const current_url_api = 'proyectos';

export function fetchProyectosxParametro(parametro, options_action = {}) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_proyectos_x_parametro/?parametro=${parametro}`;
        const options = {
            ...options_action,
            dispatch_method: dispatch
        };
        return fetchListGetURLParameters(FULL_URL, options);
    }
}

export function printReporteCostoProyecto(id_proyecto, valores, options_action = {}) {
    return function (dispatch) {
        let FULL_URL = `${current_url_api}/print_costos/?id_proyecto=${id_proyecto}`;
        if (valores.lapso) {
            FULL_URL = `${FULL_URL}&fecha_inicial=${valores.fecha_inicial}&fecha_final=${valores.fecha_final}&con_mo_saldo_inicial=${valores.con_mo_saldo_inicial}`
        }
        const options = {
            ...options_action,
            dispatch_method: dispatch
        };
        return fetchObjectWithParameterPDF(FULL_URL, options)
    }
}

export function printReporteCostoDosProyecto(valores, options_action = {}) {
    return function (dispatch) {
        let FULL_URL = `${current_url_api}/print_costos_dos/`;
        if (valores.lapso) {
            FULL_URL = `${FULL_URL}?fecha_inicial=${valores.fecha_inicial}&fecha_final=${valores.fecha_final}&con_mo_saldo_inicial=${valores.con_mo_saldo_inicial ? valores.con_mo_saldo_inicial : false}`
        }
        const options = {
            ...options_action,
            dispatch_method: dispatch
        };
        return fetchObjectWithParameterPDF(FULL_URL, options)
    }
}

export const fetchProyectos = (options_action = {}) => {
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

export const fetchProyectosCliente = (cliente_id, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/proyectos_por_cliente/?cliente_id=${cliente_id}`, options);
    }
};

export const fetchProyectosConCotizaciones = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/proyectos_con_cotizaciones`;
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
        return fetchListGet(FULL_URL, options);
    }
};

export const fetchProyectosConsecutivosRangos = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_rangos_consecutivos_por_ano`;
        const {limpiar_coleccion = true} = options_action;
        const options = {
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(FULL_URL, options);
    }
};


export const fetchProyectosConsecutivo = (tipo_proyecto, abierto, rango_actual, options_action = {}) => {
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
        return fetchListGetURLParameters(`${current_url_api}/listar_consecutivo_proyectos/?rango_actual=${rango_actual}&tipo_proyecto=${tipo_proyecto}&abierto=${abierto}`, options);
    }
};

export const fetchProyectoConsecutivoId = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch
        };
        return callApiMethodPost(current_url_api, id, 'listar_consecutivo_proyectos_id', options);
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
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(FULL_URL, options);
    }
};

export const fetchProyectosConLiteralesAbiertos = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/con_literales_abiertos`;
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
        return fetchListGet(FULL_URL, options);
    }
};

export const fetchProyecto = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};

export const updateProyecto = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};

export const deleteProyecto = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = () => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};

export const createProyecto = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};

export const uploadArchivoProyecto = (id, values, options_action = {}) => {
    return (dispatch) => {
        const options = {...options_action, dispatch_method: dispatch};
        uploadArchivo(current_url_api, id, 'upload_archivo', values, options)
    }
};

export const enviarAperturaLiteralesProyecto = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        callApiMethodPost(current_url_api, id, 'envio_correo_aperturas_almacen', options)
    }
};