const validate = values => {
    const errors = {};

    const requiredFields = [
        'descripcion',
        'mes',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;