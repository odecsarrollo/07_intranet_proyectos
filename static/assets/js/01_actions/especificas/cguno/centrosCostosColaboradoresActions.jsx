import {
    CREATE_CENTRO_COSTO_COLABORADOR,
    DELETE_CENTRO_COSTO_COLABORADOR,
    FETCH_CENTROS_COSTOS_COLABORADORES,
    FETCH_CENTRO_COSTO_COLABORADOR,
    CLEAR_CENTROS_COSTOS_COLABORADORES,
    UPDATE_CENTRO_COSTO_COLABORADOR,
} from '../../00_types';
import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodWithParameters
} from '../../00_general_fuctions'

const current_url_api = 'colaboradores_centros_costos';
export const createCentroCostoColaborador = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: CREATE_CENTRO_COSTO_COLABORADOR, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteCentroCostoColaborador = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: DELETE_CENTRO_COSTO_COLABORADOR, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchCentrosCostosColaboradores = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_CENTROS_COSTOS_COLABORADORES, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchCentroCostoColaborador = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_CENTRO_COSTO_COLABORADOR, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearCentrosCostosColaboradores = () => {
    return (dispatch) => {
        dispatch({type: CLEAR_CENTROS_COSTOS_COLABORADORES});

    }
};
export const updateCentroCostoColaborador = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: UPDATE_CENTRO_COSTO_COLABORADOR, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};