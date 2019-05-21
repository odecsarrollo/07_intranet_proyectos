import React from 'react';
import Notifications from 'react-notification-system-redux';

export function notificarAction(mensaje, tipo = 'success', tiempo = 5, title = 'Información de Acción') {
    return function (dispatch) {
        const notificationOpts = {
            title,
            message: mensaje,
            position: 'tr',
            autoDismiss: tiempo
        };
        dispatch(Notifications.success(notificationOpts));
    }
}

export function notificarErrorAction(error, tiempo = 7) {
    return function (dispatch) {
        const notificationOpts = {
            // uid: 'once-please', // you can specify your own uid if required
            title: 'Error Sistema',
            message: error,
            autoDismiss: tiempo,
            position: 'tc',
        };
        dispatch(Notifications.error(notificationOpts));
    }
}