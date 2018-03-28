import {
    MANO_OBRA_HORAS_HOJA_TRABAJO_TYPES as TYPES
} from '../../00_types';
import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListWithParameter
} from '../../00_general_fuctions'

const current_url_api = 'mano_obra_hoja_trabajo_horas';


export function fetchHorasHojasTrabajosAutogestionadas(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/autogestionadas_x_fechas`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(FULL_URL, dispatches, callback, callback_error);
    }
}

export function fetchHorasHojasTrabajosAutogestionadasxFechas(fecha_inicial, fecha_final, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/autogestionadas_x_fechas/?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameter(FULL_URL, dispatches, callback, callback_error);
    }
}

export const createHoraHojaTrabajo = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteHoraHojaTrabajo = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchHorasHojasTrabajos = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchHoraHojaTrabajo = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearHorasHojasTrabajos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateHoraHojaTrabajo = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};