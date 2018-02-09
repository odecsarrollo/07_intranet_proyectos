import {
    CREATE_PROYECTO,
    FETCH_PROYECTOS,
    FETCH_PROYECTO,
    UPDATE_PROYECTO,
    DELETE_PROYECTO
} from '../../00_types';

import {
    fetchList,
    fetchObject,
    updateObject,
    createObject,
    deleteObject
} from './../../00_general_fuctions'

const current_url_api = 'proyectos';

export const fetchProyectos = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTOS, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};

export const fetchProyecto = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTO, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};

export const updateProyecto = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: UPDATE_PROYECTO, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};

export const deleteProyecto = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: DELETE_PROYECTO, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};

export const createProyecto = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: CREATE_PROYECTO, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
