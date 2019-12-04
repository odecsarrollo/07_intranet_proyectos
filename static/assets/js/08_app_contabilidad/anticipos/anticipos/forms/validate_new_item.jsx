const validate = values => {
    const errors = {};

    const requiredFields = [
        'referencia',
        'descripcion',
        'cantidad',
        'valor_unitario',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;