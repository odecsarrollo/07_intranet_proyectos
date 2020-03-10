const validate = values => {
    const errors = {};

    const requiredFields = [
        'new_id',
        'descripcion',
        'decimales',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    return errors;
};

export default validate;