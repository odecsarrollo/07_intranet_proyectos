const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre_tarea',
        'fecha_inicio_tarea',
        'observacion'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;