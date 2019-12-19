import {PROFORMA_ANTICIPO_TYPES as TYPES} from '../../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPostParametersPDF,
    callApiMethodPostParameters,
    uploadArchivo, fetchListGetURLParameters,
} from '../../../00_general_fuctions'

const current_url_api = 'contabilidad_anticipos_proformas_cobros';

export const fetchProformasAnticiposReporte = (year = null, month = null, options_action = {}) => {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        if (year && month) {
            const FULL_URL = `${current_url_api}/reporte/?year=${year}&month=${month}`;
            return fetchListGetURLParameters(FULL_URL, options);

        } else {
            const FULL_URL = `${current_url_api}/reporte`;
            return fetchListGet(FULL_URL, options);
        }
    }
};


export const createProformaAnticipo = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};

export const addItemProformaAnticipo = (id, cantidad, descripcion, valor_unitario, referencia, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('referencia', referencia);
        params.append('cantidad', cantidad);
        params.append('descripcion', descripcion);
        params.append('valor_unitario', valor_unitario);
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_item', params, options)
    }
};

export const relacionarLiteralProformaAnticipo = (id, literal_id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('literal_id', literal_id);
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'relacionar_literal', params, options)
    }
};

export const quitarRelacionLiteralProformaAnticipo = (id, literal_id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('literal_id', literal_id);
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'quitar_relacion_literal', params, options)
    }
};

export const cambiarEstadoProformaAnticipo = (id, estado, fecha_cobro = null, recibo_pago = null, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('estado', estado);
        if (fecha_cobro) {
            params.append('fecha_cobro', fecha_cobro);
        }
        if (recibo_pago) {
            params.append('recibo_pago', recibo_pago);
        }
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'cambiar_estado', params, options)
    }
};

export const enviarProformaAnticipo = (id, email_texto_adicional, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('email_texto_adicional', email_texto_adicional);
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'enviar_cobro', params, options)
    }
};

export const eliminarItemProformaAnticipo = (id, item_id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        let params = new URLSearchParams();
        params.append('item_id', item_id);
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'eliminar_item', params, options)
    }
};

export function printCobroProformaAnticipo(id, options_action) {
    return function (dispatch) {
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParametersPDF(current_url_api, id, 'imprimir_cobro', null, options)
    }
}

export const deleteProformaAnticipo = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchProformasAnticipos = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches, ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(current_url_api, options);
    }
};
export const fetchProformaAnticipo = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearProformasAnticipos = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateProformaAnticipo = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};


export const uploadArchivoProformaAnticipo = (id, values, options_action = {}) => {
    return (dispatch) => {
        const options = {...options_action, dispatch_method: dispatch};
        uploadArchivo(current_url_api, id, 'upload_archivo', values, options)
    }
};