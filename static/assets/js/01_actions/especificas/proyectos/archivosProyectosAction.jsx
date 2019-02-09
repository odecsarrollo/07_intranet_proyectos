import {ARCHIVO_PROYECTO_TYPES as TYPES} from '../../00_types';
import {
    fetchListOld,
    updateObjectOld,
    fetchObjectOld,
    deleteObjectOld,
    createObjectOld,
    fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'proyectos_archivos';
export const createArchivoProyecto = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObjectOld(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteArchivoProyecto = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObjectOld(current_url_api, id, dispatches, callback, callback_error)
    }
};

export const fetchArchivosProyectos_x_proyecto = (proyecto_id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const url = `${current_url_api}/listar_x_proyecto/?proyecto_id=${proyecto_id}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(url, dispatches, callback, callback_error);
    }
};

export const fetchArchivosProyectos = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListOld(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchArchivoProyecto = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearArchivosProyectos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateArchivoProyecto = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObjectOld(current_url_api, id, values, dispatches, callback, callback_error)
    }
};