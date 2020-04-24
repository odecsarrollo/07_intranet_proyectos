import React from 'react';

const useTengoPermisos = (permissions) => {
    const my_permissions = localStorage.getItem("mis_permisos");
    if (typeof permissions === 'object') {
        return _.mapValues(permissions, p => {
            return my_permissions.includes(p);
        });
    }
    if (!Array.isArray(permissions) && typeof permissions !== 'object') {
        return my_permissions.includes(permissions)
    }
};

export default useTengoPermisos;