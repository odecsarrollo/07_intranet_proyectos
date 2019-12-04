const validate = values => {
    const errors = {};

    const requiredFields = [
        'fecha_cobro',
        'recibo_pago',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;