import {COTIZACION_COMPONENTE_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    callApiMethodPostParameters,
    callApiMethodPostParametersPDF,
    callApiMethodPost,
    uploadArchivo
} from '../../00_general_fuctions'

const current_url_api = 'cotizaciones_componentes';

export const eliminarItemCotizacionComponente = (id, id_item_cotizacion, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('id_item_cotizacion', id_item_cotizacion);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'eliminar_item', params, options)
    }
};

export const cambiarPosicionItemCotizacionComponente = (id, item_uno_id, item_dos_id, options_action = {}) => {
    return (dispatch) => {
        console.log(item_uno_id)
        console.log(item_dos_id)
        let params = new URLSearchParams();
        params.append('item_uno_id', item_uno_id);
        params.append('item_dos_id', item_dos_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'cambiar_posicion_item', params, options)
    }
};


export const adicionarItemCotizacionComponente = (
    id,
    tipo_item,
    precio_unitario,
    item_descripcion,
    item_referencia,
    item_unidad_medida,
    tipo_transporte,
    id_item = null,
    forma_pago_id = null,
    options_action = {},
) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('tipo_item', tipo_item);
        params.append('precio_unitario', precio_unitario);
        params.append('item_descripcion', item_descripcion);
        params.append('item_referencia', item_referencia);
        params.append('item_unidad_medida', item_unidad_medida);
        params.append('tipo_transporte', tipo_transporte);
        if (id_item) {
            params.append('id_item', id_item);
        }
        if (forma_pago_id) {
            params.append('forma_pago_id', forma_pago_id);
        }
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_item', params, options)
    }
};


export const adicionarSeguimientoCotizacionComponente = (
    id,
    tipo_seguimiento,
    descripcion,
    fecha = null,
    options_action = {},
) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('descripcion', descripcion);
        params.append('tipo_seguimiento', tipo_seguimiento);
        if (fecha) {
            console.log(typeof fecha)
            params.append('fecha', fecha);
        }
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_seguimiento', params, options)
    }
};


export const eliminarSeguimientoCotizacionComponente = (
    id,
    seguimiento_id,
    options_action = {},
) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('seguimiento_id', seguimiento_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'eliminar_seguimiento', params, options)
    }
};

export const createCotizacionComponente = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteCotizacionComponente = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchCotizacionesComponentes = (options_action = {}) => {
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
export const fetchCotizacionesComponentesEdicionAsesor = (options_action = {}) => {
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
        return fetchListGet(`${current_url_api}/cotizaciones_en_edicion_asesor`, options);
    }
};
export const fetchCotizacionComponente = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearCotizacionesComponentes = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};

export const printCotizacionComponente = (id, options_action) => {
    return function (dispatch) {
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParametersPDF(current_url_api, id, 'imprimir', null, options)
    }
};

export const uploadCotizacionComponente = (id, values, options_action = {}) => {
    return (dispatch) => {
        const options = {...options_action, dispatch_method: dispatch};
        uploadArchivo(current_url_api, id, 'upload_archivo', values, options)
    }
};

export const cambiarEstadoCotizacionComponente = (id, nuevo_estado, razon_rechazo = null, options_action) => {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('nuevo_estado', nuevo_estado);
        if (razon_rechazo) {
            params.append('razon_rechazo', razon_rechazo);
        }
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'cambiar_estado', params, options)
    }
};

export const enviarCotizacionComponente = (id, valores, options_action) => {
    return function (dispatch) {
        let params = new URLSearchParams();
        _.mapKeys(valores, (v, k) => {
            params.append(k, v);
        });
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'enviar', params, options)
    }
};

export const asignarNroConsecutivoCotizacionComponente = (id, options_action) => {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPost(current_url_api, id, 'asignar_consecutivo', options)
    }
};

export const updateCotizacionComponente = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};

export const uploadAdjuntoCotizacionComponente = (id, values, options_action = {}) => {
    return (dispatch) => {
        const options = {...options_action, dispatch_method: dispatch};
        uploadArchivo(current_url_api, id, 'upload_archivo', values, options)
    }
};

export const deleteAdjuntoCotizacionComponente = (id, adjunto_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('adjunto_id', adjunto_id);
        const options = {...options_action, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'delete_archivo', params, options)
    }
};