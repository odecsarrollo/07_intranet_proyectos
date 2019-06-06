const validate = values => {
    const errors = {};

    const requiredFields = [
        'tipo',
        'adhesivo',
        'cantidad'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    if (!values['responsable'] && values.tipo == 'S'){
        errors['responsable'] = 'Requerido'
    }
    return errors;
};

export default validate;