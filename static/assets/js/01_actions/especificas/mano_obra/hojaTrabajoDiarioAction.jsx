import {
    MANO_OBRA_HOJA_TRABAJO_TYPES as TYPES
} from '../../00_types';
import {
    fetchListOld,
    updateObjectOld,
    fetchObjectOld,
    deleteObjectOld,
    createObjectOld,
    fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'mano_obra_hoja_trabajo';

export function fetchHojasTrabajosxFechas(fecha_inicial, fecha_final, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_x_fechas/?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameterOld(FULL_URL, dispatches, callback, callback_error);
    }
}

export const createHojaTrabajo = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObjectOld(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteHojaTrabajo = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObjectOld(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchHojasTrabajos = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListOld(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchHojaTrabajo = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearHojasTrabajos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateHojaTrabajo = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObjectOld(current_url_api, id, values, dispatches, callback, callback_error)
    }
};