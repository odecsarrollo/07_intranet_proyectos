const validate = values => {
    const errors = {};
    const requiredFields = [
        'cliente',
        'contacto',
        'ciudad',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;