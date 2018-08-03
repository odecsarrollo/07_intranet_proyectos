import {ITEM_LISTADO_MATERIAL_TYPES as TYPES} from '../../00_types';
import {
    fetchList,
    updateObject,
    fetchObject,
    deleteObject,
    createObject,
    listRoutePostWithParameters,
    fetchListWithParameter
} from '../../00_general_fuctions'

const current_url_api = 'items_listados_materiales';

export function fetchItemsListadosMateriales_por_literal(literal_id, callback = null, callback_error = null) {
    return function (dispatch) {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchListWithParameter(`${current_url_api}/por_literal/?literal_id=${literal_id}`, dispatches, callback, callback_error)
    }
}


export const cargarItemsListadoMateriales = (id, listado, callback = null, callback_error = null) => {
    return (dispatch) => {

        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };

        let params = new URLSearchParams();
        params.append('listado', JSON.stringify(listado));
        params.append('literal_id', id);
        listRoutePostWithParameters(current_url_api, 'cargar_items_listados_materiales', params, dispatches, callback, callback_error)
    }
};

export const actualizarItemsListadoMateriales = (id, cambios, callback = null, callback_error = null) => {
    return (dispatch) => {

        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };

        let params = new URLSearchParams();
        params.append('cambios', JSON.stringify(cambios));
        params.append('literal_id', id);
        listRoutePostWithParameters(current_url_api, 'actualizar_items_listados_materiales', params, dispatches, callback, callback_error)
    }
};

export const createItemListadoMaterial = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.create, payload: response})
        };
        createObject(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteItemListadoMaterial = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.delete, payload: id})
        };
        deleteObject(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchItemsListadosMateriales = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch_all, payload: response})
        };
        fetchList(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchItemListadoMaterial = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.fetch, payload: response})
        };
        fetchObject(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearItemsListadosMateriales = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});

    }
};
export const updateItemListadoMaterial = (id, values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.update, payload: response})
        };
        updateObject(current_url_api, id, values, dispatches, callback, callback_error)
    }
};