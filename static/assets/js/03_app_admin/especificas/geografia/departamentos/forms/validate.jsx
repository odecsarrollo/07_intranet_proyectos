const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'pais'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    return errors;
};

export default validate;