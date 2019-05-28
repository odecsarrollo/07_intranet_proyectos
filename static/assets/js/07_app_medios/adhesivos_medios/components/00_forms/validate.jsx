const validate = values => {
    const errors = {};

    const requiredFields = [
        'codigo',
        'alto',
        'ancho'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;