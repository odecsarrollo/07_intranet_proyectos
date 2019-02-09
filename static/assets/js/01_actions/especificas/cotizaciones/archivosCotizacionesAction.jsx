import {ARCHIVO_COTIZACION_TYPES as TYPES} from '../../00_types';
import {
    fetchListOld,
    updateObjectOld,
    fetchObjectOld,
    deleteObjectOld,
    createObjectOld,
    fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'cotizaciones_archivos';
export const createArchivoCotizacion = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObjectOld(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteArchivoCotizacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObjectOld(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchArchivosCotizaciones = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListOld(current_url_api, dispatches, callback, callback_error);
    }
};

export const fetchArchivosCotizaciones_x_cotizacion = (cotizacion_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const url = `${current_url_api}/listar_x_cotizacion/?cotizacion_id=${cotizacion_id}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(url, dispatches, callback, callback_error);
    }
};

export const fetchArchivoCotizacion = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearArchivosCotizaciones = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateArchivoCotizacion = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObjectOld(current_url_api, id, values, dispatches, callback, callback_error)
    }
};