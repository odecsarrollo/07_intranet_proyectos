import {
    MANO_OBRA_HORAS_HOJA_TRABAJO_TYPES as TYPES
} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    fetchListGetURLParameters,
    fetchObjectWithParameterPDF
} from '../../00_general_fuctions'

const current_url_api = 'mano_obra_hoja_trabajo_horas';

export function printReporteCostoTresProyecto(valores, options_action = {}) {
    return function (dispatch) {
        let FULL_URL = `${current_url_api}/print_costos_tres/`;
        if (valores.lapso) {
            FULL_URL = `${FULL_URL}?fecha_inicial=${valores.fecha_inicial}&fecha_final=${valores.fecha_final}&con_mo_saldo_inicial=${valores.con_mo_saldo_inicial}`
        }
        fetchObjectWithParameterPDF(FULL_URL, options_action)
    }
}

export const fetchHorasHojasTrabajosAutogestionadas = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/autogestionadas_x_fechas`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(FULL_URL, options);
    }
};

export function fetchHorasHojasTrabajosAutogestionadasxFechas(fecha_inicial, fecha_final, options_action = {}) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/autogestionadas_x_fechas/?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGetURLParameters(FULL_URL, options);
    }
}

export function fetchHorasHojasTrabajosxLiteral(literal_id, options_action = {}) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/horas_por_literal/?literal_id=${literal_id}`;
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGetURLParameters(FULL_URL, options);
    }
}

export const createHoraHojaTrabajo = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        createObject(current_url_api, values, options);
    }
};
export const deleteHoraHojaTrabajo = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        deleteObject(current_url_api, id, options);
    }
};
export const fetchHorasHojasTrabajos = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        fetchListGet(current_url_api, options);
    }
};

export const fetchHoraHojaTrabajo = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        fetchObject(current_url_api, id, options);
    }
};

export const clearHorasHojasTrabajos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateHoraHojaTrabajo = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        updateObject(current_url_api, id, values, options);
    }
};