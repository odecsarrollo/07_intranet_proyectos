import {
    CREATE_PROYECTO,
    FETCH_PROYECTOS,
    FETCH_PROYECTO,
    UPDATE_PROYECTO,
    DELETE_PROYECTO,
    CLEAR_PROYECTOS,
    UPLOAD_ARCHIVO_PROYECTO,
} from '../../00_types';

import {
    fetchListOld,
    fetchObjectOld,
    updateObjectOld,
    createObjectOld,
    deleteObjectOld,
    fetchObjectWithParameterPDFOld,
    callApiMethodWithParametersPDFOld, fetchListWithParameterOld
} from '../../00_general_fuctions'

const current_url_api = 'proyectos';

export function fetchProyectosxParametro(parametro, callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_proyectos_x_parametro/?parametro=${parametro}`;
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTOS, payload: response})
        };
        fetchListWithParameterOld(FULL_URL, dispatches, callback, callback_error);
    }
}

export function printReporteCostoProyecto(id_proyecto, valores, callback = null, callback_error = null) {
    return function (dispatch) {
        let FULL_URL = `${current_url_api}/print_costos/?id_proyecto=${id_proyecto}`;
        if (valores.lapso) {
            FULL_URL = `${FULL_URL}&fecha_inicial=${valores.fecha_inicial}&fecha_final=${valores.fecha_final}&con_mo_saldo_inicial=${valores.con_mo_saldo_inicial}`
        }
        fetchObjectWithParameterPDFOld(FULL_URL, null, callback, callback_error)
    }
}

export function printReporteCostoDosProyecto(valores, callback = null, callback_error = null) {
    return function (dispatch) {
        let FULL_URL = `${current_url_api}/print_costos_dos/`;
        if (valores.lapso) {
            console.log('si tiene lapso')
            FULL_URL = `${FULL_URL}?fecha_inicial=${valores.fecha_inicial}&fecha_final=${valores.fecha_final}&con_mo_saldo_inicial=${valores.con_mo_saldo_inicial}`
        }
        fetchObjectWithParameterPDFOld(FULL_URL, null, callback, callback_error)
    }
}

export const fetchProyectos = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTOS, payload: response})
        };
        fetchListOld(current_url_api, dispatches, callback, callback_error);
    }
};

export const clearProyectos = () => {
    return (dispatch) => {
        dispatch({type: CLEAR_PROYECTOS})
    }
};

export function fetchProyectosAbiertos(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/abiertos`;
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTOS, payload: response})
        };
        fetchListOld(FULL_URL, dispatches, callback, callback_error)
    }
}

export function fetchProyectosConLiteralesAbiertos(callback = null, callback_error = null) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/con_literales_abiertos`;
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTOS, payload: response})
        };
        fetchListOld(FULL_URL, dispatches, callback, callback_error)
    }
}

export const fetchProyecto = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: FETCH_PROYECTO, payload: response})
        };
        fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
};

export const updateProyecto = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: UPDATE_PROYECTO, payload: response})
        };
        updateObjectOld(current_url_api, id, values, dispatches, callback, callback_error)
    }
};

export const deleteProyecto = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: DELETE_PROYECTO, payload: id})
        };
        deleteObjectOld(current_url_api, id, dispatches, callback, callback_error)
    }
};

export const createProyecto = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: CREATE_PROYECTO, payload: response})
        };
        createObjectOld(current_url_api, values, dispatches, callback, callback_error)
    }
};

export const uploadArchivoProyecto = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: UPLOAD_ARCHIVO_PROYECTO, payload: response})
        };
        callApiMethodWithParametersPDFOld(current_url_api, id, 'upload_archivo', values, dispatches, callback, callback_error)
    }
};