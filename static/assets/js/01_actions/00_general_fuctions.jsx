import axios from "axios/index";
import {LOADING, LOADING_STOP} from "./00_types";
import {NOTIFICATION_TYPE_ERROR, NOTIFICATION_TYPE_SUCCESS} from 'react-redux-notify';
import {createNotification} from 'react-redux-notify';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const axios_instance = axios.create({
    baseURL: '/api/',
    //contentType: 'application/json; charset=utf-8',
});

const notificarAction = (mensaje, tiempo = 5000) => {
    return {
        message: mensaje,
        type: NOTIFICATION_TYPE_SUCCESS,
        duration: tiempo,
        position: 'BottomRight',
        canDimiss: true,
        icon: <FontAwesomeIcon icon={['fas', 'check']}/>
    }
};


const notificacion_error = (error, tiempo = 7000) => {
    let mensaje = '';
    let mensaje_final = '';
    const {type_error} = error;

    if (error.response) {
        mensaje_final += `Error ${error.response.status} ${error.response.statusText}`
    }
    if (type_error) {
        switch (type_error) {
            case 'no_connection':
                mensaje = 'Se han presentado problemas de conexión';
                break;
            case 404:
                mensaje = `El servicio de consulta se encuentra caido:`;
                break;
            case 400:
                mensaje = `Problema en la consulta:`;
                break;
            case 403:
                mensaje = `Problema en autenticación:`;
                break;
            case 401:
                mensaje = `Problema en autenticación:`;
                break;
            case 500:
                mensaje = `Error grave en el servidor, avisar al administrador:`;
                break;
            default:
                mensaje += `Otro mensaje no especificado:`;
        }
    }

    if (error.response && error.response.data) {
        _.map(error.response.data, item => {
            mensaje += `(${item})`
        })
    }
    if (error.config && error.config.baseURL) {
        mensaje += `(${error.config.baseURL})`
    }
    mensaje += ` ${mensaje_final}.`;

    return {
        message: mensaje,
        type: NOTIFICATION_TYPE_ERROR,
        duration: tiempo,
        position: 'BottomRight',
        canDimiss: true,
        icon: <FontAwesomeIcon icon={['fas', 'exclamation']}/>
    };
};

export function createRequest(request, options = {}) {
    const {
        dispatches = null,
        callback = null,
        callback_error = null,
        dispatch_method = null,
        clear_action_type = null,
        mensaje_cargando = '',
        show_cargando = true,
    } = options;

    if (clear_action_type) {
        dispatch_method({type: clear_action_type})
    }
    if (dispatch_method && show_cargando) {
        dispatch_method({type: LOADING, message: mensaje_cargando})
    }
    return request
        .then(response => {
            if (dispatches) {
                dispatches(response)
            }
            if (dispatch_method) {
                if (response.data && response.data.result) {
                    dispatch_method(createNotification(notificarAction(response.data.result)));
                }
                dispatch_method({type: LOADING_STOP})
            }
            if (callback) {
                callback(response.data)
            }
        }).catch(error => {
                if (callback_error) {
                    callback_error(error);
                }
                if (dispatch_method) {
                    let notificacion = null;
                    if (!error.response) {
                        notificacion = notificacion_error({type_error: 'no_connection'})
                    } else if (error.request) {
                        notificacion = notificacion_error({...error, type_error: error.request.status})
                    } else {
                        notificacion = notificacion_error({...error, type_error: 'otro'})
                    }
                    dispatch_method(createNotification(notificacion));
                }
            }
        );
}


export function createRequestOld(request, dispatches = null, callback = null, callback_error = null) {
    return request
        .then(response => {
            if (dispatches) {
                dispatches(response)
            }
            if (callback) {
                callback(response.data)
            }
        }).catch(error => {
                if (callback_error) {
                    if (!error.response) {
                        callback_error({type_error: 'no_connection'})
                    } else if (error.request) {
                        callback_error({...error, type_error: error.request.status})
                    } else {
                        callback_error({...error, type_error: 'otro'})
                    }
                }
            }
        );
}

export function fetchListOld(url, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cFETCH LIST - %c${url.toUpperCase()}`, 'color:red', 'color:blue');
    const FULL_URL = `${url}/?format=json`;
    const request = axios_instance.get(FULL_URL);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}


export function fetchListGet(url, options) {
    console.log(`%cFETCH LIST - %c${url.toUpperCase()}`, 'color:red', 'color:blue');
    const mensaje_cargando = `Consultando ${url.toUpperCase()}`;
    const FULL_URL = `${url}/?format=json`;
    const headers = {"Content-Type": "application/json"};
    if (localStorage.token) {
        headers["Authorization"] = `Token ${localStorage.token}`;
    }
    axios_instance.defaults.headers = headers;
    const request = axios_instance.get(FULL_URL);
    createRequest(request, {...options, mensaje_cargando});
}


export function fetchListWithParameterOld(url, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()}`, 'color:red', 'color:blue');
    const FULL_URL = `${url}&format=json`;
    const request = axios_instance.get(FULL_URL);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function fetchObjectOld(url, id, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cFETCH OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
    const FULL_URL = `${url}/${id}/?format=json`;
    const request = axios_instance.get(FULL_URL);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function updateObjectOld(url, id, values, dispatches = null, callback = null, callback_error = null, config = null) {
    console.log(`%cUPDATE OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/`;
    const request = axios_instance.put(FULL_URL, values, config);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function createObjectOld(url, values, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cCREATE OBJETO - %c${url.toUpperCase()}`, 'color:red', 'color:blue');
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/`;
    const request = axios_instance.post(FULL_URL, values);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function deleteObjectOld(url, id, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cDELETE OBJETO - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/`;
    const request = axios_instance.delete(FULL_URL);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}


export function callApiMethodOld(url, id, method, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cAPI METODO ${method.toUpperCase()} - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function callApiMethodWithParametersOld(url, id, method, parameters, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id}`, 'color:red', 'color:blue', 'color:green');
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, parameters);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function listRoutePostWithParametersOld(url, method, parameters, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cLIST ROUTE POST ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()}`, 'color:red', 'color:blue');
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${method}/`;
    const request = axios_instance.post(FULL_URL, parameters);
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function callApiMethodWithParametersPDFOld(url, id, method, parameters, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cAPI METODO ${method.toUpperCase()} CON PARMAETROS - %c${url.toUpperCase()} - %cID ${id} PARA PDF`, 'color:red', 'color:blue', 'color:green');
    axios_instance.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios_instance.defaults.xsrfCookieName = "csrftoken";
    const FULL_URL = `${url}/${id}/${method}/`;
    const request = axios_instance.post(FULL_URL, parameters, {responseType: 'arraybuffer'});
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}

export function fetchObjectWithParameterPDFOld(url, dispatches = null, callback = null, callback_error = null) {
    console.log(`%cFETCH LIST PARAMETROS - %c${url.toUpperCase()} PARA PDF`, 'color:red', 'color:blue');
    const FULL_URL = `${url}&format=json`;
    const request = axios_instance.get(FULL_URL, {responseType: 'arraybuffer'});
    createRequestOld(
        request,
        dispatches,
        callback,
        callback_error
    );
}