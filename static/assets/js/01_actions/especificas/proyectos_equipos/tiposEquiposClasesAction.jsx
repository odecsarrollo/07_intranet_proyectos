import {TIPO_EQUIPO_CLASE_TYPES as TYPES} from '../../00_types';
import {
    fetchListGet,
    updateObject,
    fetchObject,
    deleteObject,
    createObject, callApiMethodPostParameters, uploadArchivo,
} from '../../00_general_fuctions'

const current_url_api = 'tipos_equipos_clases';
export const createTipoEquipoClase = (values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return createObject(current_url_api, values, options);
    }
};
export const deleteTipoEquipoClase = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return deleteObject(current_url_api, id, options);
    }
};
export const fetchTiposEquiposClases = (options_action = {}) => {
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
export const fetchTipoEquipoClase = (id, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return fetchObject(current_url_api, id, options);
    }
};
export const clearTiposEquiposClases = (options_action = {}) => {
    return (dispatch) => {
        dispatch({type: TYPES.clear, payload: options_action});

    }
};
export const updateTipoEquipoClase = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {dispatches, ...options_action, dispatch_method: dispatch};
        return updateObject(current_url_api, id, values, options);
    }
};

export const uploadArchivoTipoEquipoClase = (id, values, options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        uploadArchivo(current_url_api, id, 'upload_archivo', values, options)
    }
};

export function updateArchivoTipoEquipoClase(id, archivo_id, nombre, options_action = {}) {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('archivo_id', archivo_id);
        params.append('nombre', nombre);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'editar_archivo', params, options)
    }
}

export function deleteArchivoTipoEquipoClase(id, archivo_id, options_action = {}) {
    return function (dispatch) {
        let params = new URLSearchParams();
        params.append('archivo_id', archivo_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'delete_archivo', params, options)
    }
}

export const createCampoTipoEquipoClase = (id, campo_values, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        _.mapKeys(campo_values, (v, k) => {
            params.append(k, v);
        });
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'crear_campo', params, options)
    }
};

export const updateCampoTipoEquipoClase = (id, tipo_equipo_campo_id, clase_values, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        _.mapKeys(clase_values, (v, k) => {
            params.append(k, v);
        });
        params.append('tipo_equipo_campo_id', tipo_equipo_campo_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'actualizar_campo', params, options)
    }
};

export const deleteCampoTipoEquipoClase = (id, tipo_equipo_campo_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('tipo_equipo_campo_id', tipo_equipo_campo_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'eliminar_campo', params, options)
    }
};

export const createRutinaTipoEquipoClase = (id, campo_values, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        _.mapKeys(campo_values, (v, k) => {
            params.append(k, v);
        });
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'crear_rutina', params, options)
    }
};

export const updateRutinaTipoEquipoClase = (id, rutina_id, clase_values, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        _.mapKeys(clase_values, (v, k) => {
            params.append(k, v);
        });
        params.append('rutina_id', rutina_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'actualizar_rutina', params, options)
    }
};

export const deleteRutinaTipoEquipoClase = (id, rutina_id, options_action = {}) => {
    return (dispatch) => {
        let params = new URLSearchParams();
        params.append('rutina_id', rutina_id);
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: {...response, ...options_action}})
        };
        const options = {...options_action, dispatch_method: dispatch, dispatches};
        return callApiMethodPostParameters(current_url_api, id, 'eliminar_rutina', params, options)
    }
};