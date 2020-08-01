import {
    callApiMethodPost,
    callApiMethodPostParameters,
    createObject,
    deleteObject,
    fetchListGet,
    fetchListGetURLParameters,
    fetchObject,
    updateObject,
    uploadArchivo
} from '../../00_general_fuctions'
import {COTIZACION_TYPES as TYPES} from '../../00_types';

const current_url_api = 'cotizaciones';
export const createCotizacion = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteCotizacion = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchCotizaciones = (options_action = {}) => {
    return (dispatch) => {
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
        return fetchListGet(current_url_api, options);
    }
};

export function fetchCotizacionesxParametro(parametro, options_action = {}) {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_cotizaciones_x_parametro/?parametro=${parametro}`;
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
        return fetchListGetURLParameters(FULL_URL, options);
    }
}

export const fetchCotizacionesAgendadas = (options_action = {}) => {
    return (dispatch) => {
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
        return fetchListGet(`${current_url_api}/listar_cotizaciones_agendadas`, options);
    }
};

export const adicionarCondicionInicioProyectoCotizacion = (id, condicion_inicio_proyecto_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('tipo_accion', 'add');
        params.append('condicion_inicio_proyecto_id', condicion_inicio_proyecto_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_quitar_condicion_inicio', params, options)
    }
};

export const adicionarOrdenCompraCotizacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_pago_proyectado', values, options)
    }
};

export const adicionarOrdenCompraCotizacionDesdeVieja = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_pago_proyectado_desde_vieja', values, options)
    }
};

export const adicionarPagoCotizacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_pago', values, options)
    }
};

export const eliminarOrdenCompraCotizacion = (id, orden_compra_id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        let params = new URLSearchParams();
        params.append('orden_compra_id', orden_compra_id);
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'eliminar_pago_proyectado', params, options)
    }
};

export const eliminarPagoCotizacion = (id, pago_id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        let params = new URLSearchParams();
        params.append('pago_id', pago_id);
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'eliminar_pago', params, options)
    }
};

export const fetchCotizacionesPorAnoMes = (filtro, options_action = {}) => {
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
        let months = '['
        let years = '['
        filtro.months.map(m =>
            months = `${months}${m},`
        )
        months = `${months}]`.replace(',]', ']').replace('[', '').replace(']', '')

        filtro.years.map(y =>
            years = `${years}${y},`
        )
        years = `${years}]`.replace(',]', ']').replace('[', '').replace(']', '')
        let filtro_url = `months=${months}&years=${years}`;
        return fetchListGetURLParameters(`${current_url_api}/cotizaciones_por_ano_mes/?${filtro_url}`, options);
    }
};

export const quitarCondicionInicioProyectoCotizacion = (id, condicion_inicio_proyecto_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('tipo_accion', 'del');
        params.append('condicion_inicio_proyecto_id', condicion_inicio_proyecto_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_quitar_condicion_inicio', params, options)
    }
};
export const cambiarFechaProximoSeguimientoCotizacion = (id, fecha_limite_segumiento_estado, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('fecha_limite_segumiento_estado', fecha_limite_segumiento_estado);
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'cambiar_fecha_proximo_seguimiento', params, options)
    }
};


export const relacionarQuitarProyectoaCotizacion = (id, proyecto_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('proyecto_id', proyecto_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'relacionar_quitar_proyecto', params, options)
    }
};

export const limpiarCondicionInicioCotizacion = (id, condicion_inicio_proyecto_id, es_orden_compra, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        if (condicion_inicio_proyecto_id) {
            params.append('condicion_inicio_proyecto_id', condicion_inicio_proyecto_id);
        }
        if (es_orden_compra) {
            params.append('es_orden_compra', es_orden_compra);
        }
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'limpiar_condicion_inicio_proyecto', params, options)
    }
};

export const actualizarOrdenCompraCotizacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch, content_type: 'application/json'};
        return callApiMethodPostParameters(current_url_api, id, 'actualizar_orden_compra', values, options)
    }
};

export const adicionarQuitarCondicionInicioProyectoCotizacion = (id, tipo_accion, condicion_inicio_proyecto_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('tipo_accion', tipo_accion);
        params.append('condicion_inicio_proyecto_id', condicion_inicio_proyecto_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'adicionar_quitar_condicion_inicio_proyecto', params, options)
    }
};
export const relacionarQuitarLiteralCotizacion = (id, literal_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('literal_id', literal_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'relacionar_quitar_literal', params, options)
    }
};
export const convertirEnAdicionalCotizacion = (id, cotizacion_inicial_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('cotizacion_inicial_id', cotizacion_inicial_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPostParameters(current_url_api, id, 'convertir_en_adicional', params, options)
    }
};

export const setRevisadoCotizacion = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {...options_action, dispatches, dispatch_method: dispatch};
        return callApiMethodPost(current_url_api, id, 'set_revisado', options)
    }
};


export const fetchCotizacionesPidiendoCarpeta = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_cotizacion_abrir_carpeta`;
        const {limpiar_coleccion = true} = options_action;
        const options = {
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchListGet(FULL_URL, options);
    }
};

export const fetchCotizacionesConProyectos = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/cotizaciones_con_proyectos`;
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
        return fetchListGet(FULL_URL, options);
    }
};

export const fetchCotizacionesTuberiaVentas = (options_action = {}) => {
    return function (dispatch) {
        const FULL_URL = `${current_url_api}/listar_cotizaciones_tuberia_ventas`;
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
        return fetchListGet(FULL_URL, options);
    }
};

export const fetchCotizacionesTuberiaVentasResumen = (ano = null, mes = null, options_action = {}) => {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: {...response, ...options_action}})
        };
        if (ano && mes) {
            const FULL_URL = `${current_url_api}/cotizaciones_resumen_tuberia_ventas/?ano=${ano}&mes=${mes}`;

            const {limpiar_coleccion = true} = options_action;
            const options = {
                dispatches,
                ...options_action,
                dispatch_method: dispatch,
                clear_action_type: limpiar_coleccion ? TYPES.clear : null
            };
            return fetchListGetURLParameters(FULL_URL, options);

        } else {
            const FULL_URL = `${current_url_api}/cotizaciones_resumen_tuberia_ventas`;
            const {limpiar_coleccion = true} = options_action;
            const options = {
                dispatches,
                ...options_action,
                dispatch_method: dispatch,
                clear_action_type: limpiar_coleccion ? TYPES.clear : null
            };
            return fetchListGet(FULL_URL, options);
        }
    }
};


export const fetchCotizacion = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};

export const clearCotizaciones = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});

    }
};
export const updateCotizacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};
export const uploadArchivoCotizacion = (id, values, options_action = {}) => {
    return (dispatch) => {
        const options = {...options_action, dispatch_method: dispatch};
        uploadArchivo(current_url_api, id, 'upload_archivo', values, options)
    }
};