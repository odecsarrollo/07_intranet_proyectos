const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'sigla',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;