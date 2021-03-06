const validate = values => {
    const errors = {};
    const requiredFields = [
        'cliente_nombre',
        'cliente_nit',
        'cliente',
        'nombres',
        'apellidos',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;