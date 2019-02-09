import {FASE_LITERAL_TYPES as TYPES} from '../../00_types';
import {
    fetchListOld,
    updateObjectOld,
    fetchObjectOld,
    deleteObjectOld,
    createObjectOld,
    fetchListWithParameterOld,
    callApiMethodWithParametersOld
} from '../../00_general_fuctions'

const current_url_api = 'fases_literales';

export const cargarTareasFaseLiteral = (id, listado, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('listado', JSON.stringify(listado));
        callApiMethodWithParametersOld(current_url_api, id, 'cargar_tareas', params, dispatches, callback, callback_error)
    }
};

export const createFaseLiteral = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObjectOld(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteFaseLiteral = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObjectOld(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchFasesLiterales = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListOld(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchFasesLiterales_x_literal = (id_literal, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(`${current_url_api}/por_literal/?id_literal=${id_literal}`, dispatches, callback, callback_error);
    }
};
export const deleteListaTareasFaseLitera = (id, listado, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('listado', JSON.stringify(listado));
        callApiMethodWithParametersOld(current_url_api, id, 'eliminar_tareas', params, dispatches, callback, callback_error);
    }
};
export const fetchFaseLiteral = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearFasesLiterales = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateFaseLiteral = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObjectOld(current_url_api, id, values, dispatches, callback, callback_error)
    }
};