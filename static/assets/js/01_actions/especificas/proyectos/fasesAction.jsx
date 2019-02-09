import {FASE_TYPES as TYPES } from '../../00_types';
import {
    fetchListOld,
    updateObjectOld,
    fetchObjectOld,
    deleteObjectOld,
    createObjectOld,
    callApiMethodWithParametersOld
} from '../../00_general_fuctions'

const current_url_api = 'fases';
export const createFase = (values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type: TYPES.create, payload: response})};
       createObjectOld(current_url_api, values, dispatches, callback, callback_error)
    }
};
export const deleteFase = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type: TYPES.delete, payload: id})};
       deleteObjectOld(current_url_api, id, dispatches, callback, callback_error)
    }
};
export const fetchFases = (callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type: TYPES.fetch_all, payload: response})};
       fetchListOld(current_url_api, dispatches, callback, callback_error);
    }
};
export const fetchFase = (id, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type: TYPES.fetch, payload: response})};
       fetchObjectOld(current_url_api, id, dispatches, callback, callback_error);
    }
};
export const clearFases = () => {
    return (dispatch) => {
        dispatch({type: TYPES.clear});
       
    }
};
export const updateFase = (id,values, callback = null, callback_error = null) => {
    return (dispatch) => {
        const dispatches = (response) => {dispatch({type:TYPES.update, payload: response})};
       updateObjectOld(current_url_api, id, values, dispatches, callback, callback_error)
    }
};