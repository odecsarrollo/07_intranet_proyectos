const validate = values => {
    const errors = {};

    const requiredFields = [
        'nit',
        'nombre',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;