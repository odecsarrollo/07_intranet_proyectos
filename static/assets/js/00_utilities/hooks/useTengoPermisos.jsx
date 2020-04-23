import React from 'react';

const tengoPermiso = (permissions, my_permissions) => {
    const validations_array = _.map(permissions, permission => {
        return my_permissions.includes(permission)
    });
    return !validations_array.includes(false);
};

const useTengoPermisos = (permissions) => {
    const my_permissions = localStorage.getItem("mis_permisos");
    if (typeof permissions === 'object') {
        return _.mapValues(permissions, p => tengoPermiso(p, my_permissions));
    }
    if (!Array.isArray(permissions) && typeof permissions !== 'object') {
        return my_permissions.includes(permissions)
    }
};

export default useTengoPermisos;