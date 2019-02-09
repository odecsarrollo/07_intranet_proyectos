import {MIEMBRO_LITERAL_TYPES as TYPES} from '../../00_types';
import {
    fetchListOld,
    updateObjectOld,
    fetchObjectOld,
    deleteObjectOld,
    createObjectOld,
    fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'miembros_literales';

export const fetchMiembrosLiterales_x_literal = (id_literal, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(`${current_url_api}/por_literal/?literal_id=${id_literal}`, dispatches, callback, callback_error);
    }
};


export const createMiembroLiteral = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObjectOld(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteMiembroLiteral = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObjectOld(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchMiembrosLiterales = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListOld(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchMiembroLiteral = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearMiembrosLiterales = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateMiembroLiteral = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObjectOld(current_url_api, id, values, dispatches, callback, callback_error)
    }
};