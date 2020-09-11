const validate = values => {
    const errors = {};

    const requiredFields = [
        'tipo',
        'tecnico_a_cargo',
        'descripcion',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;