export function createRequest(request, dispatches = null, callback = null, callback_error = null) {
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

export function tengoPermiso(permisos, permiso) {
    const permisos_array = _.map(permisos, permiso => {
        return permiso
    });
    return permisos_array.includes(permiso);
}