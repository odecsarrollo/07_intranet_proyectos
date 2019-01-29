import {ARCHIVO_LITERAL_TYPES as TYPES} from '../../00_types';
import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListWithParameter
} from '../../00_general_fuctions'

const current_url_api = 'literales_archivos';
export const createArchivoLiteral = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteArchivoLiteral = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchArchivosLiterales = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};

export const fetchArchivosLiterales_x_literal = (literal_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const url = `${current_url_api}/listar_x_literal/?literal_id=${literal_id}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameter(url, dispatches, callback, callback_error);
    }
};

export const fetchArchivoLiteral = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearArchivosLiterales = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateArchivoLiteral = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};