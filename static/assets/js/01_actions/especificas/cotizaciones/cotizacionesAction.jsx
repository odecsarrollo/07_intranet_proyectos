import {COTIZACION_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    uploadArchivo,
    fetchListGetURLParameters
} from '../../00_general_fuctions'

const current_url_api = 'cotizaciones';
export const createCotizacion = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};
export const deleteCotizacion = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchCotizaciones = (options_action = {}) => {
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

export const fetchCotizacionesAgendadas = (options_action = {}) => {
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
        fetchListGet(`${current_url_api}/listar_cotizaciones_agendadas`, options);
    }
};

export const fetchCotizacionesPidiendoCarpeta = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_cotizacion_abrir_carpeta`;
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

export const fetchCotizacionesTuberiaVentas = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_cotizaciones_tuberia_ventas`;
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

export const fetchCotizacionesTuberiaVentasResumen = (ano = null, trimestre = null, options_action = {}) => {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        if (ano && trimestre) {
            const FULL_URL = `${current_url_api}/cotizaciones_resumen_tuberia_ventas/?ano=${ano}&trimestre=${trimestre}`;

            const {limpiar_coleccion = true} = options_action;
            const options = {
                dispatches,
                ...options_action,
                dispatch_method: dispatch,
                clear_action_type: limpiar_coleccion ? TYPES.clear : null
            };
            fetchListGetURLParameters(FULL_URL, options);

        } else {
            const FULL_URL = `${current_url_api}/cotizaciones_resumen_tuberia_ventas`;
            const {limpiar_coleccion = true} = options_action;
            const options = {
                dispatches,
                ...options_action,
                dispatch_method: dispatch,
                clear_action_type: limpiar_coleccion ? TYPES.clear : null
            };
            fetchListGet(FULL_URL, options);
        }
    }
};


export const fetchCotizacion = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};

export const clearCotizaciones = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateCotizacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};
export const uploadArchivoCotizacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const options = {...options_action, dispatch_method: dispatch};
        uploadArchivo(current_url_api, id, 'upload_archivo', values, options)
    }
};