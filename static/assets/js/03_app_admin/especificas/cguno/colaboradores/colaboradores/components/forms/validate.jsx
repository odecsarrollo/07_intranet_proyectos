const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombres',
        'apellidos',
        'cedula',
        'nro_horas_mes'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    return errors;
};

export default validate;