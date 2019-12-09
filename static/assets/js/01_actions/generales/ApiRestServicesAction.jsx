import {API_REST_ACTIONS as TYPES} from '../00_types';
import {
    fetchApiRestGet
} from '../00_general_fuctions'

export const fetchTRMDia = (options_action = {}) => {
    return (dispatch) => {
        const dispatches = (response) => {
            dispatch({type: TYPES.trm_colombia, payload: response})
        };
        const {limpiar_coleccion = true} = options_action;
        const options = {
            dispatches,
            ...options_action,
            dispatch_method: dispatch,
            clear_action_type: limpiar_coleccion ? TYPES.clear : null
        };
        return fetchApiRestGet(`https://www.datos.gov.co/resource/32sa-8pi3.json`, options);
    }
};

//24mo7gy4pt93qdjr3spdsnqpv
//1jixmfp0obobemc7j550ut1ppuf6n7iz17pp9zdp2uyk9xkkgv