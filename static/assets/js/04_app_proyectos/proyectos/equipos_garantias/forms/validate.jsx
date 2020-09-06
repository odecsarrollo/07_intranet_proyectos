const validate = values => {
    const errors = {};

    const requiredFields = [
        'descripcion',
        'fecha_inicial',
        'fecha_final',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;