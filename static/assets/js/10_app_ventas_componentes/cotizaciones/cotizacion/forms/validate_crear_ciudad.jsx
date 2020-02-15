const validate = values => {
    const errors = {};
    const requiredFields = [
        'pais_nombre',
        'departamento_nombre',
        'ciudad_nombre',
        'departamento',
        'pais',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;