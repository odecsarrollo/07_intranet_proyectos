const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre_archivo',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    if ((values.archivo && values.archivo.length === 0) | (!values.archivo)) {
        errors['archivo'] = 'Requerido'
    }
    return errors;
};

export default validate;