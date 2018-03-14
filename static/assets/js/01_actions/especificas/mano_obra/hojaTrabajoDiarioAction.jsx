import {
    CREATE_MANO_OBRA_HOJA_TRABAJO,
    DELETE_MANO_OBRA_HOJA_TRABAJO,
    FETCH_MANOS_OBRAS_HOJAS_TRABAJOS,
    FETCH_MANO_OBRA_HOJA_TRABAJO,
    CLEAR_MANOS_OBRAS_HOJAS_TRABAJOS,
    UPDATE_MANO_OBRA_HOJA_TRABAJO,
} from '../../00_types';
import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodWithParameters
} from '../../00_general_fuctions'

const current_url_api = 'mano_obra_hoja_trabajo';
export const createHojaTrabajo = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: CREATE_MANO_OBRA_HOJA_TRABAJO, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteHojaTrabajo = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: DELETE_MANO_OBRA_HOJA_TRABAJO, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchHojasTrabajos = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_MANOS_OBRAS_HOJAS_TRABAJOS, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchHojaTrabajo = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_MANO_OBRA_HOJA_TRABAJO, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearHojasTrabajos = () => {
    return (dispatch) => {
        dispatch({type: CLEAR_MANOS_OBRAS_HOJAS_TRABAJOS});

    }
};
export const updateHojaTrabajo = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: UPDATE_MANO_OBRA_HOJA_TRABAJO, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};