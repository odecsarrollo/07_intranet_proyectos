const configuracion_costos_validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default configuracion_costos_validate;